import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../lib/prisma'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getUserId(request: FastifyRequest): string {
  return (request as FastifyRequest & { userId: string }).userId ?? 'unknown'
}

function correlationId(request: FastifyRequest): string {
  return (request.headers['x-correlation-id'] as string) ?? uuidv4()
}

function buildError(statusCode: number, error: string, message: string, cid: string) {
  return { statusCode, error, message, correlationId: cid }
}

function writeAuditLog(params: {
  contactId?: string
  userId: string
  action: string
  resourceType: string
  resourceId?: string
  changes?: Record<string, unknown>
  ipAddress?: string
  cid?: string
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
        correlationId: params.cid ?? null,
      },
    })
    .catch((err) => console.error('Audit log write failed:', err))
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

const createContactSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  preferredName: z.string().max(100).optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD').optional(),
  sex: z.enum(['male', 'female', 'unknown', 'other']).optional(),
  genderIdentity: z.string().max(100).optional(),
  pronouns: z.string().max(50).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email().max(255).optional(),
  language: z.string().max(10).default('en'),
  status: z.enum(['lead', 'prospect', 'active', 'inactive', 'deceased']).default('lead'),
  source: z.enum(['referral', 'self-referral', 'web', 'partner', 'import']).optional(),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']).default('low'),
  sdohFlags: z.array(z.string()).default([]),
  assignedTo: z.string().optional(),
  accountId: z.string().uuid().optional(),
  emrPatientId: z.string().optional(),
  addressLine1: z.string().max(255).optional(),
  addressLine2: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(2).default('US'),
  notes: z.string().max(5000).optional(),
})

const updateContactSchema = createContactSchema.partial()

const listContactsQuerySchema = z.object({
  q: z.string().optional(),
  status: z.string().optional(),
  riskLevel: z.string().optional(),
  assignedTo: z.string().optional(),
  accountId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

// ─── Plugin ───────────────────────────────────────────────────────────────────

export async function contactRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/contacts
   */
  fastify.get('/api/contacts', async (request: FastifyRequest, reply: FastifyReply) => {
    const cid = correlationId(request)
    const query = listContactsQuerySchema.safeParse(request.query)
    if (!query.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', query.error.message, cid))
    }

    const { q, status, riskLevel, assignedTo, accountId, page, pageSize } = query.data
    const skip = (page - 1) * pageSize

    const where = {
      ...(q && {
        OR: [
          { firstName: { contains: q, mode: 'insensitive' as const } },
          { lastName: { contains: q, mode: 'insensitive' as const } },
          { email: { contains: q, mode: 'insensitive' as const } },
          { phone: { contains: q, mode: 'insensitive' as const } },
        ],
      }),
      ...(status && { status }),
      ...(riskLevel && { riskLevel }),
      ...(assignedTo && { assignedTo }),
      ...(accountId && { accountId }),
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        include: {
          account: { select: { id: true, name: true } },
          _count: { select: { careGaps: { where: { status: 'open' } }, tasks: { where: { status: 'pending' } } } },
        },
      }),
      prisma.contact.count({ where }),
    ])

    return reply.status(200).send({
      data: contacts,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    })
  })

  /**
   * POST /api/contacts
   */
  fastify.post('/api/contacts', async (request: FastifyRequest, reply: FastifyReply) => {
    const cid = correlationId(request)
    const userId = getUserId(request)
    const body = createContactSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
    }

    const { dateOfBirth, ...rest } = body.data
    const contact = await prisma.contact.create({
      data: {
        ...rest,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      },
    })

    writeAuditLog({
      contactId: contact.id,
      userId,
      action: 'CREATE',
      resourceType: 'Contact',
      resourceId: contact.id,
      ipAddress: request.ip,
      cid,
    })

    return reply.status(201).send({ data: contact })
  })

  /**
   * GET /api/contacts/:id
   */
  fastify.get(
    '/api/contacts/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const userId = getUserId(request)
      const { id } = request.params

      const contact = await prisma.contact.findUnique({
        where: { id },
        include: {
          account: { select: { id: true, name: true, type: true } },
          carePlans: {
            orderBy: { createdAt: 'desc' },
            include: {
              problems: true,
              goals: true,
              interventions: true,
            },
          },
          referrals: {
            orderBy: { createdAt: 'desc' },
            take: 10,
          },
          tasks: {
            where: { status: { in: ['pending', 'in_progress'] } },
            orderBy: { dueDate: 'asc' },
            take: 20,
          },
          careGaps: {
            where: { status: { in: ['open', 'in_progress'] } },
            orderBy: { priority: 'desc' },
          },
          careTeam: {
            include: { members: { where: { leftAt: null } } },
          },
          _count: {
            select: {
              referrals: true,
              tasks: true,
              careGaps: true,
              communications: true,
            },
          },
        },
      })

      if (!contact) {
        return reply.status(404).send(buildError(404, 'Not Found', `Contact ${id} not found`, cid))
      }

      writeAuditLog({
        contactId: id,
        userId,
        action: 'READ',
        resourceType: 'Contact',
        resourceId: id,
        ipAddress: request.ip,
        cid,
      })

      return reply.status(200).send({ data: contact })
    }
  )

  /**
   * PATCH /api/contacts/:id
   */
  fastify.patch(
    '/api/contacts/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const userId = getUserId(request)
      const { id } = request.params

      const body = updateContactSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
      }

      const existing = await prisma.contact.findUnique({ where: { id }, select: { id: true } })
      if (!existing) {
        return reply.status(404).send(buildError(404, 'Not Found', `Contact ${id} not found`, cid))
      }

      const { dateOfBirth, ...rest } = body.data
      const contact = await prisma.contact.update({
        where: { id },
        data: {
          ...rest,
          ...(dateOfBirth !== undefined && { dateOfBirth: new Date(dateOfBirth) }),
        },
      })

      writeAuditLog({
        contactId: id,
        userId,
        action: 'UPDATE',
        resourceType: 'Contact',
        resourceId: id,
        changes: rest,
        ipAddress: request.ip,
        cid,
      })

      return reply.status(200).send({ data: contact })
    }
  )

  /**
   * GET /api/contacts/:id/timeline
   * Returns a unified chronological activity stream for the contact.
   */
  fastify.get(
    '/api/contacts/:id/timeline',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { id } = request.params

      const contact = await prisma.contact.findUnique({ where: { id }, select: { id: true } })
      if (!contact) {
        return reply.status(404).send(buildError(404, 'Not Found', `Contact ${id} not found`, cid))
      }

      const [communications, tasks, referrals] = await Promise.all([
        prisma.communication.findMany({
          where: { contactId: id },
          orderBy: { createdAt: 'desc' },
          take: 50,
        }),
        prisma.task.findMany({
          where: { contactId: id, status: 'completed' },
          orderBy: { completedAt: 'desc' },
          take: 20,
        }),
        prisma.referral.findMany({
          where: { contactId: id },
          orderBy: { createdAt: 'desc' },
          take: 20,
          select: {
            id: true,
            referralNumber: true,
            stage: true,
            type: true,
            priority: true,
            reasonDisplay: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
      ])

      // Merge and sort into a unified timeline
      const timeline = [
        ...communications.map((c) => ({ ...c, _type: 'communication', _at: c.createdAt })),
        ...tasks.map((t) => ({ ...t, _type: 'task_completed', _at: t.completedAt ?? t.updatedAt })),
        ...referrals.map((r) => ({ ...r, _type: 'referral', _at: r.createdAt })),
      ].sort((a, b) => b._at.getTime() - a._at.getTime())

      return reply.status(200).send({ data: timeline })
    }
  )
}
