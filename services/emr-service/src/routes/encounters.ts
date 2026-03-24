import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../lib/prisma'
import type { EncounterDetailDto, EncounterSummary, InboxItemDto } from '@patient-health/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getUserId(request: FastifyRequest): string {
  return (request as FastifyRequest & { userId: string }).userId ?? 'unknown'
}

function toSummary(enc: {
  id: string
  status: string
  encounterClass: string
  type: string | null
  reasonDisplay: string | null
  startTime: Date | null
  providerName: string | null
  chiefComplaint: string | null
  signedAt: Date | null
  signedByName: string | null
}): EncounterSummary {
  return {
    id: enc.id,
    status: enc.status,
    encounterClass: enc.encounterClass,
    type: enc.type ?? undefined,
    reasonDisplay: enc.reasonDisplay ?? undefined,
    startTime: enc.startTime?.toISOString(),
    providerName: enc.providerName ?? undefined,
    chiefComplaint: enc.chiefComplaint ?? undefined,
    signedAt: enc.signedAt?.toISOString(),
    signedByName: enc.signedByName ?? undefined,
  }
}

function toDetail(enc: {
  id: string
  status: string
  encounterClass: string
  type: string | null
  reasonDisplay: string | null
  startTime: Date | null
  endTime: Date | null
  providerName: string | null
  chiefComplaint: string | null
  subjective: string | null
  objective: string | null
  assessment: string | null
  plan: string | null
  notes: string | null
  signedAt: Date | null
  signedByName: string | null
  createdAt: Date
  updatedAt: Date
}): EncounterDetailDto {
  return {
    ...toSummary(enc),
    endTime: enc.endTime?.toISOString(),
    subjective: enc.subjective ?? undefined,
    objective: enc.objective ?? undefined,
    assessment: enc.assessment ?? undefined,
    plan: enc.plan ?? undefined,
    notes: enc.notes ?? undefined,
    createdAt: enc.createdAt.toISOString(),
    updatedAt: enc.updatedAt.toISOString(),
  }
}

async function assertPatientExists(patientId: string, reply: FastifyReply, correlationId: string): Promise<boolean> {
  const patient = await prisma.patient.findUnique({ where: { id: patientId }, select: { id: true, isActive: true } })
  if (!patient || !patient.isActive) {
    reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Patient not found', correlationId })
    return false
  }
  return true
}

// ─── Validation schemas ───────────────────────────────────────────────────────

const createEncounterSchema = z.object({
  type: z.string().max(80).optional(),
  reasonDisplay: z.string().max(255).optional(),
  reasonCode: z.string().max(20).optional(),
  encounterClass: z.enum(['AMB', 'IMP', 'VR']).default('AMB'),
  startTime: z.string().datetime().optional(),
  providerId: z.string().min(1),
  providerName: z.string().max(200).optional(),
  chiefComplaint: z.string().max(500).optional(),
  subjective: z.string().optional(),
  objective: z.string().optional(),
  assessment: z.string().optional(),
  plan: z.string().optional(),
})

const updateEncounterSchema = z.object({
  status: z.enum(['planned', 'in-progress', 'finished', 'cancelled']).optional(),
  type: z.string().max(80).optional(),
  chiefComplaint: z.string().max(500).optional(),
  subjective: z.string().optional(),
  objective: z.string().optional(),
  assessment: z.string().optional(),
  plan: z.string().optional(),
  notes: z.string().optional(),
  endTime: z.string().datetime().optional(),
})

// ─── Plugin ───────────────────────────────────────────────────────────────────

export async function encounterRoutes(fastify: FastifyInstance) {
  type PatientParams = { patientId: string }
  type EncounterParams = { patientId: string; id: string }

  /**
   * GET /api/patients/:patientId/encounters
   * Paginated list of encounters for a patient, newest first.
   */
  fastify.get(
    '/api/patients/:patientId/encounters',
    async (request: FastifyRequest<{ Params: PatientParams; Querystring: { page?: string; pageSize?: string } }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId } = request.params
      if (!(await assertPatientExists(patientId, reply, correlationId))) return

      const page = Math.max(1, parseInt(request.query.page ?? '1', 10))
      const pageSize = Math.min(50, Math.max(1, parseInt(request.query.pageSize ?? '20', 10)))
      const skip = (page - 1) * pageSize

      const [encounters, total] = await Promise.all([
        prisma.encounter.findMany({
          where: { patientId },
          orderBy: { startTime: 'desc' },
          skip,
          take: pageSize,
          select: {
            id: true, status: true, encounterClass: true, type: true,
            reasonDisplay: true, startTime: true, providerName: true,
            chiefComplaint: true, signedAt: true, signedByName: true,
          },
        }),
        prisma.encounter.count({ where: { patientId } }),
      ])

      return reply.status(200).send({
        data: encounters.map(toSummary),
        meta: { page, pageSize, total },
      })
    }
  )

  /**
   * POST /api/patients/:patientId/encounters
   * Start a new encounter (open a new SOAP note).
   */
  fastify.post(
    '/api/patients/:patientId/encounters',
    async (request: FastifyRequest<{ Params: PatientParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId } = request.params
      if (!(await assertPatientExists(patientId, reply, correlationId))) return

      const parsed = createEncounterSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({
          statusCode: 400, error: 'Bad Request',
          message: parsed.error.errors.map((e) => e.message).join(', '), correlationId,
        })
      }
      const d = parsed.data

      const encounter = await prisma.encounter.create({
        data: {
          patientId,
          status: 'in-progress',
          encounterClass: d.encounterClass,
          type: d.type ?? null,
          reasonCode: d.reasonCode ?? null,
          reasonDisplay: d.reasonDisplay ?? null,
          startTime: d.startTime ? new Date(d.startTime) : new Date(),
          providerId: d.providerId,
          providerName: d.providerName ?? null,
          chiefComplaint: d.chiefComplaint ?? null,
          subjective: d.subjective ?? null,
          objective: d.objective ?? null,
          assessment: d.assessment ?? null,
          plan: d.plan ?? null,
        },
      })

      fastify.log.info({ correlationId, encounterId: encounter.id, patientId }, 'Encounter created')
      return reply.status(201).send({ data: toDetail(encounter) })
    }
  )

  /**
   * GET /api/patients/:patientId/encounters/:id
   * Full encounter detail with all SOAP note fields.
   */
  fastify.get(
    '/api/patients/:patientId/encounters/:id',
    async (request: FastifyRequest<{ Params: EncounterParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId, id } = request.params

      const encounter = await prisma.encounter.findFirst({
        where: { id, patientId },
      })
      if (!encounter) {
        return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Encounter not found', correlationId })
      }

      return reply.status(200).send({ data: toDetail(encounter) })
    }
  )

  /**
   * PUT /api/patients/:patientId/encounters/:id
   * Auto-save SOAP note content. Can be called frequently (auto-save).
   * A signed encounter cannot be edited — use notes field for addenda.
   */
  fastify.put(
    '/api/patients/:patientId/encounters/:id',
    async (request: FastifyRequest<{ Params: EncounterParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId, id } = request.params

      const existing = await prisma.encounter.findFirst({ where: { id, patientId }, select: { id: true, signedAt: true } })
      if (!existing) {
        return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Encounter not found', correlationId })
      }

      const parsed = updateEncounterSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({
          statusCode: 400, error: 'Bad Request',
          message: parsed.error.errors.map((e) => e.message).join(', '), correlationId,
        })
      }
      const d = parsed.data

      // Signed encounters: only addendum notes are allowed
      if (existing.signedAt) {
        if (d.notes !== undefined) {
          const updated = await prisma.encounter.update({
            where: { id },
            data: { notes: d.notes },
          })
          return reply.status(200).send({ data: toDetail(updated) })
        }
        return reply.status(409).send({
          statusCode: 409, error: 'Conflict',
          message: 'Encounter is signed. Only the notes/addendum field can be updated.',
          correlationId,
        })
      }

      const updated = await prisma.encounter.update({
        where: { id },
        data: {
          status: d.status ?? undefined,
          type: d.type ?? undefined,
          chiefComplaint: d.chiefComplaint ?? undefined,
          subjective: d.subjective ?? undefined,
          objective: d.objective ?? undefined,
          assessment: d.assessment ?? undefined,
          plan: d.plan ?? undefined,
          notes: d.notes ?? undefined,
          endTime: d.endTime ? new Date(d.endTime) : undefined,
        },
      })

      return reply.status(200).send({ data: toDetail(updated) })
    }
  )

  /**
   * POST /api/patients/:patientId/encounters/:id/sign
   * Finalise and sign the encounter note. Sets status to 'finished' and locks the note.
   */
  fastify.post(
    '/api/patients/:patientId/encounters/:id/sign',
    async (request: FastifyRequest<{ Params: EncounterParams; Body: { providerName?: string } }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId, id } = request.params
      const userId = getUserId(request)

      const existing = await prisma.encounter.findFirst({ where: { id, patientId }, select: { id: true, signedAt: true } })
      if (!existing) {
        return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Encounter not found', correlationId })
      }
      if (existing.signedAt) {
        return reply.status(409).send({ statusCode: 409, error: 'Conflict', message: 'Encounter is already signed', correlationId })
      }

      const providerName = (request.body as { providerName?: string })?.providerName ?? null
      const signed = await prisma.encounter.update({
        where: { id },
        data: {
          signedAt: new Date(),
          signedBy: userId,
          signedByName: providerName,
          status: 'finished',
          endTime: new Date(),
        },
      })

      fastify.log.info({ correlationId, encounterId: id, patientId, signedBy: userId }, 'Encounter signed')
      return reply.status(200).send({ data: toDetail(signed) })
    }
  )

  /**
   * DELETE /api/patients/:patientId/encounters/:id
   * Cancel an unsigned encounter (does not delete — sets status to cancelled).
   */
  fastify.delete(
    '/api/patients/:patientId/encounters/:id',
    async (request: FastifyRequest<{ Params: EncounterParams }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const { patientId, id } = request.params

      const existing = await prisma.encounter.findFirst({ where: { id, patientId }, select: { id: true, signedAt: true } })
      if (!existing) {
        return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Encounter not found', correlationId })
      }
      if (existing.signedAt) {
        return reply.status(409).send({ statusCode: 409, error: 'Conflict', message: 'Signed encounters cannot be deleted. Add an addendum instead.', correlationId })
      }

      await prisma.encounter.update({ where: { id }, data: { status: 'cancelled' } })
      return reply.status(204).send()
    }
  )

  /**
   * GET /api/inbox
   * Provider inbox: unsigned encounters and unreviewed abnormal lab results
   * scoped to the requesting provider.
   */
  fastify.get('/api/inbox', async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = getUserId(request)

    const [unsignedEncounters, unreviewedResults] = await Promise.all([
      // Unsigned/in-progress encounters for this provider
      prisma.encounter.findMany({
        where: {
          providerId: userId,
          status: { in: ['in-progress', 'planned'] },
          signedAt: null,
        },
        include: {
          patient: { select: { id: true, firstName: true, lastName: true, mrn: true } },
        },
        orderBy: { startTime: 'desc' },
        take: 50,
      }),

      // Abnormal lab results not yet reviewed — all patients (results routed to ordering provider)
      // In Phase 1 we surface all unreviewed abnormal results across the system
      prisma.observation.findMany({
        where: {
          category: 'laboratory',
          isAbnormal: true,
          reviewedAt: null,
        },
        include: {
          patient: { select: { id: true, firstName: true, lastName: true, mrn: true } },
        },
        orderBy: { effectiveAt: 'desc' },
        take: 50,
      }),
    ])

    const items: InboxItemDto[] = [
      ...unsignedEncounters.map((enc) => ({
        id: enc.id,
        itemType: 'unsigned_encounter' as const,
        patientId: enc.patient.id,
        patientName: `${enc.patient.firstName} ${enc.patient.lastName}`,
        mrn: enc.patient.mrn,
        summary: enc.chiefComplaint
          ? `Unsigned note: ${enc.chiefComplaint}`
          : `Unsigned ${enc.type ?? 'encounter'} note`,
        createdAt: enc.createdAt.toISOString(),
        severity: 'normal' as const,
      })),
      ...unreviewedResults.map((obs) => ({
        id: obs.id,
        itemType: 'abnormal_result' as const,
        patientId: obs.patient.id,
        patientName: `${obs.patient.firstName} ${obs.patient.lastName}`,
        mrn: obs.patient.mrn,
        summary: `Abnormal result: ${obs.display}${obs.valueQuantity != null ? ` = ${obs.valueQuantity} ${obs.valueUnit ?? ''}` : obs.valueString ? ` = ${obs.valueString}` : ''}`,
        createdAt: obs.effectiveAt.toISOString(),
        severity: 'abnormal' as const,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return reply.status(200).send({ data: items, meta: { total: items.length } })
  })

  /**
   * POST /api/observations/:id/review
   * Mark an abnormal lab result as reviewed (acknowledge it from the inbox).
   */
  fastify.post(
    '/api/observations/:id/review',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = (request.headers['x-correlation-id'] as string) ?? uuidv4()
      const userId = getUserId(request)
      const { id } = request.params

      const obs = await prisma.observation.findUnique({ where: { id }, select: { id: true, reviewedAt: true } })
      if (!obs) {
        return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Observation not found', correlationId })
      }

      await prisma.observation.update({
        where: { id },
        data: { reviewedAt: new Date(), reviewedBy: userId },
      })

      return reply.status(200).send({ ok: true })
    }
  )
}
