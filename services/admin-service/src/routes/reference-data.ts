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

const createTableSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  organisationId: z.string().uuid().optional(),
})

const createEntrySchema = z.object({
  code: z.string().min(1).max(50),
  label: z.string().min(1).max(200),
  description: z.string().optional(),
  effectiveFrom: z.string().datetime().optional(),
  effectiveTo: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
})

const updateEntrySchema = createEntrySchema.partial()

// ─── Built-in tables (seeded on first boot) ───────────────────────────────────

export const BUILT_IN_TABLES = [
  { name: 'programme_types', description: 'Care programme type codes' },
  { name: 'disenrollment_reason_codes', description: 'Coded reasons for programme disenrollment' },
  { name: 'task_categories', description: 'Categories for care tasks' },
  { name: 'document_types', description: 'Document type classifications' },
  { name: 'sdoh_flag_types', description: 'Social determinants of health flag types' },
  { name: 'risk_level_definitions', description: 'Risk level tier definitions' },
  { name: 'consent_types', description: 'Types of consent recording' },
]

// ─── Plugin ───────────────────────────────────────────────────────────────────

export async function referenceDataRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/reference-tables
   */
  fastify.get('/api/reference-tables', async (request: FastifyRequest, reply: FastifyReply) => {
    const tables = await prisma.referenceTable.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { entries: true } } },
    })
    return reply.status(200).send({ data: tables })
  })

  /**
   * POST /api/reference-tables
   */
  fastify.post('/api/reference-tables', async (request: FastifyRequest, reply: FastifyReply) => {
    const cid = correlationId(request)
    const body = createTableSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
    }

    const existing = await prisma.referenceTable.findUnique({ where: { name: body.data.name } })
    if (existing) {
      return reply
        .status(409)
        .send(buildError(409, 'Conflict', `Reference table '${body.data.name}' already exists`, cid))
    }

    const table = await prisma.referenceTable.create({ data: body.data })
    return reply.status(201).send({ data: table })
  })

  /**
   * GET /api/reference-tables/:tableId/entries
   */
  fastify.get(
    '/api/reference-tables/:tableId/entries',
    async (request: FastifyRequest<{ Params: { tableId: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { tableId } = request.params

      const table = await prisma.referenceTable.findUnique({
        where: { id: tableId },
        select: { id: true, name: true },
      })
      if (!table) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Reference table ${tableId} not found`, cid))
      }

      const entries = await prisma.referenceEntry.findMany({
        where: { tableId },
        orderBy: [{ sortOrder: 'asc' }, { code: 'asc' }],
      })

      return reply.status(200).send({ data: entries, meta: { table } })
    }
  )

  /**
   * POST /api/reference-tables/:tableId/entries
   */
  fastify.post(
    '/api/reference-tables/:tableId/entries',
    async (request: FastifyRequest<{ Params: { tableId: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { tableId } = request.params

      const body = createEntrySchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
      }

      const table = await prisma.referenceTable.findUnique({
        where: { id: tableId },
        select: { id: true, isBuiltIn: true },
      })
      if (!table) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Reference table ${tableId} not found`, cid))
      }

      const duplicate = await prisma.referenceEntry.findUnique({
        where: { tableId_code: { tableId, code: body.data.code } },
      })
      if (duplicate) {
        return reply
          .status(409)
          .send(buildError(409, 'Conflict', `Entry with code '${body.data.code}' already exists`, cid))
      }

      const { effectiveFrom, effectiveTo, ...rest } = body.data
      const entry = await prisma.referenceEntry.create({
        data: {
          tableId,
          ...rest,
          ...(effectiveFrom && { effectiveFrom: new Date(effectiveFrom) }),
          ...(effectiveTo && { effectiveTo: new Date(effectiveTo) }),
        },
      })

      return reply.status(201).send({ data: entry })
    }
  )

  /**
   * PATCH /api/reference-tables/:tableId/entries/:entryId
   */
  fastify.patch(
    '/api/reference-tables/:tableId/entries/:entryId',
    async (
      request: FastifyRequest<{ Params: { tableId: string; entryId: string } }>,
      reply: FastifyReply
    ) => {
      const cid = correlationId(request)
      const { tableId, entryId } = request.params

      const body = updateEntrySchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
      }

      const entry = await prisma.referenceEntry.findFirst({
        where: { id: entryId, tableId },
      })
      if (!entry) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Entry ${entryId} not found`, cid))
      }

      const { effectiveFrom, effectiveTo, ...rest } = body.data
      const updated = await prisma.referenceEntry.update({
        where: { id: entryId },
        data: {
          ...rest,
          ...(effectiveFrom !== undefined && {
            effectiveFrom: effectiveFrom ? new Date(effectiveFrom) : undefined,
          }),
          ...(effectiveTo !== undefined && {
            effectiveTo: effectiveTo ? new Date(effectiveTo) : null,
          }),
        },
      })

      return reply.status(200).send({ data: updated })
    }
  )

  /**
   * DELETE /api/reference-tables/:tableId/entries/:entryId
   * Soft-delete by setting isActive=false and effectiveTo=now
   */
  fastify.delete(
    '/api/reference-tables/:tableId/entries/:entryId',
    async (
      request: FastifyRequest<{ Params: { tableId: string; entryId: string } }>,
      reply: FastifyReply
    ) => {
      const cid = correlationId(request)
      const { tableId, entryId } = request.params

      const entry = await prisma.referenceEntry.findFirst({ where: { id: entryId, tableId } })
      if (!entry) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Entry ${entryId} not found`, cid))
      }

      await prisma.referenceEntry.update({
        where: { id: entryId },
        data: { isActive: false, effectiveTo: new Date() },
      })

      return reply.status(204).send()
    }
  )
}
