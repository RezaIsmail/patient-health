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

const createTemplateSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  templateType: z.enum(['communication', 'care_plan', 'document']),
  contentBody: z.string().min(1),
  variableTokens: z.array(z.object({ token: z.string(), description: z.string(), required: z.boolean() })).default([]),
  organisationId: z.string().uuid().optional(),
  programmeIds: z.array(z.string().uuid()).default([]),
  createdBy: z.string().min(1),
})

const updateTemplateSchema = createTemplateSchema.omit({ createdBy: true }).partial()

const listTemplatesQuerySchema = z.object({
  templateType: z.enum(['communication', 'care_plan', 'document']).optional(),
  status: z.string().optional(),
  organisationId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

const TEMPLATE_STATUS_TRANSITIONS: Record<string, string[]> = {
  draft: ['submitted', 'archived'],
  submitted: ['approved', 'draft', 'archived'],
  approved: ['active', 'archived'],
  active: ['archived'],
  archived: [],
}

// ─── Plugin ───────────────────────────────────────────────────────────────────

export async function templateRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/templates
   */
  fastify.get('/api/templates', async (request: FastifyRequest, reply: FastifyReply) => {
    const cid = correlationId(request)
    const query = listTemplatesQuerySchema.safeParse(request.query)
    if (!query.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', query.error.message, cid))
    }

    const { templateType, status, organisationId, page, pageSize } = query.data
    const skip = (page - 1) * pageSize

    const where = {
      ...(templateType && { templateType }),
      ...(status && { status }),
      ...(organisationId && { organisationId }),
    }

    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          name: true,
          description: true,
          templateType: true,
          status: true,
          versionNumber: true,
          createdBy: true,
          approvedBy: true,
          approvedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.template.count({ where }),
    ])

    return reply.status(200).send({
      data: templates,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    })
  })

  /**
   * POST /api/templates
   */
  fastify.post('/api/templates', async (request: FastifyRequest, reply: FastifyReply) => {
    const cid = correlationId(request)
    const body = createTemplateSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
    }

    const template = await prisma.template.create({
      data: {
        ...body.data,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        variableTokens: body.data.variableTokens as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        programmeIds: body.data.programmeIds as any,
        status: 'draft',
      },
    })

    return reply.status(201).send({ data: template })
  })

  /**
   * GET /api/templates/:id
   */
  fastify.get(
    '/api/templates/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { id } = request.params

      const template = await prisma.template.findUnique({ where: { id } })
      if (!template) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Template ${id} not found`, cid))
      }

      return reply.status(200).send({ data: template })
    }
  )

  /**
   * PUT /api/templates/:id
   * Updates content — creates a new version if status is active/approved
   */
  fastify.put(
    '/api/templates/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { id } = request.params

      const body = updateTemplateSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
      }

      const existing = await prisma.template.findUnique({ where: { id } })
      if (!existing) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Template ${id} not found`, cid))
      }
      if (existing.status === 'archived') {
        return reply
          .status(409)
          .send(buildError(409, 'Conflict', 'Archived templates cannot be edited', cid))
      }

      const { variableTokens, programmeIds, ...rest } = body.data
      const template = await prisma.template.update({
        where: { id },
        data: {
          ...rest,
          ...(variableTokens !== undefined && { variableTokens: variableTokens as never }),
          ...(programmeIds !== undefined && { programmeIds: programmeIds as never }),
          // Reset approval if content changes on an approved/active template
          ...(existing.status === 'active' && { status: 'draft', versionNumber: existing.versionNumber + 1, approvedBy: null, approvedAt: null }),
        },
      })

      return reply.status(200).send({ data: template })
    }
  )

  /**
   * PATCH /api/templates/:id/status
   * Advance or revert approval workflow status
   */
  fastify.patch(
    '/api/templates/:id/status',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { id } = request.params

      const body = z
        .object({ status: z.string().min(1), actorId: z.string().min(1) })
        .safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
      }

      const { status: newStatus, actorId } = body.data

      const template = await prisma.template.findUnique({ where: { id } })
      if (!template) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Template ${id} not found`, cid))
      }

      const allowed = TEMPLATE_STATUS_TRANSITIONS[template.status] ?? []
      if (!allowed.includes(newStatus)) {
        return reply
          .status(400)
          .send(
            buildError(
              400,
              'Bad Request',
              `Cannot transition from '${template.status}' to '${newStatus}'`,
              cid
            )
          )
      }

      const updated = await prisma.template.update({
        where: { id },
        data: {
          status: newStatus,
          ...(newStatus === 'approved' && { approvedBy: actorId, approvedAt: new Date() }),
          ...(newStatus === 'active' && template.status !== 'approved' && {
            approvedBy: actorId,
            approvedAt: new Date(),
          }),
        },
      })

      return reply.status(200).send({ data: updated })
    }
  )
}
