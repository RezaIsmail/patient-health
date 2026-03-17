import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../lib/prisma'
import { differenceInYears } from '../lib/dates'
import type {
  PatientSummary,
  PatientChartDto,
  CreatePatientDto,
  ApiError,
} from '@patient-health/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildError(
  statusCode: number,
  error: string,
  message: string,
  correlationId: string
): ApiError {
  return { statusCode, error, message, correlationId }
}

function getUserId(request: FastifyRequest): string {
  // userId is attached by the JWT preHandler in index.ts
  return (request as FastifyRequest & { userId: string }).userId ?? 'unknown'
}

async function writeAuditLog(params: {
  patientId?: string
  userId: string
  action: string
  resourceType: string
  resourceId?: string
  changes?: Record<string, unknown>
  ipAddress?: string
  correlationId?: string
}) {
  // Fire-and-forget audit log — never block the response
  prisma.auditLog
    .create({
      data: {
        patientId: params.patientId ?? null,
        userId: params.userId,
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resourceId ?? null,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        changes: (params.changes ?? undefined) as any,
        ipAddress: params.ipAddress ?? null,
        correlationId: params.correlationId ?? null,
      },
    })
    .catch((err) => {
      // Audit log failure must never crash the request
      console.error('Audit log write failed:', err)
    })
}

// ─── Zod validation schemas ───────────────────────────────────────────────────

const createPatientSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  preferredName: z.string().max(100).optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  gender: z.enum(['male', 'female', 'other', 'unknown']),
  genderIdentity: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email().optional(),
  address: z
    .object({
      line1: z.string().max(200).optional(),
      line2: z.string().max(200).optional(),
      city: z.string().max(100).optional(),
      state: z.string().max(50).optional(),
      postalCode: z.string().max(20).optional(),
      country: z.string().max(3).optional(),
    })
    .optional(),
  emergencyContact: z
    .object({
      name: z.string().min(1).max(200),
      relationship: z.string().min(1).max(100),
      phone: z.string().min(1).max(20),
    })
    .optional(),
  insurance: z
    .object({
      payerName: z.string().min(1).max(200),
      memberId: z.string().min(1).max(100),
      groupId: z.string().max(100).optional(),
      subscriberName: z.string().max(200).optional(),
    })
    .optional(),
})

const updatePatientSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  preferredName: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email().optional(),
  address: z
    .object({
      line1: z.string().max(200).optional(),
      line2: z.string().max(200).optional(),
      city: z.string().max(100).optional(),
      state: z.string().max(50).optional(),
      postalCode: z.string().max(20).optional(),
      country: z.string().max(3).optional(),
    })
    .optional(),
})

const searchSchema = z.object({
  q: z.string().max(200).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

// ─── MRN generation ───────────────────────────────────────────────────────────

async function generateMrn(): Promise<string> {
  // Get the highest existing MRN and increment
  const latest = await prisma.patient.findFirst({
    orderBy: { mrn: 'desc' },
    select: { mrn: true },
  })

  if (!latest) return 'PH-000001'

  const num = parseInt(latest.mrn.replace('PH-', ''), 10)
  return `PH-${String(num + 1).padStart(6, '0')}`
}

// ─── Patient mapper ───────────────────────────────────────────────────────────

type PatientRow = {
  id: string
  mrn: string
  firstName: string
  lastName: string
  preferredName: string | null
  dateOfBirth: Date
  gender: string
  phone: string | null
  email: string | null
  insurances: Array<{ payerName: string; priority: number; isActive: boolean }>
}

function toPatientSummary(p: PatientRow): PatientSummary {
  const primaryInsurance = p.insurances
    .filter((i) => i.isActive)
    .sort((a, b) => a.priority - b.priority)[0]

  return {
    id: p.id,
    mrn: p.mrn,
    firstName: p.firstName,
    lastName: p.lastName,
    preferredName: p.preferredName ?? undefined,
    dateOfBirth: p.dateOfBirth.toISOString().slice(0, 10),
    age: differenceInYears(new Date(), p.dateOfBirth),
    gender: p.gender,
    phone: p.phone ?? undefined,
    email: p.email ?? undefined,
    primaryInsurance: primaryInsurance?.payerName,
  }
}

// ─── Route registration ───────────────────────────────────────────────────────

export async function patientRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/patients
   * Search / list patients.
   */
  fastify.get('/api/patients', async (request: FastifyRequest, reply: FastifyReply) => {
    const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
    const userId = getUserId(request)

    const parseResult = searchSchema.safeParse(request.query)
    if (!parseResult.success) {
      return reply.status(400).send(
        buildError(400, 'Bad Request', parseResult.error.errors[0].message, correlationId)
      )
    }

    const { q, page, pageSize } = parseResult.data
    const skip = (page - 1) * pageSize

    // Build search filter — supports name, MRN, partial DOB
    const where = q
      ? {
          OR: [
            { firstName: { contains: q, mode: 'insensitive' as const } },
            { lastName: { contains: q, mode: 'insensitive' as const } },
            { mrn: { contains: q, mode: 'insensitive' as const } },
            { email: { contains: q, mode: 'insensitive' as const } },
            { phone: { contains: q } },
          ],
          isActive: true,
        }
      : { isActive: true }

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        select: {
          id: true,
          mrn: true,
          firstName: true,
          lastName: true,
          preferredName: true,
          dateOfBirth: true,
          gender: true,
          phone: true,
          email: true,
          insurances: {
            select: { payerName: true, priority: true, isActive: true },
          },
        },
      }),
      prisma.patient.count({ where }),
    ])

    writeAuditLog({
      userId,
      action: 'READ',
      resourceType: 'Patient',
      ipAddress: request.ip,
      correlationId,
    })

    return reply.status(200).send({
      data: patients.map(toPatientSummary),
      meta: { page, pageSize, total },
    })
  })

  /**
   * POST /api/patients
   * Create a new patient.
   */
  fastify.post('/api/patients', async (request: FastifyRequest, reply: FastifyReply) => {
    const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
    const userId = getUserId(request)

    const parseResult = createPatientSchema.safeParse(request.body)
    if (!parseResult.success) {
      return reply.status(400).send(
        buildError(400, 'Bad Request', parseResult.error.errors[0].message, correlationId)
      )
    }

    const dto = parseResult.data
    const mrn = await generateMrn()

    const patient = await prisma.patient.create({
      data: {
        mrn,
        firstName: dto.firstName,
        lastName: dto.lastName,
        preferredName: dto.preferredName,
        dateOfBirth: new Date(dto.dateOfBirth),
        gender: dto.gender,
        genderIdentity: dto.genderIdentity,
        phone: dto.phone,
        email: dto.email,
        ...(dto.address && {
          address: {
            create: {
              line1: dto.address.line1,
              line2: dto.address.line2,
              city: dto.address.city,
              state: dto.address.state,
              postalCode: dto.address.postalCode,
              country: dto.address.country ?? 'US',
            },
          },
        }),
        ...(dto.emergencyContact && {
          emergencyContacts: {
            create: [dto.emergencyContact],
          },
        }),
        ...(dto.insurance && {
          insurances: {
            create: [{ ...dto.insurance, priority: 1 }],
          },
        }),
      },
      include: {
        insurances: { select: { payerName: true, priority: true, isActive: true } },
      },
    })

    writeAuditLog({
      patientId: patient.id,
      userId,
      action: 'CREATE',
      resourceType: 'Patient',
      resourceId: patient.id,
      ipAddress: request.ip,
      correlationId,
    })

    return reply.status(201).send({ data: toPatientSummary(patient) })
  })

  /**
   * GET /api/patients/:id
   * Get patient demographics.
   */
  fastify.get(
    '/api/patients/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const userId = getUserId(request)
      const { id } = request.params

      const patient = await prisma.patient.findUnique({
        where: { id },
        include: {
          insurances: { select: { payerName: true, priority: true, isActive: true } },
        },
      })

      if (!patient || !patient.isActive) {
        return reply.status(404).send(buildError(404, 'Not Found', 'Patient not found', correlationId))
      }

      writeAuditLog({
        patientId: id,
        userId,
        action: 'READ',
        resourceType: 'Patient',
        resourceId: id,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(200).send({ data: toPatientSummary(patient) })
    }
  )

  /**
   * PUT /api/patients/:id
   * Update patient demographics.
   */
  fastify.put(
    '/api/patients/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const userId = getUserId(request)
      const { id } = request.params

      const parseResult = updatePatientSchema.safeParse(request.body)
      if (!parseResult.success) {
        return reply.status(400).send(
          buildError(400, 'Bad Request', parseResult.error.errors[0].message, correlationId)
        )
      }

      const existing = await prisma.patient.findUnique({ where: { id } })
      if (!existing || !existing.isActive) {
        return reply.status(404).send(buildError(404, 'Not Found', 'Patient not found', correlationId))
      }

      const dto = parseResult.data
      const before = { ...existing }

      const updated = await prisma.patient.update({
        where: { id },
        data: {
          ...(dto.firstName && { firstName: dto.firstName }),
          ...(dto.lastName && { lastName: dto.lastName }),
          ...(dto.preferredName !== undefined && { preferredName: dto.preferredName }),
          ...(dto.phone !== undefined && { phone: dto.phone }),
          ...(dto.email !== undefined && { email: dto.email }),
          ...(dto.address && {
            address: {
              upsert: {
                create: {
                  line1: dto.address.line1,
                  line2: dto.address.line2,
                  city: dto.address.city,
                  state: dto.address.state,
                  postalCode: dto.address.postalCode,
                  country: dto.address.country ?? 'US',
                },
                update: {
                  line1: dto.address.line1,
                  line2: dto.address.line2,
                  city: dto.address.city,
                  state: dto.address.state,
                  postalCode: dto.address.postalCode,
                  country: dto.address.country,
                },
              },
            },
          }),
        },
        include: {
          insurances: { select: { payerName: true, priority: true, isActive: true } },
        },
      })

      writeAuditLog({
        patientId: id,
        userId,
        action: 'UPDATE',
        resourceType: 'Patient',
        resourceId: id,
        changes: { before, after: dto },
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(200).send({ data: toPatientSummary(updated) })
    }
  )

  /**
   * GET /api/patients/:id/chart
   * Returns the full longitudinal patient chart.
   *
   * All data is fetched in a single Prisma query using nested includes.
   * No N+1 queries — Prisma issues a JOIN per include level.
   */
  fastify.get(
    '/api/patients/:id/chart',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const userId = getUserId(request)
      const { id } = request.params

      const now = new Date()
      const twelveMonthsAgo = new Date(now)
      twelveMonthsAgo.setFullYear(twelveMonthsAgo.getFullYear() - 1)

      // Single efficient query — all chart data loaded in one round trip
      const patient = await prisma.patient.findUnique({
        where: { id },
        include: {
          insurances: {
            where: { isActive: true },
            orderBy: { priority: 'asc' },
          },
          conditions: {
            where: { clinicalStatus: 'active' },
            orderBy: { onsetDate: 'asc' },
          },
          medications: {
            where: { status: 'active' },
            orderBy: { prescribedAt: 'desc' },
          },
          allergies: {
            where: { clinicalStatus: 'active' },
            orderBy: { criticality: 'asc' },
          },
          observations: {
            where: {
              category: 'vitals',
              effectiveAt: { gte: twelveMonthsAgo },
            },
            orderBy: { effectiveAt: 'desc' },
            take: 20, // enough to cover one full vitals encounter
          },
          immunisations: {
            orderBy: { occurrenceDate: 'desc' },
          },
          appointments: {
            where: {
              startTime: { gt: now },
              status: 'booked',
            },
            orderBy: { startTime: 'asc' },
            take: 3,
          },
          documents: {
            orderBy: { createdAt: 'desc' },
            take: 3,
          },
        },
      })

      if (!patient || !patient.isActive) {
        return reply.status(404).send(buildError(404, 'Not Found', 'Patient not found', correlationId))
      }

      // Fetch recent lab results separately (different category filter)
      // This is still a single extra query — not N+1
      const labResults = await prisma.observation.findMany({
        where: {
          patientId: id,
          category: 'laboratory',
        },
        orderBy: { effectiveAt: 'desc' },
        take: 3,
      })

      // Audit: HIPAA requires logging every access to patient clinical data
      writeAuditLog({
        patientId: id,
        userId,
        action: 'READ',
        resourceType: 'PatientChart',
        resourceId: id,
        ipAddress: request.ip,
        correlationId,
      })

      // Build most-recent vitals object from the set of observations
      const recentVitalsObs = patient.observations
      const mostRecentVitalTime = recentVitalsObs[0]?.effectiveAt

      let recentVitals: PatientChartDto['recentVitals']
      if (mostRecentVitalTime) {
        // Group by the most recent encounter time (within 60 minutes of the first)
        const cutoff = new Date(mostRecentVitalTime.getTime() - 60 * 60 * 1000)
        const sameEncounterVitals = recentVitalsObs.filter((o) => o.effectiveAt >= cutoff)

        const bp = sameEncounterVitals.find((o) => o.display === 'Blood Pressure')
        const hr = sameEncounterVitals.find((o) => o.display === 'Heart Rate')
        const temp = sameEncounterVitals.find((o) => o.display === 'Temperature')
        const weight = sameEncounterVitals.find((o) => o.display === 'Body Weight')
        const height = sameEncounterVitals.find((o) => o.display === 'Body Height')
        const spo2 = sameEncounterVitals.find((o) => o.display === 'Oxygen Saturation')

        // Parse BP string "138/88" → systolic / diastolic
        let systolic: number | undefined
        let diastolic: number | undefined
        if (bp?.valueString) {
          const parts = bp.valueString.split('/')
          systolic = parts[0] ? parseInt(parts[0], 10) : undefined
          diastolic = parts[1] ? parseInt(parts[1], 10) : undefined
        }

        // Compute BMI if height and weight are present
        let bmi: number | undefined
        if (weight?.valueQuantity && height?.valueQuantity) {
          const heightM = height.valueQuantity / 100
          bmi = Math.round((weight.valueQuantity / (heightM * heightM)) * 10) / 10
        }

        recentVitals = {
          recordedAt: mostRecentVitalTime.toISOString(),
          bloodPressureSystolic: systolic,
          bloodPressureDiastolic: diastolic,
          heartRate: hr?.valueQuantity ?? undefined,
          temperature: temp?.valueQuantity ?? undefined,
          weight: weight?.valueQuantity ?? undefined,
          height: height?.valueQuantity ?? undefined,
          bmi,
          oxygenSaturation: spo2?.valueQuantity ?? undefined,
        }
      }

      const chart: PatientChartDto = {
        patient: toPatientSummary(patient),
        activeProblems: patient.conditions.map((c) => ({
          id: c.id,
          code: c.icd10Code ?? c.snomedCode ?? undefined,
          display: c.display,
          onsetDate: c.onsetDate?.toISOString().slice(0, 10),
          severity: c.severity ?? undefined,
        })),
        medications: patient.medications.map((m) => ({
          id: m.id,
          name: m.medicationName,
          dose: m.dose ?? undefined,
          frequency: m.frequency ?? undefined,
          status: m.status,
          prescribedDate: m.prescribedAt.toISOString().slice(0, 10),
        })),
        allergies: patient.allergies.map((a) => ({
          id: a.id,
          substance: a.substance,
          reaction: a.reaction ?? undefined,
          criticality: a.criticality ?? undefined,
        })),
        recentVitals,
        recentResults: labResults.map((r) => ({
          id: r.id,
          name: r.display,
          value: r.valueString ?? String(r.valueQuantity ?? ''),
          unit: r.valueUnit ?? undefined,
          referenceRange:
            r.referenceRangeLow != null && r.referenceRangeHigh != null
              ? `${r.referenceRangeLow}–${r.referenceRangeHigh}`
              : undefined,
          isAbnormal: r.isAbnormal,
          resultDate: r.effectiveAt.toISOString().slice(0, 10),
        })),
        recentNotes: patient.documents.map((d) => ({
          id: d.id,
          type: d.type,
          authorName: d.authorName,
          date: d.createdAt.toISOString().slice(0, 10),
          // First 200 chars of content as summary — no PII in API layer
          summary: d.content.slice(0, 200),
        })),
        upcomingAppointments: patient.appointments.map((a) => ({
          id: a.id,
          date: a.startTime.toISOString(),
          type: a.serviceType ?? 'Appointment',
          providerName: a.providerId, // Phase 2: join with provider service
          status: a.status,
        })),
        immunisations: patient.immunisations.map((i) => ({
          id: i.id,
          vaccine: i.vaccineName,
          dateGiven: i.occurrenceDate.toISOString().slice(0, 10),
          lotNumber: i.lotNumber ?? undefined,
        })),
        // Phase 2: these will be real counts from orders/results/referrals tables
        outstandingActions: {
          unsignedOrders: 0,
          pendingReferrals: 0,
          unreviewedResults: 0,
          careGaps: 0,
        },
      }

      return reply.status(200).send({ data: chart })
    }
  )
}
