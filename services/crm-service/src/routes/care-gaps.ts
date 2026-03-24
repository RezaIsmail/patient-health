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

const GAP_TYPES = [
  'mammogram', 'colorectal_screening', 'hba1c', 'flu_vaccine', 'bp_check',
  'medication_refill', 'behavioural_health_assessment', 'post_discharge_followup', 'other',
] as const

const createCareGapSchema = z.object({
  contactId: z.string().uuid(),
  gapType: z.enum(GAP_TYPES),
  description: z.string().min(1).max(500),
  status: z.enum(['open', 'in_progress', 'closed', 'declined']).default('open'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  notes: z.string().max(5000).optional(),
})

const updateCareGapSchema = z.object({
  status: z.enum(['open', 'in_progress', 'closed', 'declined']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  notes: z.string().max(5000).optional(),
  declineReason: z.string().max(500).optional(),
})

export async function careGapRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/care-gaps
   */
  fastify.get('/api/care-gaps', async (request: FastifyRequest, reply: FastifyReply) => {
    const q = request.query as Record<string, string>
    const contactId = q.contactId
    const status = q.status
    const gapType = q.gapType
    const priority = q.priority
    const page = parseInt(q.page ?? '1', 10)
    const pageSize = Math.min(parseInt(q.pageSize ?? '50', 10), 200)
    const skip = (page - 1) * pageSize

    const where = {
      ...(contactId && { contactId }),
      ...(status ? { status } : { status: { in: ['open', 'in_progress'] } }),
      ...(gapType && { gapType }),
      ...(priority && { priority }),
    }

    const [gaps, total] = await Promise.all([
      prisma.careGap.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ priority: 'asc' }, { identifiedAt: 'asc' }],
        include: {
          contact: { select: { id: true, firstName: true, lastName: true, riskLevel: true } },
        },
      }),
      prisma.careGap.count({ where }),
    ])

    return reply.status(200).send({
      data: gaps,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    })
  })

  /**
   * POST /api/care-gaps
   */
  fastify.post('/api/care-gaps', async (request: FastifyRequest, reply: FastifyReply) => {
    const correlationId = cid(request)
    const userId = getUserId(request)
    const body = createCareGapSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
    }

    const contact = await prisma.contact.findUnique({ where: { id: body.data.contactId }, select: { id: true } })
    if (!contact) {
      return reply.status(404).send(buildError(404, 'Not Found', 'Contact not found', correlationId))
    }

    const { targetDate, ...rest } = body.data
    const gap = await prisma.careGap.create({
      data: {
        ...rest,
        targetDate: targetDate ? new Date(targetDate) : undefined,
        identifiedBy: userId,
      },
    })

    prisma.auditLog
      .create({
        data: {
          contactId: body.data.contactId,
          userId,
          action: 'CREATE',
          resourceType: 'CareGap',
          resourceId: gap.id,
          ipAddress: request.ip ?? null,
          correlationId,
        },
      })
      .catch(() => null)

    return reply.status(201).send({ data: gap })
  })

  /**
   * PATCH /api/care-gaps/:id
   */
  fastify.patch(
    '/api/care-gaps/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const userId = getUserId(request)
      const { id } = request.params

      const body = updateCareGapSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
      }

      const existing = await prisma.careGap.findUnique({ where: { id }, select: { id: true, contactId: true } })
      if (!existing) {
        return reply.status(404).send(buildError(404, 'Not Found', `Care gap ${id} not found`, correlationId))
      }

      const { targetDate, ...rest } = body.data
      const isClosing = rest.status === 'closed' || rest.status === 'declined'

      const gap = await prisma.careGap.update({
        where: { id },
        data: {
          ...rest,
          ...(targetDate !== undefined && { targetDate: new Date(targetDate) }),
          ...(isClosing && { closedAt: new Date(), closedBy: userId }),
        },
      })

      prisma.auditLog
        .create({
          data: {
            contactId: existing.contactId,
            userId,
            action: 'UPDATE',
            resourceType: 'CareGap',
            resourceId: id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            changes: rest as any,
            ipAddress: request.ip ?? null,
            correlationId,
          },
        })
        .catch(() => null)

      return reply.status(200).send({ data: gap })
    }
  )
}
