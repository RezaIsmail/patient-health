import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { prisma } from '../lib/prisma'
import { format } from 'date-fns'

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

async function generateReferralNumber(): Promise<string> {
  const today = format(new Date(), 'yyyyMMdd')
  const prefix = `REF-${today}-`
  const count = await prisma.referral.count({
    where: { referralNumber: { startsWith: prefix } },
  })
  const seq = String(count + 1).padStart(4, '0')
  return `${prefix}${seq}`
}

const VALID_STAGES = ['received', 'reviewing', 'authorized', 'scheduled', 'completed', 'declined', 'cancelled']

const createReferralSchema = z.object({
  contactId: z.string().uuid(),
  type: z.enum(['inbound', 'outbound']).default('inbound'),
  priority: z.enum(['routine', 'urgent', 'emergent']).default('routine'),
  referringProvider: z.string().max(255).optional(),
  referringOrgName: z.string().max(255).optional(),
  receivingProvider: z.string().max(255).optional(),
  receivingOrgName: z.string().max(255).optional(),
  reasonCode: z.string().max(20).optional(),
  reasonDisplay: z.string().min(1).max(500),
  authorizationNumber: z.string().max(100).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  assignedTo: z.string().optional(),
})

const updateReferralSchema = createReferralSchema.omit({ contactId: true }).partial().extend({
  outcome: z.enum(['kept', 'no_show', 'patient_cancelled', 'transferred']).optional(),
  outcomeNotes: z.string().max(5000).optional(),
})

const moveStageSchema = z.object({
  stage: z.enum(['received', 'reviewing', 'authorized', 'scheduled', 'completed', 'declined', 'cancelled']),
  notes: z.string().max(2000).optional(),
})

export async function referralRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/referrals
   */
  fastify.get('/api/referrals', async (request: FastifyRequest, reply: FastifyReply) => {
    const q = request.query as Record<string, string>
    const contactId = q.contactId
    const stage = q.stage
    const priority = q.priority
    const type = q.type
    const assignedTo = q.assignedTo
    const page = parseInt(q.page ?? '1', 10)
    const pageSize = Math.min(parseInt(q.pageSize ?? '50', 10), 200)
    const skip = (page - 1) * pageSize

    const where = {
      ...(contactId && { contactId }),
      ...(stage && { stage }),
      ...(priority && { priority }),
      ...(type && { type }),
      ...(assignedTo && { assignedTo }),
      // Exclude terminal stages by default unless explicitly filtered
      ...(stage === undefined && { stage: { notIn: ['completed', 'declined', 'cancelled'] } }),
    }

    const [referrals, total] = await Promise.all([
      prisma.referral.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
        include: {
          contact: {
            select: { id: true, firstName: true, lastName: true, riskLevel: true, phone: true, dateOfBirth: true },
          },
        },
      }),
      prisma.referral.count({ where }),
    ])

    return reply.status(200).send({
      data: referrals,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    })
  })

  /**
   * GET /api/referrals/board
   * Returns referrals grouped by stage for Kanban board view.
   */
  fastify.get('/api/referrals/board', async (request: FastifyRequest, reply: FastifyReply) => {
    const activeStages = ['received', 'reviewing', 'authorized', 'scheduled']

    const referrals = await prisma.referral.findMany({
      where: { stage: { in: activeStages } },
      orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
      include: {
        contact: {
          select: { id: true, firstName: true, lastName: true, riskLevel: true, phone: true, dateOfBirth: true },
        },
      },
    })

    const board: Record<string, typeof referrals> = {}
    for (const stage of activeStages) {
      board[stage] = []
    }
    for (const referral of referrals) {
      if (board[referral.stage]) {
        board[referral.stage].push(referral)
      }
    }

    return reply.status(200).send({ data: board })
  })

  /**
   * POST /api/referrals
   */
  fastify.post('/api/referrals', async (request: FastifyRequest, reply: FastifyReply) => {
    const correlationId = cid(request)
    const userId = getUserId(request)
    const body = createReferralSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
    }

    const contact = await prisma.contact.findUnique({ where: { id: body.data.contactId }, select: { id: true } })
    if (!contact) {
      return reply.status(404).send(buildError(404, 'Not Found', 'Contact not found', correlationId))
    }

    const referralNumber = await generateReferralNumber()
    const { dueDate, ...rest } = body.data

    const referral = await prisma.referral.create({
      data: {
        ...rest,
        referralNumber,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        createdBy: userId,
      },
      include: {
        contact: { select: { id: true, firstName: true, lastName: true } },
      },
    })

    // Auto-log a system event communication
    prisma.communication
      .create({
        data: {
          contactId: body.data.contactId,
          type: 'system_event',
          direction: 'outbound',
          subject: `Referral ${referralNumber} received`,
          content: `Referral created: ${body.data.reasonDisplay} (${body.data.type}, ${body.data.priority} priority)`,
          status: 'sent',
          sentBy: userId,
          referralId: referral.id,
        },
      })
      .catch(() => null)

    writeAuditLog({
      contactId: body.data.contactId,
      userId,
      action: 'CREATE',
      resourceType: 'Referral',
      resourceId: referral.id,
      ipAddress: request.ip,
      correlationId,
    })

    return reply.status(201).send({ data: referral })
  })

  /**
   * GET /api/referrals/:id
   */
  fastify.get(
    '/api/referrals/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const { id } = request.params

      const referral = await prisma.referral.findUnique({
        where: { id },
        include: {
          contact: { select: { id: true, firstName: true, lastName: true, riskLevel: true, phone: true } },
          tasks: { where: { status: { in: ['pending', 'in_progress'] } }, orderBy: { dueDate: 'asc' } },
          communications: { orderBy: { createdAt: 'desc' }, take: 20 },
        },
      })

      if (!referral) {
        return reply.status(404).send(buildError(404, 'Not Found', `Referral ${id} not found`, correlationId))
      }

      return reply.status(200).send({ data: referral })
    }
  )

  /**
   * PATCH /api/referrals/:id
   */
  fastify.patch(
    '/api/referrals/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const userId = getUserId(request)
      const { id } = request.params

      const body = updateReferralSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
      }

      const existing = await prisma.referral.findUnique({ where: { id }, select: { id: true, contactId: true } })
      if (!existing) {
        return reply.status(404).send(buildError(404, 'Not Found', `Referral ${id} not found`, correlationId))
      }

      const { dueDate, ...rest } = body.data
      const referral = await prisma.referral.update({
        where: { id },
        data: {
          ...rest,
          ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
        },
      })

      writeAuditLog({
        contactId: existing.contactId,
        userId,
        action: 'UPDATE',
        resourceType: 'Referral',
        resourceId: id,
        changes: rest,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(200).send({ data: referral })
    }
  )

  /**
   * PATCH /api/referrals/:id/stage
   * Move a referral to a new pipeline stage.
   */
  fastify.patch(
    '/api/referrals/:id/stage',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const userId = getUserId(request)
      const { id } = request.params

      const body = moveStageSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
      }

      const existing = await prisma.referral.findUnique({
        where: { id },
        select: { id: true, contactId: true, stage: true, referralNumber: true },
      })
      if (!existing) {
        return reply.status(404).send(buildError(404, 'Not Found', `Referral ${id} not found`, correlationId))
      }

      const prevStage = existing.stage
      const referral = await prisma.referral.update({
        where: { id },
        data: { stage: body.data.stage },
      })

      // Log the stage transition as a system communication
      prisma.communication
        .create({
          data: {
            contactId: existing.contactId,
            type: 'system_event',
            direction: 'outbound',
            subject: `Referral ${existing.referralNumber} moved to ${body.data.stage}`,
            content: body.data.notes ?? `Stage changed from ${prevStage} to ${body.data.stage}`,
            status: 'sent',
            sentBy: userId,
            referralId: id,
          },
        })
        .catch(() => null)

      // Auto-create a task when referral is authorized
      if (body.data.stage === 'authorized') {
        prisma.task
          .create({
            data: {
              title: `Schedule appointment for referral ${existing.referralNumber}`,
              type: 'scheduling',
              status: 'pending',
              priority: 'normal',
              contactId: existing.contactId,
              referralId: id,
              assignedTo: userId,
              createdBy: userId,
            },
          })
          .catch(() => null)
      }

      writeAuditLog({
        contactId: existing.contactId,
        userId,
        action: 'UPDATE',
        resourceType: 'Referral',
        resourceId: id,
        changes: { stage: { from: prevStage, to: body.data.stage } },
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(200).send({ data: referral })
    }
  )
}
