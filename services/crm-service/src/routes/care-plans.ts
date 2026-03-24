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

const createCarePlanSchema = z.object({
  contactId: z.string().uuid(),
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  status: z.enum(['draft', 'active', 'completed', 'cancelled']).default('draft'),
  templateKey: z.string().max(100).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  assignedTo: z.string().optional(),
})

const updateCarePlanSchema = createCarePlanSchema.omit({ contactId: true }).partial()

const createProblemSchema = z.object({
  description: z.string().min(1).max(500),
  snomedCode: z.string().max(50).optional(),
  icd10Code: z.string().max(20).optional(),
  status: z.enum(['active', 'resolved']).default('active'),
  onsetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

const createGoalSchema = z.object({
  problemId: z.string().uuid().optional(),
  description: z.string().min(1).max(500),
  targetDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  status: z.enum(['in_progress', 'achieved', 'not_achieved', 'cancelled']).default('in_progress'),
})

const updateGoalSchema = createGoalSchema.partial().extend({
  achievedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

const createInterventionSchema = z.object({
  goalId: z.string().uuid().optional(),
  description: z.string().min(1).max(500),
  type: z.enum(['education', 'referral', 'medication_adjustment', 'behavioural', 'monitoring', 'other']).default('other'),
  frequency: z.string().max(100).optional(),
  assignedTo: z.string().optional(),
  status: z.enum(['active', 'completed', 'cancelled']).default('active'),
})

const createNoteSchema = z.object({
  content: z.string().min(1).max(10000),
  authorName: z.string().min(1).max(255),
})

export async function carePlanRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/care-plans
   */
  fastify.get('/api/care-plans', async (request: FastifyRequest, reply: FastifyReply) => {
    const q = request.query as Record<string, string>
    const contactId = q.contactId
    const status = q.status
    const assignedTo = q.assignedTo
    const page = parseInt(q.page ?? '1', 10)
    const pageSize = Math.min(parseInt(q.pageSize ?? '20', 10), 100)
    const skip = (page - 1) * pageSize

    const where = {
      ...(contactId && { contactId }),
      ...(status && { status }),
      ...(assignedTo && { assignedTo }),
    }

    const [plans, total] = await Promise.all([
      prisma.carePlan.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          contact: { select: { id: true, firstName: true, lastName: true, riskLevel: true } },
          _count: { select: { problems: true, goals: true, interventions: true } },
        },
      }),
      prisma.carePlan.count({ where }),
    ])

    return reply.status(200).send({
      data: plans,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    })
  })

  /**
   * POST /api/care-plans
   */
  fastify.post('/api/care-plans', async (request: FastifyRequest, reply: FastifyReply) => {
    const correlationId = cid(request)
    const userId = getUserId(request)
    const body = createCarePlanSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
    }

    const contact = await prisma.contact.findUnique({ where: { id: body.data.contactId }, select: { id: true } })
    if (!contact) {
      return reply.status(404).send(buildError(404, 'Not Found', 'Contact not found', correlationId))
    }

    const { startDate, endDate, ...rest } = body.data
    const plan = await prisma.carePlan.create({
      data: {
        ...rest,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        createdBy: userId,
      },
    })

    writeAuditLog({
      contactId: body.data.contactId,
      userId,
      action: 'CREATE',
      resourceType: 'CarePlan',
      resourceId: plan.id,
      ipAddress: request.ip,
      correlationId,
    })

    return reply.status(201).send({ data: plan })
  })

  /**
   * GET /api/care-plans/:id
   */
  fastify.get(
    '/api/care-plans/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const { id } = request.params

      const plan = await prisma.carePlan.findUnique({
        where: { id },
        include: {
          contact: { select: { id: true, firstName: true, lastName: true, riskLevel: true } },
          problems: true,
          goals: { include: { problem: { select: { id: true, description: true } } } },
          interventions: true,
          progressNotes: { orderBy: { createdAt: 'desc' } },
        },
      })

      if (!plan) {
        return reply.status(404).send(buildError(404, 'Not Found', `Care plan ${id} not found`, correlationId))
      }

      return reply.status(200).send({ data: plan })
    }
  )

  /**
   * PATCH /api/care-plans/:id
   */
  fastify.patch(
    '/api/care-plans/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const userId = getUserId(request)
      const { id } = request.params

      const body = updateCarePlanSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
      }

      const existing = await prisma.carePlan.findUnique({ where: { id }, select: { id: true, contactId: true } })
      if (!existing) {
        return reply.status(404).send(buildError(404, 'Not Found', `Care plan ${id} not found`, correlationId))
      }

      const { startDate, endDate, ...rest } = body.data
      const plan = await prisma.carePlan.update({
        where: { id },
        data: {
          ...rest,
          ...(startDate !== undefined && { startDate: new Date(startDate) }),
          ...(endDate !== undefined && { endDate: new Date(endDate) }),
        },
      })

      writeAuditLog({
        contactId: existing.contactId,
        userId,
        action: 'UPDATE',
        resourceType: 'CarePlan',
        resourceId: id,
        changes: rest,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(200).send({ data: plan })
    }
  )

  // ── Problems ──────────────────────────────────────────────────────────────

  fastify.post(
    '/api/care-plans/:id/problems',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const userId = getUserId(request)
      const { id } = request.params

      const body = createProblemSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
      }

      const plan = await prisma.carePlan.findUnique({ where: { id }, select: { id: true, contactId: true } })
      if (!plan) {
        return reply.status(404).send(buildError(404, 'Not Found', `Care plan ${id} not found`, correlationId))
      }

      const { onsetDate, ...rest } = body.data
      const problem = await prisma.carePlanProblem.create({
        data: {
          carePlanId: id,
          ...rest,
          onsetDate: onsetDate ? new Date(onsetDate) : undefined,
        },
      })

      writeAuditLog({
        contactId: plan.contactId,
        userId,
        action: 'CREATE',
        resourceType: 'CarePlanProblem',
        resourceId: problem.id,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(201).send({ data: problem })
    }
  )

  // ── Goals ─────────────────────────────────────────────────────────────────

  fastify.post(
    '/api/care-plans/:id/goals',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const userId = getUserId(request)
      const { id } = request.params

      const body = createGoalSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
      }

      const plan = await prisma.carePlan.findUnique({ where: { id }, select: { id: true, contactId: true } })
      if (!plan) {
        return reply.status(404).send(buildError(404, 'Not Found', `Care plan ${id} not found`, correlationId))
      }

      const { targetDate, ...rest } = body.data
      const goal = await prisma.carePlanGoal.create({
        data: {
          carePlanId: id,
          ...rest,
          targetDate: targetDate ? new Date(targetDate) : undefined,
        },
      })

      writeAuditLog({
        contactId: plan.contactId,
        userId,
        action: 'CREATE',
        resourceType: 'CarePlanGoal',
        resourceId: goal.id,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(201).send({ data: goal })
    }
  )

  fastify.patch(
    '/api/care-plans/:id/goals/:goalId',
    async (request: FastifyRequest<{ Params: { id: string; goalId: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const userId = getUserId(request)
      const { id, goalId } = request.params

      const body = updateGoalSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
      }

      const plan = await prisma.carePlan.findUnique({ where: { id }, select: { id: true, contactId: true } })
      if (!plan) {
        return reply.status(404).send(buildError(404, 'Not Found', `Care plan ${id} not found`, correlationId))
      }

      const { targetDate, achievedDate, ...rest } = body.data
      const goal = await prisma.carePlanGoal.update({
        where: { id: goalId },
        data: {
          ...rest,
          ...(targetDate !== undefined && { targetDate: new Date(targetDate) }),
          ...(achievedDate !== undefined && { achievedDate: new Date(achievedDate) }),
        },
      })

      writeAuditLog({
        contactId: plan.contactId,
        userId,
        action: 'UPDATE',
        resourceType: 'CarePlanGoal',
        resourceId: goalId,
        changes: rest,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(200).send({ data: goal })
    }
  )

  // ── Interventions ─────────────────────────────────────────────────────────

  fastify.post(
    '/api/care-plans/:id/interventions',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const userId = getUserId(request)
      const { id } = request.params

      const body = createInterventionSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
      }

      const plan = await prisma.carePlan.findUnique({ where: { id }, select: { id: true, contactId: true } })
      if (!plan) {
        return reply.status(404).send(buildError(404, 'Not Found', `Care plan ${id} not found`, correlationId))
      }

      const intervention = await prisma.carePlanIntervention.create({
        data: { carePlanId: id, ...body.data },
      })

      writeAuditLog({
        contactId: plan.contactId,
        userId,
        action: 'CREATE',
        resourceType: 'CarePlanIntervention',
        resourceId: intervention.id,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(201).send({ data: intervention })
    }
  )

  // ── Progress Notes ────────────────────────────────────────────────────────

  fastify.post(
    '/api/care-plans/:id/notes',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const userId = getUserId(request)
      const { id } = request.params

      const body = createNoteSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
      }

      const plan = await prisma.carePlan.findUnique({ where: { id }, select: { id: true, contactId: true } })
      if (!plan) {
        return reply.status(404).send(buildError(404, 'Not Found', `Care plan ${id} not found`, correlationId))
      }

      const note = await prisma.carePlanNote.create({
        data: { carePlanId: id, ...body.data, authorId: userId },
      })

      return reply.status(201).send({ data: note })
    }
  )
}
