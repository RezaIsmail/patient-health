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

const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  type: z.enum(['call', 'email', 'follow_up', 'assessment', 'authorization', 'scheduling', 'care_plan_review', 'other']).default('follow_up'),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']).default('pending'),
  priority: z.enum(['low', 'normal', 'high', 'critical']).default('normal'),
  contactId: z.string().uuid().optional(),
  referralId: z.string().uuid().optional(),
  carePlanId: z.string().uuid().optional(),
  careGapId: z.string().uuid().optional(),
  assignedTo: z.string().min(1),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

const updateTaskSchema = createTaskSchema.partial().extend({
  completionNotes: z.string().max(5000).optional(),
  completedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export async function taskRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/tasks
   */
  fastify.get('/api/tasks', async (request: FastifyRequest, reply: FastifyReply) => {
    const q = request.query as Record<string, string>
    const assignedTo = q.assignedTo
    const status = q.status
    const priority = q.priority
    const contactId = q.contactId
    const referralId = q.referralId
    const page = parseInt(q.page ?? '1', 10)
    const pageSize = Math.min(parseInt(q.pageSize ?? '50', 10), 200)
    const skip = (page - 1) * pageSize

    const where = {
      ...(assignedTo && { assignedTo }),
      ...(status ? { status } : { status: { in: ['pending', 'in_progress'] } }),
      ...(priority && { priority }),
      ...(contactId && { contactId }),
      ...(referralId && { referralId }),
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ priority: 'asc' }, { dueDate: 'asc' }, { createdAt: 'asc' }],
        include: {
          contact: { select: { id: true, firstName: true, lastName: true } },
          referral: { select: { id: true, referralNumber: true, stage: true } },
        },
      }),
      prisma.task.count({ where }),
    ])

    return reply.status(200).send({
      data: tasks,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    })
  })

  /**
   * POST /api/tasks
   */
  fastify.post('/api/tasks', async (request: FastifyRequest, reply: FastifyReply) => {
    const correlationId = cid(request)
    const userId = getUserId(request)
    const body = createTaskSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
    }

    const { dueDate, ...rest } = body.data
    const task = await prisma.task.create({
      data: {
        ...rest,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        createdBy: userId,
      },
    })

    writeAuditLog({
      contactId: body.data.contactId,
      userId,
      action: 'CREATE',
      resourceType: 'Task',
      resourceId: task.id,
      ipAddress: request.ip,
      correlationId,
    })

    return reply.status(201).send({ data: task })
  })

  /**
   * GET /api/tasks/:id
   */
  fastify.get(
    '/api/tasks/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const { id } = request.params

      const task = await prisma.task.findUnique({
        where: { id },
        include: {
          contact: { select: { id: true, firstName: true, lastName: true } },
          referral: { select: { id: true, referralNumber: true, stage: true } },
          carePlan: { select: { id: true, title: true } },
        },
      })

      if (!task) {
        return reply.status(404).send(buildError(404, 'Not Found', `Task ${id} not found`, correlationId))
      }

      return reply.status(200).send({ data: task })
    }
  )

  /**
   * PATCH /api/tasks/:id
   */
  fastify.patch(
    '/api/tasks/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const userId = getUserId(request)
      const { id } = request.params

      const body = updateTaskSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
      }

      const existing = await prisma.task.findUnique({ where: { id }, select: { id: true, contactId: true } })
      if (!existing) {
        return reply.status(404).send(buildError(404, 'Not Found', `Task ${id} not found`, correlationId))
      }

      const { dueDate, completedAt, ...rest } = body.data

      // If marking complete, require completion notes
      if (rest.status === 'completed' && !rest.completionNotes && !body.data.completionNotes) {
        return reply.status(400).send(buildError(400, 'Bad Request', 'completionNotes are required when marking a task complete', correlationId))
      }

      const task = await prisma.task.update({
        where: { id },
        data: {
          ...rest,
          ...(dueDate !== undefined && { dueDate: new Date(dueDate) }),
          ...(completedAt !== undefined && { completedAt: new Date(completedAt) }),
          ...(rest.status === 'completed' && !completedAt && { completedAt: new Date() }),
        },
      })

      writeAuditLog({
        contactId: existing.contactId ?? undefined,
        userId,
        action: 'UPDATE',
        resourceType: 'Task',
        resourceId: id,
        changes: rest,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(200).send({ data: task })
    }
  )

  /**
   * DELETE /api/tasks/:id  (soft cancel)
   */
  fastify.delete(
    '/api/tasks/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const userId = getUserId(request)
      const { id } = request.params

      const existing = await prisma.task.findUnique({ where: { id }, select: { id: true, contactId: true } })
      if (!existing) {
        return reply.status(404).send(buildError(404, 'Not Found', `Task ${id} not found`, correlationId))
      }

      await prisma.task.update({ where: { id }, data: { status: 'cancelled' } })

      writeAuditLog({
        contactId: existing.contactId ?? undefined,
        userId,
        action: 'DELETE',
        resourceType: 'Task',
        resourceId: id,
        ipAddress: request.ip,
        correlationId,
      })

      return reply.status(204).send()
    }
  )
}
