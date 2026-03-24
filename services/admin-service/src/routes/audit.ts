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

const auditQuerySchema = z.object({
  service: z.string().optional(),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  actorId: z.string().optional(),
  action: z.string().optional(),
  memberId: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(500).default(50),
})

// ─── Plugin ───────────────────────────────────────────────────────────────────

export async function auditRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/audit
   */
  fastify.get('/api/audit', async (request: FastifyRequest, reply: FastifyReply) => {
    const cid = correlationId(request)
    const query = auditQuerySchema.safeParse(request.query)
    if (!query.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', query.error.message, cid))
    }

    const { service, entityType, entityId, actorId, action, memberId, dateFrom, dateTo, page, limit } =
      query.data
    const skip = (page - 1) * limit

    const where = {
      ...(service && { service }),
      ...(entityType && { entityType }),
      ...(entityId && { entityId }),
      ...(actorId && { actorId }),
      ...(action && { action }),
      ...(memberId && { memberId }),
      ...((dateFrom || dateTo) && {
        timestamp: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) }),
        },
      }),
    }

    const [events, total] = await Promise.all([
      prisma.auditEvent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: {
          member: { select: { id: true, memberNumber: true, firstName: true, lastName: true } },
        },
      }),
      prisma.auditEvent.count({ where }),
    ])

    return reply.status(200).send({
      data: events,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  })

  /**
   * GET /api/audit/member/:memberId — HIPAA Access Report
   */
  fastify.get(
    '/api/audit/member/:memberId',
    async (request: FastifyRequest<{ Params: { memberId: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { memberId } = request.params
      const query = z
        .object({
          dateFrom: z.string().datetime().optional(),
          dateTo: z.string().datetime().optional(),
          page: z.coerce.number().int().min(1).default(1),
          limit: z.coerce.number().int().min(1).max(500).default(100),
        })
        .safeParse(request.query)

      if (!query.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', query.error.message, cid))
      }

      const { dateFrom, dateTo, page, limit } = query.data
      const skip = (page - 1) * limit

      const where = {
        memberId,
        ...((dateFrom || dateTo) && {
          timestamp: {
            ...(dateFrom && { gte: new Date(dateFrom) }),
            ...(dateTo && { lte: new Date(dateTo) }),
          },
        }),
      }

      const [events, total] = await Promise.all([
        prisma.auditEvent.findMany({
          where,
          skip,
          take: limit,
          orderBy: { timestamp: 'desc' },
        }),
        prisma.auditEvent.count({ where }),
      ])

      const member = await prisma.member.findUnique({
        where: { id: memberId },
        select: { id: true, memberNumber: true, firstName: true, lastName: true },
      })

      return reply.status(200).send({
        data: {
          member,
          events,
          reportGeneratedAt: new Date().toISOString(),
          totalEvents: total,
        },
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
      })
    }
  )

  /**
   * GET /api/audit/export — CSV export
   */
  fastify.get('/api/audit/export', async (request: FastifyRequest, reply: FastifyReply) => {
    const cid = correlationId(request)
    const query = auditQuerySchema.omit({ page: true, limit: true }).safeParse(request.query)
    if (!query.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', query.error.message, cid))
    }

    const { service, entityType, entityId, actorId, action, memberId, dateFrom, dateTo } =
      query.data

    const where = {
      ...(service && { service }),
      ...(entityType && { entityType }),
      ...(entityId && { entityId }),
      ...(actorId && { actorId }),
      ...(action && { action }),
      ...(memberId && { memberId }),
      ...((dateFrom || dateTo) && {
        timestamp: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) }),
        },
      }),
    }

    const events = await prisma.auditEvent.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 10_000,
    })

    const csvHeader =
      'eventId,timestamp,service,entityType,entityId,action,actorId,actorRole,correlationId,ipAddress,memberId\n'
    const csvRows = events
      .map(
        (e) =>
          [
            e.eventId,
            e.timestamp.toISOString(),
            e.service,
            e.entityType,
            e.entityId ?? '',
            e.action,
            e.actorId,
            e.actorRole ?? '',
            e.correlationId ?? '',
            e.ipAddress ?? '',
            e.memberId ?? '',
          ]
            .map((v) => `"${String(v).replace(/"/g, '""')}"`)
            .join(',')
      )
      .join('\n')

    const csv = csvHeader + csvRows

    return reply
      .status(200)
      .header('Content-Type', 'text/csv')
      .header(
        'Content-Disposition',
        `attachment; filename="audit-export-${new Date().toISOString().slice(0, 10)}.csv"`
      )
      .send(csv)
  })
}
