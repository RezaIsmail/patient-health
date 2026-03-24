import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../lib/prisma'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function correlationId(request: FastifyRequest): string {
  return (request.headers['x-correlation-id'] as string) ?? uuidv4()
}

function buildError(statusCode: number, error: string, message: string, cid: string) {
  return { statusCode, error, message, correlationId: cid }
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

const recordConsentSchema = z.object({
  consentType: z.enum(['verbal', 'written', 'electronic', 'implied']),
  channel: z.enum(['phone', 'portal', 'in_person', 'mail']).optional(),
  collectedBy: z.string().min(1),
  collectedAt: z.string().datetime().optional(),
  documentVersion: z.string().optional(),
})

const withdrawConsentSchema = z.object({
  withdrawnBy: z.string().min(1),
  withdrawalReason: z.string().min(1),
})

// ─── Plugin ───────────────────────────────────────────────────────────────────

export async function consentRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/enrollments/:enrollmentId/consent
   * Record consent for an enrollment
   */
  fastify.post(
    '/api/enrollments/:enrollmentId/consent',
    async (
      request: FastifyRequest<{ Params: { enrollmentId: string } }>,
      reply: FastifyReply
    ) => {
      const cid = correlationId(request)
      const { enrollmentId } = request.params

      const body = recordConsentSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
      }

      const enrollment = await prisma.programmeEnrollment.findUnique({
        where: { id: enrollmentId },
        select: { id: true, memberId: true, state: true },
      })

      if (!enrollment) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Enrollment ${enrollmentId} not found`, cid))
      }

      // Check for existing active consent on this enrollment
      const existing = await prisma.consent.findFirst({
        where: { enrollmentId, status: 'active' },
      })
      if (existing) {
        return reply
          .status(409)
          .send(
            buildError(
              409,
              'Conflict',
              'Active consent already exists for this enrollment. Withdraw it before recording a new one.',
              cid
            )
          )
      }

      const { collectedAt, ...rest } = body.data
      const consent = await prisma.consent.create({
        data: {
          enrollmentId,
          memberId: enrollment.memberId,
          ...rest,
          collectedAt: collectedAt ? new Date(collectedAt) : new Date(),
        },
      })

      // Audit log
      prisma.auditEvent
        .create({
          data: {
            service: 'admin',
            entityType: 'consent',
            entityId: consent.id,
            action: 'create',
            actorId: rest.collectedBy,
            memberId: enrollment.memberId ?? undefined,
            correlationId: cid,
          },
        })
        .catch(() => {})

      return reply.status(201).send({ data: consent })
    }
  )

  /**
   * GET /api/enrollments/:enrollmentId/consent
   * Get consent history for an enrollment
   */
  fastify.get(
    '/api/enrollments/:enrollmentId/consent',
    async (
      request: FastifyRequest<{ Params: { enrollmentId: string } }>,
      reply: FastifyReply
    ) => {
      const cid = correlationId(request)
      const { enrollmentId } = request.params

      const enrollment = await prisma.programmeEnrollment.findUnique({
        where: { id: enrollmentId },
        select: { id: true },
      })
      if (!enrollment) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Enrollment ${enrollmentId} not found`, cid))
      }

      const consents = await prisma.consent.findMany({
        where: { enrollmentId },
        orderBy: { createdAt: 'desc' },
      })

      return reply.status(200).send({ data: consents })
    }
  )

  /**
   * PATCH /api/consents/:id/withdraw
   * Withdraw (not delete) an active consent — immutable record kept
   */
  fastify.patch(
    '/api/consents/:id/withdraw',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { id } = request.params

      const body = withdrawConsentSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
      }

      const consent = await prisma.consent.findUnique({ where: { id } })
      if (!consent) {
        return reply.status(404).send(buildError(404, 'Not Found', `Consent ${id} not found`, cid))
      }
      if (consent.status === 'withdrawn') {
        return reply
          .status(409)
          .send(buildError(409, 'Conflict', 'Consent is already withdrawn', cid))
      }

      const updated = await prisma.consent.update({
        where: { id },
        data: {
          status: 'withdrawn',
          withdrawnAt: new Date(),
          withdrawnBy: body.data.withdrawnBy,
          withdrawalReason: body.data.withdrawalReason,
        },
      })

      // Audit log
      prisma.auditEvent
        .create({
          data: {
            service: 'admin',
            entityType: 'consent',
            entityId: id,
            action: 'update',
            actorId: body.data.withdrawnBy,
            memberId: consent.memberId ?? undefined,
            correlationId: cid,
            notes: `Consent withdrawn: ${body.data.withdrawalReason}`,
          },
        })
        .catch(() => {})

      return reply.status(200).send({ data: updated })
    }
  )

  /**
   * GET /api/members/:memberId/consents
   * All consent records across all enrollments for a member
   */
  fastify.get(
    '/api/members/:memberId/consents',
    async (request: FastifyRequest<{ Params: { memberId: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { memberId } = request.params

      const member = await prisma.member.findUnique({
        where: { id: memberId },
        select: { id: true },
      })
      if (!member) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Member ${memberId} not found`, cid))
      }

      const consents = await prisma.consent.findMany({
        where: { memberId },
        orderBy: { createdAt: 'desc' },
        include: {
          enrollment: {
            select: {
              id: true,
              state: true,
              programme: { select: { id: true, name: true } },
            },
          },
        },
      })

      return reply.status(200).send({ data: consents })
    }
  )
}
