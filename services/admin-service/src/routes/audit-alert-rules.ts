import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { Prisma } from '../generated/prisma'
import { prisma } from '../lib/prisma'
import { subMinutes } from 'date-fns'

// ─── Validation schemas ────────────────────────────────────────────────────────

const createRuleSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  service: z.enum(['emr', 'crm', 'admin', 'auth']).nullable().optional(),
  entityType: z.string().max(80).nullable().optional(),
  action: z.enum(['create', 'update', 'delete', 'view']).nullable().optional(),
  actorRole: z.string().max(80).nullable().optional(),
  threshold: z.number().int().min(1).max(10_000).default(10),
  windowMinutes: z.number().int().min(1).max(10_080).default(60), // max 1 week
  severity: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
})

const updateRuleSchema = createRuleSchema.partial().extend({
  isActive: z.boolean().optional(),
})

// ─── Plugin ───────────────────────────────────────────────────────────────────

export async function auditAlertRulesRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/audit-alert-rules
   * List all audit alert rules.
   */
  fastify.get('/api/audit-alert-rules', async (_request: FastifyRequest, reply: FastifyReply) => {
    const rules = await prisma.auditAlertRule.findMany({
      orderBy: [{ isActive: 'desc' }, { severity: 'desc' }, { name: 'asc' }],
    })
    return reply.status(200).send({ data: rules })
  })

  /**
   * POST /api/audit-alert-rules
   * Create a new audit alert rule.
   */
  fastify.post('/api/audit-alert-rules', async (request: FastifyRequest, reply: FastifyReply) => {
    const actor = (request as FastifyRequest & { userId: string }).userId ?? 'unknown'
    const parsed = createRuleSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: parsed.error.errors.map((e) => e.message).join(', '),
      })
    }
    const d = parsed.data
    const rule = await prisma.auditAlertRule.create({
      data: {
        name: d.name,
        description: d.description ?? null,
        service: d.service ?? null,
        entityType: d.entityType ?? null,
        action: d.action ?? null,
        actorRole: d.actorRole ?? null,
        threshold: d.threshold,
        windowMinutes: d.windowMinutes,
        severity: d.severity,
        createdBy: actor,
      },
    })
    fastify.log.info({ ruleId: rule.id, actor }, 'Audit alert rule created')
    return reply.status(201).send({ data: rule })
  })

  /**
   * GET /api/audit-alert-rules/:id
   * Get a single rule with its current evaluation status.
   */
  fastify.get(
    '/api/audit-alert-rules/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const rule = await prisma.auditAlertRule.findUnique({ where: { id: request.params.id } })
      if (!rule) {
        return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Rule not found' })
      }

      // Evaluate current state
      const { breached, currentCount } = await evaluateRule(rule)

      return reply.status(200).send({ data: { ...rule, currentCount, breached } })
    }
  )

  /**
   * PATCH /api/audit-alert-rules/:id
   * Update a rule.
   */
  fastify.patch(
    '/api/audit-alert-rules/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const existing = await prisma.auditAlertRule.findUnique({ where: { id: request.params.id } })
      if (!existing) {
        return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Rule not found' })
      }

      const parsed = updateRuleSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: parsed.error.errors.map((e) => e.message).join(', '),
        })
      }

      const updated = await prisma.auditAlertRule.update({
        where: { id: request.params.id },
        data: parsed.data,
      })
      return reply.status(200).send({ data: updated })
    }
  )

  /**
   * DELETE /api/audit-alert-rules/:id
   * Delete a rule.
   */
  fastify.delete(
    '/api/audit-alert-rules/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const existing = await prisma.auditAlertRule.findUnique({ where: { id: request.params.id } })
      if (!existing) {
        return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Rule not found' })
      }
      await prisma.auditAlertRule.delete({ where: { id: request.params.id } })
      return reply.status(204).send()
    }
  )

  /**
   * POST /api/audit-alert-rules/:id/evaluate
   * Manually evaluate a rule against current audit data.
   * Returns whether the threshold is currently breached and the event count.
   */
  fastify.post(
    '/api/audit-alert-rules/:id/evaluate',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const rule = await prisma.auditAlertRule.findUnique({ where: { id: request.params.id } })
      if (!rule) {
        return reply.status(404).send({ statusCode: 404, error: 'Not Found', message: 'Rule not found' })
      }

      const { breached, currentCount, windowStart } = await evaluateRule(rule)

      return reply.status(200).send({
        data: {
          ruleId: rule.id,
          name: rule.name,
          severity: rule.severity,
          threshold: rule.threshold,
          windowMinutes: rule.windowMinutes,
          windowStart: windowStart.toISOString(),
          evaluatedAt: new Date().toISOString(),
          currentCount,
          breached,
        },
      })
    }
  )
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function evaluateRule(rule: {
  service: string | null
  entityType: string | null
  action: string | null
  actorRole: string | null
  threshold: number
  windowMinutes: number
}): Promise<{ breached: boolean; currentCount: number; windowStart: Date }> {
  const windowStart = subMinutes(new Date(), rule.windowMinutes)

  const where: Record<string, unknown> = { timestamp: { gte: windowStart } }
  if (rule.service) where.service = rule.service
  if (rule.entityType) where.entityType = rule.entityType
  if (rule.action) where.action = rule.action
  if (rule.actorRole) where.actorRole = rule.actorRole

  const currentCount = await prisma.auditEvent.count({
    where: where as Prisma.AuditEventWhereInput,
  })

  return { breached: currentCount >= rule.threshold, currentCount, windowStart }
}
