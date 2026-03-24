import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../lib/prisma'
import { crmClient } from '../lib/internalClient'
import type { ApiError } from '@patient-health/types'

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
      console.error('Audit log write failed:', err)
    })
}

async function assertPatientExists(
  patientId: string,
  correlationId: string,
  reply: FastifyReply
): Promise<boolean> {
  const patient = await prisma.patient.findUnique({
    where: { id: patientId },
    select: { id: true, isActive: true },
  })
  if (!patient || !patient.isActive) {
    await reply.status(404).send(
      buildError(404, 'Not Found', `Patient ${patientId} not found`, correlationId)
    )
    return false
  }
  return true
}

// ─── CRM Clinical Sync ────────────────────────────────────────────────────────

function fireCrmClinicalSync(patientId: string, triggerType: string, correlationId: string) {
  ;(async () => {
    try {
      const [conditions, meds] = await Promise.all([
        prisma.condition.findMany({
          where: { patientId, clinicalStatus: 'active' },
          select: { icd10Code: true, display: true },
          take: 10,
        }),
        prisma.medicationRequest.findMany({
          where: { patientId, status: 'active' },
          select: { medicationName: true, dose: true },
          take: 10,
        }),
      ])
      // Simplified risk heuristic based on active condition count
      const riskLevel = conditions.length >= 3 ? 'high' : conditions.length >= 1 ? 'medium' : 'low'
      await crmClient.clinicalSync({
        emrPatientId: patientId,
        riskLevel,
        activeConditions: conditions.map(c => ({ code: c.icd10Code ?? '', display: c.display })),
        activeMedications: meds.map(m => ({ name: m.medicationName, dose: m.dose ?? undefined })),
        openCareGapCount: 0, // EMR does not track care gaps; CRM manages its own
        triggerType,
      }, correlationId)
    } catch {
      // Never block the main response — swallow all errors
    }
  })()
}

// ─── Immunisation schemas ─────────────────────────────────────────────────────

const createImmunisationSchema = z.object({
  vaccineName: z.string().min(1).max(200),
  vaccineCode: z.string().max(50).optional(),
  occurrenceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  lotNumber: z.string().max(100).optional(),
  site: z.string().max(100).optional(),
  route: z.string().max(100).optional(),
  administeredBy: z.string().max(200).optional(),
  primarySource: z.boolean().default(true),
  notes: z.string().max(2000).optional(),
})

const updateImmunisationSchema = createImmunisationSchema.partial().extend({
  vaccineName: z.string().min(1).max(200).optional(),
  occurrenceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
})

// ─── Observation schemas ──────────────────────────────────────────────────────

const createObservationSchema = z.object({
  display: z.string().min(1).max(200),
  loincCode: z.string().max(20).optional(),
  valueQuantity: z.number().optional(),
  valueUnit: z.string().max(50).optional(),
  valueString: z.string().max(500).optional(),
  referenceRangeLow: z.number().optional(),
  referenceRangeHigh: z.number().optional(),
  isAbnormal: z.boolean().default(false),
  effectiveAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  status: z.string().max(50).default('final'),
  notes: z.string().max(2000).optional(),
})

const updateObservationSchema = createObservationSchema.partial().extend({
  display: z.string().min(1).max(200).optional(),
  effectiveAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
    .optional(),
})

// ─── Condition schemas ────────────────────────────────────────────────────────

const createConditionSchema = z.object({
  display: z.string().min(1).max(200),
  icd10Code: z.string().max(20).optional(),
  snomedCode: z.string().max(20).optional(),
  clinicalStatus: z.enum(['active', 'resolved', 'inactive']).default('active'),
  verificationStatus: z.string().max(50).default('confirmed'),
  severity: z.enum(['mild', 'moderate', 'severe']).optional(),
  onsetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
  notes: z.string().max(2000).optional(),
})

const updateConditionSchema = createConditionSchema.partial().extend({
  display: z.string().min(1).max(200).optional(),
  resolvedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
})

// ─── Allergy schemas ──────────────────────────────────────────────────────────

const createAllergySchema = z.object({
  substance: z.string().min(1).max(200),
  substanceCode: z.string().max(50).optional(),
  type: z.enum(['allergy', 'intolerance']).default('allergy'),
  criticality: z.enum(['low', 'high', 'unable-to-assess']).optional(),
  clinicalStatus: z.string().max(50).default('active'),
  reaction: z.string().max(500).optional(),
  reactionSeverity: z.enum(['mild', 'moderate', 'severe']).optional(),
  onsetDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
    .optional(),
})

const updateAllergySchema = createAllergySchema.partial().extend({
  substance: z.string().min(1).max(200).optional(),
})

// ─── Medication schemas ───────────────────────────────────────────────────────

const createMedicationSchema = z.object({
  medicationName: z.string().min(1).max(200),
  rxNormCode: z.string().max(50).optional(),
  dose: z.string().max(100).optional(),
  frequency: z.string().max(100).optional(),
  route: z.string().max(100).optional(),
  notes: z.string().max(2000).optional(),
})

const updateMedicationSchema = createMedicationSchema.partial().extend({
  medicationName: z.string().min(1).max(200).optional(),
  status: z.enum(['active', 'on-hold', 'stopped', 'completed']).optional(),
})

// ─── Route params ─────────────────────────────────────────────────────────────

interface PatientParams {
  patientId: string
}

interface PatientItemParams {
  patientId: string
  id: string
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export async function clinicalRoutes(fastify: FastifyInstance) {
  // ══════════════════════════════════════════════════════════════════════════
  // CONDITIONS (PROBLEMS)
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * GET /api/patients/:patientId/conditions
   */
  fastify.get(
    '/api/patients/:patientId/conditions',
    async (request: FastifyRequest<{ Params: PatientParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const conditions = await prisma.condition.findMany({
        where: { patientId },
        orderBy: [{ clinicalStatus: 'asc' }, { onsetDate: 'desc' }, { recordedAt: 'desc' }],
      })

      writeAuditLog({ patientId, userId, action: 'READ', resourceType: 'Condition', ipAddress: request.ip, correlationId })
      return reply.status(200).send({ data: conditions })
    }
  )

  /**
   * POST /api/patients/:patientId/conditions
   */
  fastify.post(
    '/api/patients/:patientId/conditions',
    async (request: FastifyRequest<{ Params: PatientParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const body = createConditionSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
      }

      const { onsetDate, ...rest } = body.data
      const condition = await prisma.condition.create({
        data: {
          ...rest,
          patientId,
          onsetDate: onsetDate ? new Date(onsetDate) : null,
          recordedBy: userId,
        },
      })

      writeAuditLog({ patientId, userId, action: 'CREATE', resourceType: 'Condition', resourceId: condition.id, ipAddress: request.ip, correlationId })
      fireCrmClinicalSync(patientId, 'problem_added', correlationId)

      return reply.status(201).send({ data: condition })
    }
  )

  /**
   * PUT /api/patients/:patientId/conditions/:id
   */
  fastify.put(
    '/api/patients/:patientId/conditions/:id',
    async (request: FastifyRequest<{ Params: PatientItemParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId, id } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const body = updateConditionSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
      }

      const existing = await prisma.condition.findFirst({ where: { id, patientId }, select: { id: true } })
      if (!existing) {
        return reply.status(404).send(buildError(404, 'Not Found', `Condition ${id} not found`, correlationId))
      }

      const { onsetDate, resolvedDate, ...rest } = body.data
      const updated = await prisma.condition.update({
        where: { id },
        data: {
          ...rest,
          onsetDate: onsetDate ? new Date(onsetDate) : undefined,
          resolvedDate: resolvedDate ? new Date(resolvedDate) : undefined,
        },
      })

      writeAuditLog({ patientId, userId, action: 'UPDATE', resourceType: 'Condition', resourceId: id, ipAddress: request.ip, correlationId })
      fireCrmClinicalSync(patientId, 'condition_updated', correlationId)

      return reply.status(200).send({ data: updated })
    }
  )

  /**
   * DELETE /api/patients/:patientId/conditions/:id
   */
  fastify.delete(
    '/api/patients/:patientId/conditions/:id',
    async (request: FastifyRequest<{ Params: PatientItemParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId, id } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const existing = await prisma.condition.findFirst({ where: { id, patientId }, select: { id: true } })
      if (!existing) {
        return reply.status(404).send(buildError(404, 'Not Found', `Condition ${id} not found`, correlationId))
      }

      await prisma.condition.delete({ where: { id } })
      writeAuditLog({ patientId, userId, action: 'DELETE', resourceType: 'Condition', resourceId: id, ipAddress: request.ip, correlationId })
      fireCrmClinicalSync(patientId, 'condition_removed', correlationId)

      return reply.status(204).send()
    }
  )

  // ══════════════════════════════════════════════════════════════════════════
  // IMMUNISATIONS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * GET /api/patients/:patientId/immunisations
   */
  fastify.get(
    '/api/patients/:patientId/immunisations',
    async (request: FastifyRequest<{ Params: PatientParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const immunisations = await prisma.immunisation.findMany({
        where: { patientId },
        orderBy: { occurrenceDate: 'desc' },
      })

      writeAuditLog({
        patientId,
        userId,
        action: 'READ',
        resourceType: 'Immunisation',
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(200).send({ data: immunisations })
    }
  )

  /**
   * POST /api/patients/:patientId/immunisations
   */
  fastify.post(
    '/api/patients/:patientId/immunisations',
    async (request: FastifyRequest<{ Params: PatientParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const parseResult = createImmunisationSchema.safeParse(request.body)
      if (!parseResult.success) {
        return reply.status(400).send(
          buildError(400, 'Bad Request', parseResult.error.errors[0].message, correlationId)
        )
      }

      const dto = parseResult.data

      const immunisation = await prisma.immunisation.create({
        data: {
          patientId,
          vaccineName: dto.vaccineName,
          vaccineCode: dto.vaccineCode,
          occurrenceDate: new Date(dto.occurrenceDate),
          lotNumber: dto.lotNumber,
          site: dto.site,
          route: dto.route,
          administeredBy: dto.administeredBy,
          primarySource: dto.primarySource,
          notes: dto.notes,
        },
      })

      writeAuditLog({
        patientId,
        userId,
        action: 'CREATE',
        resourceType: 'Immunisation',
        resourceId: immunisation.id,
        changes: { vaccineName: dto.vaccineName },
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(201).send({ data: immunisation })
    }
  )

  /**
   * PUT /api/patients/:patientId/immunisations/:id
   */
  fastify.put(
    '/api/patients/:patientId/immunisations/:id',
    async (request: FastifyRequest<{ Params: PatientItemParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId, id } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const existing = await prisma.immunisation.findUnique({ where: { id } })
      if (!existing || existing.patientId !== patientId) {
        return reply.status(404).send(
          buildError(404, 'Not Found', `Immunisation ${id} not found for this patient`, correlationId)
        )
      }

      const parseResult = updateImmunisationSchema.safeParse(request.body)
      if (!parseResult.success) {
        return reply.status(400).send(
          buildError(400, 'Bad Request', parseResult.error.errors[0].message, correlationId)
        )
      }

      const dto = parseResult.data

      const updated = await prisma.immunisation.update({
        where: { id },
        data: {
          ...(dto.vaccineName !== undefined && { vaccineName: dto.vaccineName }),
          ...(dto.vaccineCode !== undefined && { vaccineCode: dto.vaccineCode }),
          ...(dto.occurrenceDate !== undefined && { occurrenceDate: new Date(dto.occurrenceDate) }),
          ...(dto.lotNumber !== undefined && { lotNumber: dto.lotNumber }),
          ...(dto.site !== undefined && { site: dto.site }),
          ...(dto.route !== undefined && { route: dto.route }),
          ...(dto.administeredBy !== undefined && { administeredBy: dto.administeredBy }),
          ...(dto.primarySource !== undefined && { primarySource: dto.primarySource }),
          ...(dto.notes !== undefined && { notes: dto.notes }),
        },
      })

      writeAuditLog({
        patientId,
        userId,
        action: 'UPDATE',
        resourceType: 'Immunisation',
        resourceId: id,
        changes: dto as Record<string, unknown>,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(200).send({ data: updated })
    }
  )

  /**
   * DELETE /api/patients/:patientId/immunisations/:id
   */
  fastify.delete(
    '/api/patients/:patientId/immunisations/:id',
    async (request: FastifyRequest<{ Params: PatientItemParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId, id } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const existing = await prisma.immunisation.findUnique({ where: { id } })
      if (!existing || existing.patientId !== patientId) {
        return reply.status(404).send(
          buildError(404, 'Not Found', `Immunisation ${id} not found for this patient`, correlationId)
        )
      }

      await prisma.immunisation.delete({ where: { id } })

      writeAuditLog({
        patientId,
        userId,
        action: 'DELETE',
        resourceType: 'Immunisation',
        resourceId: id,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(204).send()
    }
  )

  // ══════════════════════════════════════════════════════════════════════════
  // LAB RESULTS (Observations, category = 'laboratory')
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * GET /api/patients/:patientId/observations
   */
  fastify.get(
    '/api/patients/:patientId/observations',
    async (request: FastifyRequest<{ Params: PatientParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const observations = await prisma.observation.findMany({
        where: { patientId, category: 'laboratory' },
        orderBy: { effectiveAt: 'desc' },
      })

      writeAuditLog({
        patientId,
        userId,
        action: 'READ',
        resourceType: 'Observation',
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(200).send({ data: observations })
    }
  )

  /**
   * POST /api/patients/:patientId/observations
   */
  fastify.post(
    '/api/patients/:patientId/observations',
    async (request: FastifyRequest<{ Params: PatientParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const parseResult = createObservationSchema.safeParse(request.body)
      if (!parseResult.success) {
        return reply.status(400).send(
          buildError(400, 'Bad Request', parseResult.error.errors[0].message, correlationId)
        )
      }

      const dto = parseResult.data

      const observation = await prisma.observation.create({
        data: {
          patientId,
          category: 'laboratory',
          display: dto.display,
          loincCode: dto.loincCode,
          valueQuantity: dto.valueQuantity,
          valueUnit: dto.valueUnit,
          valueString: dto.valueString,
          referenceRangeLow: dto.referenceRangeLow,
          referenceRangeHigh: dto.referenceRangeHigh,
          isAbnormal: dto.isAbnormal,
          effectiveAt: new Date(dto.effectiveAt),
          status: dto.status,
          recordedBy: userId,
        },
      })

      writeAuditLog({
        patientId,
        userId,
        action: 'CREATE',
        resourceType: 'Observation',
        resourceId: observation.id,
        changes: { display: dto.display },
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(201).send({ data: observation })
    }
  )

  /**
   * PUT /api/patients/:patientId/observations/:id
   */
  fastify.put(
    '/api/patients/:patientId/observations/:id',
    async (request: FastifyRequest<{ Params: PatientItemParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId, id } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const existing = await prisma.observation.findUnique({ where: { id } })
      if (!existing || existing.patientId !== patientId || existing.category !== 'laboratory') {
        return reply.status(404).send(
          buildError(404, 'Not Found', `Observation ${id} not found for this patient`, correlationId)
        )
      }

      const parseResult = updateObservationSchema.safeParse(request.body)
      if (!parseResult.success) {
        return reply.status(400).send(
          buildError(400, 'Bad Request', parseResult.error.errors[0].message, correlationId)
        )
      }

      const dto = parseResult.data

      const updated = await prisma.observation.update({
        where: { id },
        data: {
          ...(dto.display !== undefined && { display: dto.display }),
          ...(dto.loincCode !== undefined && { loincCode: dto.loincCode }),
          ...(dto.valueQuantity !== undefined && { valueQuantity: dto.valueQuantity }),
          ...(dto.valueUnit !== undefined && { valueUnit: dto.valueUnit }),
          ...(dto.valueString !== undefined && { valueString: dto.valueString }),
          ...(dto.referenceRangeLow !== undefined && { referenceRangeLow: dto.referenceRangeLow }),
          ...(dto.referenceRangeHigh !== undefined && { referenceRangeHigh: dto.referenceRangeHigh }),
          ...(dto.isAbnormal !== undefined && { isAbnormal: dto.isAbnormal }),
          ...(dto.effectiveAt !== undefined && { effectiveAt: new Date(dto.effectiveAt) }),
          ...(dto.status !== undefined && { status: dto.status }),
        },
      })

      writeAuditLog({
        patientId,
        userId,
        action: 'UPDATE',
        resourceType: 'Observation',
        resourceId: id,
        changes: dto as Record<string, unknown>,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(200).send({ data: updated })
    }
  )

  /**
   * DELETE /api/patients/:patientId/observations/:id
   */
  fastify.delete(
    '/api/patients/:patientId/observations/:id',
    async (request: FastifyRequest<{ Params: PatientItemParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId, id } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const existing = await prisma.observation.findUnique({ where: { id } })
      if (!existing || existing.patientId !== patientId || existing.category !== 'laboratory') {
        return reply.status(404).send(
          buildError(404, 'Not Found', `Observation ${id} not found for this patient`, correlationId)
        )
      }

      await prisma.observation.delete({ where: { id } })

      writeAuditLog({
        patientId,
        userId,
        action: 'DELETE',
        resourceType: 'Observation',
        resourceId: id,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(204).send()
    }
  )

  // ══════════════════════════════════════════════════════════════════════════
  // ALLERGIES
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * GET /api/patients/:patientId/allergies
   */
  fastify.get(
    '/api/patients/:patientId/allergies',
    async (request: FastifyRequest<{ Params: PatientParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const allergies = await prisma.allergyIntolerance.findMany({
        where: { patientId },
        orderBy: { recordedAt: 'desc' },
      })

      writeAuditLog({
        patientId,
        userId,
        action: 'READ',
        resourceType: 'AllergyIntolerance',
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(200).send({ data: allergies })
    }
  )

  /**
   * POST /api/patients/:patientId/allergies
   */
  fastify.post(
    '/api/patients/:patientId/allergies',
    async (request: FastifyRequest<{ Params: PatientParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const parseResult = createAllergySchema.safeParse(request.body)
      if (!parseResult.success) {
        return reply.status(400).send(
          buildError(400, 'Bad Request', parseResult.error.errors[0].message, correlationId)
        )
      }

      const dto = parseResult.data

      const allergy = await prisma.allergyIntolerance.create({
        data: {
          patientId,
          substance: dto.substance,
          substanceCode: dto.substanceCode,
          type: dto.type,
          criticality: dto.criticality,
          clinicalStatus: dto.clinicalStatus,
          reaction: dto.reaction,
          reactionSeverity: dto.reactionSeverity,
          onsetDate: dto.onsetDate ? new Date(dto.onsetDate) : undefined,
          recordedBy: userId,
        },
      })

      writeAuditLog({
        patientId,
        userId,
        action: 'CREATE',
        resourceType: 'AllergyIntolerance',
        resourceId: allergy.id,
        changes: { substance: dto.substance },
        ipAddress: request.ip,
        correlationId,
      })

      // Fire-and-forget: sync clinical update to CRM
      fireCrmClinicalSync(patientId, 'allergy_added', correlationId)

      return reply.status(201).send({ data: allergy })
    }
  )

  /**
   * PUT /api/patients/:patientId/allergies/:id
   */
  fastify.put(
    '/api/patients/:patientId/allergies/:id',
    async (request: FastifyRequest<{ Params: PatientItemParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId, id } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const existing = await prisma.allergyIntolerance.findUnique({ where: { id } })
      if (!existing || existing.patientId !== patientId) {
        return reply.status(404).send(
          buildError(404, 'Not Found', `Allergy ${id} not found for this patient`, correlationId)
        )
      }

      const parseResult = updateAllergySchema.safeParse(request.body)
      if (!parseResult.success) {
        return reply.status(400).send(
          buildError(400, 'Bad Request', parseResult.error.errors[0].message, correlationId)
        )
      }

      const dto = parseResult.data

      const updated = await prisma.allergyIntolerance.update({
        where: { id },
        data: {
          ...(dto.substance !== undefined && { substance: dto.substance }),
          ...(dto.substanceCode !== undefined && { substanceCode: dto.substanceCode }),
          ...(dto.type !== undefined && { type: dto.type }),
          ...(dto.criticality !== undefined && { criticality: dto.criticality }),
          ...(dto.clinicalStatus !== undefined && { clinicalStatus: dto.clinicalStatus }),
          ...(dto.reaction !== undefined && { reaction: dto.reaction }),
          ...(dto.reactionSeverity !== undefined && { reactionSeverity: dto.reactionSeverity }),
          ...(dto.onsetDate !== undefined && {
            onsetDate: dto.onsetDate ? new Date(dto.onsetDate) : null,
          }),
        },
      })

      writeAuditLog({
        patientId,
        userId,
        action: 'UPDATE',
        resourceType: 'AllergyIntolerance',
        resourceId: id,
        changes: dto as Record<string, unknown>,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(200).send({ data: updated })
    }
  )

  /**
   * DELETE /api/patients/:patientId/allergies/:id
   */
  fastify.delete(
    '/api/patients/:patientId/allergies/:id',
    async (request: FastifyRequest<{ Params: PatientItemParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId, id } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const existing = await prisma.allergyIntolerance.findUnique({ where: { id } })
      if (!existing || existing.patientId !== patientId) {
        return reply.status(404).send(
          buildError(404, 'Not Found', `Allergy ${id} not found for this patient`, correlationId)
        )
      }

      await prisma.allergyIntolerance.delete({ where: { id } })

      writeAuditLog({
        patientId,
        userId,
        action: 'DELETE',
        resourceType: 'AllergyIntolerance',
        resourceId: id,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(204).send()
    }
  )

  // ══════════════════════════════════════════════════════════════════════════
  // MEDICATIONS
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * GET /api/patients/:patientId/medications
   */
  fastify.get(
    '/api/patients/:patientId/medications',
    async (request: FastifyRequest<{ Params: PatientParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const medications = await prisma.medicationRequest.findMany({
        where: { patientId },
        orderBy: { prescribedAt: 'desc' },
      })

      writeAuditLog({
        patientId,
        userId,
        action: 'READ',
        resourceType: 'MedicationRequest',
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(200).send({ data: medications })
    }
  )

  /**
   * POST /api/patients/:patientId/medications
   */
  fastify.post(
    '/api/patients/:patientId/medications',
    async (request: FastifyRequest<{ Params: PatientParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const parseResult = createMedicationSchema.safeParse(request.body)
      if (!parseResult.success) {
        return reply.status(400).send(
          buildError(400, 'Bad Request', parseResult.error.errors[0].message, correlationId)
        )
      }

      const dto = parseResult.data

      const medication = await prisma.medicationRequest.create({
        data: {
          patientId,
          medicationName: dto.medicationName,
          rxNormCode: dto.rxNormCode,
          dose: dto.dose,
          frequency: dto.frequency,
          route: dto.route,
          notes: dto.notes,
          prescribedBy: userId,
        },
      })

      writeAuditLog({
        patientId,
        userId,
        action: 'CREATE',
        resourceType: 'MedicationRequest',
        resourceId: medication.id,
        changes: { medicationName: dto.medicationName },
        ipAddress: request.ip,
        correlationId,
      })

      // Fire-and-forget: sync clinical update to CRM
      fireCrmClinicalSync(patientId, 'medication_added', correlationId)

      return reply.status(201).send({ data: medication })
    }
  )

  /**
   * PUT /api/patients/:patientId/medications/:id
   */
  fastify.put(
    '/api/patients/:patientId/medications/:id',
    async (request: FastifyRequest<{ Params: PatientItemParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId, id } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const existing = await prisma.medicationRequest.findUnique({ where: { id } })
      if (!existing || existing.patientId !== patientId) {
        return reply.status(404).send(
          buildError(404, 'Not Found', `Medication ${id} not found for this patient`, correlationId)
        )
      }

      const parseResult = updateMedicationSchema.safeParse(request.body)
      if (!parseResult.success) {
        return reply.status(400).send(
          buildError(400, 'Bad Request', parseResult.error.errors[0].message, correlationId)
        )
      }

      const dto = parseResult.data

      const updated = await prisma.medicationRequest.update({
        where: { id },
        data: {
          ...(dto.medicationName !== undefined && { medicationName: dto.medicationName }),
          ...(dto.rxNormCode !== undefined && { rxNormCode: dto.rxNormCode }),
          ...(dto.dose !== undefined && { dose: dto.dose }),
          ...(dto.frequency !== undefined && { frequency: dto.frequency }),
          ...(dto.route !== undefined && { route: dto.route }),
          ...(dto.notes !== undefined && { notes: dto.notes }),
          ...(dto.status !== undefined && { status: dto.status }),
        },
      })

      writeAuditLog({
        patientId,
        userId,
        action: 'UPDATE',
        resourceType: 'MedicationRequest',
        resourceId: id,
        changes: dto as Record<string, unknown>,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(200).send({ data: updated })
    }
  )

  /**
   * DELETE /api/patients/:patientId/medications/:id
   * Soft-delete: sets status to 'stopped' and records discontinuedAt.
   * Hard deletion is prohibited for clinical audit integrity.
   */
  fastify.delete(
    '/api/patients/:patientId/medications/:id',
    async (request: FastifyRequest<{ Params: PatientItemParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId, id } = request.params
      const userId = getUserId(request)

      if (!(await assertPatientExists(patientId, correlationId, reply))) return

      const existing = await prisma.medicationRequest.findUnique({ where: { id } })
      if (!existing || existing.patientId !== patientId) {
        return reply.status(404).send(
          buildError(404, 'Not Found', `Medication ${id} not found for this patient`, correlationId)
        )
      }

      const updated = await prisma.medicationRequest.update({
        where: { id },
        data: {
          status: 'stopped',
          discontinuedAt: new Date(),
          discontinuedBy: userId,
        },
      })

      writeAuditLog({
        patientId,
        userId,
        action: 'DELETE',
        resourceType: 'MedicationRequest',
        resourceId: id,
        changes: { status: 'stopped', discontinuedAt: updated.discontinuedAt },
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(200).send({ data: updated })
    }
  )
}
