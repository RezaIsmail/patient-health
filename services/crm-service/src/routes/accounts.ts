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

const createAccountSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(['health_system', 'clinic', 'payer', 'employer', 'community_org', 'other']).default('clinic'),
  status: z.enum(['active', 'inactive', 'prospect']).default('active'),
  phone: z.string().max(20).optional(),
  email: z.string().email().max(255).optional(),
  website: z.string().url().max(255).optional(),
  addressLine1: z.string().max(255).optional(),
  addressLine2: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(2).default('US'),
  parentAccountId: z.string().uuid().optional(),
  notes: z.string().max(5000).optional(),
})

const updateAccountSchema = createAccountSchema.partial()

export async function accountRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/accounts
   */
  fastify.get('/api/accounts', async (request: FastifyRequest, reply: FastifyReply) => {
    const correlationId = cid(request)
    const q = (request.query as Record<string, string>).q
    const type = (request.query as Record<string, string>).type
    const page = parseInt((request.query as Record<string, string>).page ?? '1', 10)
    const pageSize = Math.min(parseInt((request.query as Record<string, string>).pageSize ?? '20', 10), 100)
    const skip = (page - 1) * pageSize

    const where = {
      ...(q && {
        OR: [
          { name: { contains: q, mode: 'insensitive' as const } },
          { email: { contains: q, mode: 'insensitive' as const } },
        ],
      }),
      ...(type && { type }),
    }

    const [accounts, total] = await Promise.all([
      prisma.account.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { contacts: true } },
          parent: { select: { id: true, name: true } },
        },
      }),
      prisma.account.count({ where }),
    ])

    return reply.status(200).send({
      data: accounts,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    })
  })

  /**
   * POST /api/accounts
   */
  fastify.post('/api/accounts', async (request: FastifyRequest, reply: FastifyReply) => {
    const correlationId = cid(request)
    const userId = getUserId(request)
    const body = createAccountSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
    }

    const account = await prisma.account.create({ data: body.data })

    writeAuditLog({
      userId,
      action: 'CREATE',
      resourceType: 'Account',
      resourceId: account.id,
      ipAddress: request.ip,
      correlationId,
    })

    return reply.status(201).send({ data: account })
  })

  /**
   * GET /api/accounts/:id
   */
  fastify.get(
    '/api/accounts/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const { id } = request.params

      const account = await prisma.account.findUnique({
        where: { id },
        include: {
          parent: { select: { id: true, name: true } },
          children: { select: { id: true, name: true, type: true } },
          contacts: {
            take: 50,
            orderBy: { lastName: 'asc' },
            select: {
              id: true,
              firstName: true,
              lastName: true,
              status: true,
              riskLevel: true,
              assignedTo: true,
            },
          },
          _count: { select: { contacts: true } },
        },
      })

      if (!account) {
        return reply.status(404).send(buildError(404, 'Not Found', `Account ${id} not found`, correlationId))
      }

      return reply.status(200).send({ data: account })
    }
  )

  /**
   * PATCH /api/accounts/:id
   */
  fastify.patch(
    '/api/accounts/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const userId = getUserId(request)
      const { id } = request.params

      const body = updateAccountSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
      }

      const existing = await prisma.account.findUnique({ where: { id }, select: { id: true } })
      if (!existing) {
        return reply.status(404).send(buildError(404, 'Not Found', `Account ${id} not found`, correlationId))
      }

      const account = await prisma.account.update({ where: { id }, data: body.data })

      writeAuditLog({
        userId,
        action: 'UPDATE',
        resourceType: 'Account',
        resourceId: id,
        changes: body.data,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(200).send({ data: account })
    }
  )
}
