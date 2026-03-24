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

const logCommunicationSchema = z.object({
  contactId: z.string().uuid(),
  type: z.enum(['email', 'sms', 'phone_call', 'note', 'portal_message']),
  direction: z.enum(['inbound', 'outbound']).default('outbound'),
  subject: z.string().max(500).optional(),
  content: z.string().max(10000).optional(),
  status: z.enum(['sent', 'delivered', 'read', 'failed', 'received']).default('sent'),
  sentAt: z.string().datetime().optional(),
  referralId: z.string().uuid().optional(),
  taskId: z.string().uuid().optional(),
  campaignId: z.string().uuid().optional(),
})

export async function communicationRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/communications
   * List communications with optional filtering by contactId.
   */
  fastify.get('/api/communications', async (request: FastifyRequest, reply: FastifyReply) => {
    const q = request.query as Record<string, string>
    const contactId = q.contactId
    const type = q.type
    const direction = q.direction
    const page = parseInt(q.page ?? '1', 10)
    const pageSize = Math.min(parseInt(q.pageSize ?? '50', 10), 200)
    const skip = (page - 1) * pageSize

    if (!contactId) {
      return reply.status(400).send(buildError(400, 'Bad Request', 'contactId query param is required', cid(request)))
    }

    const where = {
      contactId,
      ...(type && { type }),
      ...(direction && { direction }),
    }

    const [communications, total] = await Promise.all([
      prisma.communication.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.communication.count({ where }),
    ])

    return reply.status(200).send({
      data: communications,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    })
  })

  /**
   * POST /api/communications
   * Log a manual communication (call, email, note, etc.).
   */
  fastify.post('/api/communications', async (request: FastifyRequest, reply: FastifyReply) => {
    const correlationId = cid(request)
    const userId = getUserId(request)
    const body = logCommunicationSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
    }

    const contact = await prisma.contact.findUnique({ where: { id: body.data.contactId }, select: { id: true } })
    if (!contact) {
      return reply.status(404).send(buildError(404, 'Not Found', 'Contact not found', correlationId))
    }

    const { sentAt, ...rest } = body.data
    const communication = await prisma.communication.create({
      data: {
        ...rest,
        sentBy: userId,
        sentAt: sentAt ? new Date(sentAt) : new Date(),
      },
    })

    // Audit the communication log (PHI-sensitive)
    prisma.auditLog
      .create({
        data: {
          contactId: body.data.contactId,
          userId,
          action: 'CREATE',
          resourceType: 'Communication',
          resourceId: communication.id,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          changes: { type: body.data.type, direction: body.data.direction } as any,
          ipAddress: request.ip ?? null,
          correlationId,
        },
      })
      .catch(() => null)

    return reply.status(201).send({ data: communication })
  })

  /**
   * GET /api/communications/:id
   */
  fastify.get(
    '/api/communications/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const { id } = request.params

      const communication = await prisma.communication.findUnique({ where: { id } })
      if (!communication) {
        return reply.status(404).send(buildError(404, 'Not Found', `Communication ${id} not found`, correlationId))
      }

      return reply.status(200).send({ data: communication })
    }
  )
}
