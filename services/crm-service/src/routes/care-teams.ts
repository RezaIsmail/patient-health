import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../lib/prisma'

function getUserId(request: FastifyRequest): string {
  return (request as FastifyRequest & { userId: string }).userId ?? 'unknown'
}

function cid(request: FastifyRequest): string {
  return (request.headers['x-correlation-id'] as string) ?? uuidv4()
}

function buildError(statusCode: number, error: string, message: string, correlationId: string) {
  return { statusCode, error, message, correlationId }
}

function writeAuditLog(params: {
  contactId?: string
  userId: string
  action: string
  resourceType: string
  resourceId?: string
  changes?: Record<string, unknown>
  ipAddress?: string
  correlationId?: string
}) {
  prisma.auditLog
    .create({
      data: {
        contactId: params.contactId ?? null,
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
    .catch((err) => console.error('Audit log write failed:', err))
}

const createCareTeamSchema = z.object({
  name: z.string().min(1).max(255),
})

const addMemberSchema = z.object({
  userId: z.string().min(1),
  memberName: z.string().min(1).max(255),
  role: z.enum(['care_coordinator', 'physician', 'nurse', 'social_worker', 'pharmacist', 'behavioural_health', 'other']).default('care_coordinator'),
  isPrimary: z.boolean().default(false),
})

const updateMemberSchema = z.object({
  role: z.enum(['care_coordinator', 'physician', 'nurse', 'social_worker', 'pharmacist', 'behavioural_health', 'other']).optional(),
  isPrimary: z.boolean().optional(),
})

export async function careTeamRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/contacts/:contactId/care-team
   * Get the care team for a contact (creates one if it doesn't exist).
   */
  fastify.get(
    '/api/contacts/:contactId/care-team',
    async (request: FastifyRequest<{ Params: { contactId: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const { contactId } = request.params

      const contact = await prisma.contact.findUnique({ where: { id: contactId }, select: { id: true } })
      if (!contact) {
        return reply.status(404).send(buildError(404, 'Not Found', `Contact ${contactId} not found`, correlationId))
      }

      const careTeam = await prisma.careTeam.findUnique({
        where: { contactId },
        include: {
          members: {
            where: { leftAt: null },
            orderBy: [{ isPrimary: 'desc' }, { joinedAt: 'asc' }],
          },
        },
      })

      return reply.status(200).send({ data: careTeam })
    }
  )

  /**
   * POST /api/contacts/:contactId/care-team
   * Create a care team for a contact.
   */
  fastify.post(
    '/api/contacts/:contactId/care-team',
    async (request: FastifyRequest<{ Params: { contactId: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const userId = getUserId(request)
      const { contactId } = request.params

      const body = createCareTeamSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
      }

      const contact = await prisma.contact.findUnique({ where: { id: contactId }, select: { id: true } })
      if (!contact) {
        return reply.status(404).send(buildError(404, 'Not Found', `Contact ${contactId} not found`, correlationId))
      }

      const existing = await prisma.careTeam.findUnique({ where: { contactId }, select: { id: true } })
      if (existing) {
        return reply.status(409).send(buildError(409, 'Conflict', 'Care team already exists for this contact', correlationId))
      }

      const careTeam = await prisma.careTeam.create({
        data: { contactId, name: body.data.name },
        include: { members: true },
      })

      writeAuditLog({
        contactId,
        userId,
        action: 'CREATE',
        resourceType: 'CareTeam',
        resourceId: careTeam.id,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(201).send({ data: careTeam })
    }
  )

  /**
   * POST /api/care-teams/:teamId/members
   * Add a member to a care team.
   */
  fastify.post(
    '/api/care-teams/:teamId/members',
    async (request: FastifyRequest<{ Params: { teamId: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const userId = getUserId(request)
      const { teamId } = request.params

      const body = addMemberSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
      }

      const team = await prisma.careTeam.findUnique({
        where: { id: teamId },
        select: { id: true, contactId: true },
      })
      if (!team) {
        return reply.status(404).send(buildError(404, 'Not Found', `Care team ${teamId} not found`, correlationId))
      }

      // If adding a primary member, demote all existing primaries
      if (body.data.isPrimary) {
        await prisma.careTeamMember.updateMany({
          where: { careTeamId: teamId, leftAt: null },
          data: { isPrimary: false },
        })
      }

      const member = await prisma.careTeamMember.create({
        data: { careTeamId: teamId, ...body.data },
      })

      writeAuditLog({
        contactId: team.contactId,
        userId,
        action: 'CREATE',
        resourceType: 'CareTeamMember',
        resourceId: member.id,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(201).send({ data: member })
    }
  )

  /**
   * PATCH /api/care-teams/:teamId/members/:memberId
   * Update a member's role or primary status.
   */
  fastify.patch(
    '/api/care-teams/:teamId/members/:memberId',
    async (request: FastifyRequest<{ Params: { teamId: string; memberId: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const userId = getUserId(request)
      const { teamId, memberId } = request.params

      const body = updateMemberSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
      }

      const team = await prisma.careTeam.findUnique({ where: { id: teamId }, select: { id: true, contactId: true } })
      if (!team) {
        return reply.status(404).send(buildError(404, 'Not Found', `Care team ${teamId} not found`, correlationId))
      }

      // If making primary, demote others first
      if (body.data.isPrimary) {
        await prisma.careTeamMember.updateMany({
          where: { careTeamId: teamId, leftAt: null },
          data: { isPrimary: false },
        })
      }

      const member = await prisma.careTeamMember.update({
        where: { id: memberId },
        data: body.data,
      })

      writeAuditLog({
        contactId: team.contactId,
        userId,
        action: 'UPDATE',
        resourceType: 'CareTeamMember',
        resourceId: memberId,
        changes: body.data,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(200).send({ data: member })
    }
  )

  /**
   * DELETE /api/care-teams/:teamId/members/:memberId
   * Remove a member from a care team (soft-delete by setting leftAt).
   */
  fastify.delete(
    '/api/care-teams/:teamId/members/:memberId',
    async (request: FastifyRequest<{ Params: { teamId: string; memberId: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const userId = getUserId(request)
      const { teamId, memberId } = request.params

      const team = await prisma.careTeam.findUnique({ where: { id: teamId }, select: { id: true, contactId: true } })
      if (!team) {
        return reply.status(404).send(buildError(404, 'Not Found', `Care team ${teamId} not found`, correlationId))
      }

      await prisma.careTeamMember.update({
        where: { id: memberId },
        data: { leftAt: new Date() },
      })

      writeAuditLog({
        contactId: team.contactId,
        userId,
        action: 'DELETE',
        resourceType: 'CareTeamMember',
        resourceId: memberId,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(204).send()
    }
  )
}
