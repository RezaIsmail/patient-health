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

const createOrgSchema = z.object({
  name: z.string().min(1).max(200),
  type: z
    .enum(['health_system', 'clinic', 'payer', 'employer', 'community_org'])
    .default('clinic'),
  status: z.enum(['active', 'inactive']).default('active'),
  phone: z.string().max(20).optional(),
  email: z.string().email().max(255).optional(),
  website: z.string().url().optional(),
  addressLine1: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(2).default('US'),
})

const updateOrgSchema = createOrgSchema.partial()

const listOrgsQuerySchema = z.object({
  q: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

const createSiteSchema = z.object({
  name: z.string().min(1).max(200),
  siteType: z.enum(['clinic', 'hospital', 'virtual', 'admin_only']).default('clinic'),
  addressLine1: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(50).optional(),
  postalCode: z.string().max(20).optional(),
  status: z.enum(['active', 'inactive']).default('active'),
})

const createDepartmentSchema = z.object({
  name: z.string().min(1).max(200),
  departmentType: z
    .enum(['clinical', 'administrative', 'operations', 'compliance'])
    .default('clinical'),
  headUserId: z.string().optional(),
})

// ─── Plugin ───────────────────────────────────────────────────────────────────

export async function organisationRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/organisations
   */
  fastify.get('/api/organisations', async (request: FastifyRequest, reply: FastifyReply) => {
    const cid = correlationId(request)
    const query = listOrgsQuerySchema.safeParse(request.query)
    if (!query.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', query.error.message, cid))
    }

    const { q, status, type, page, pageSize } = query.data
    const skip = (page - 1) * pageSize

    const where = {
      ...(q && {
        OR: [
          { name: { contains: q, mode: 'insensitive' as const } },
          { email: { contains: q, mode: 'insensitive' as const } },
        ],
      }),
      ...(status && { status }),
      ...(type && { type }),
    }

    const [organisations, total] = await Promise.all([
      prisma.organisation.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { name: 'asc' },
        include: {
          _count: { select: { sites: true, members: true, programmes: true } },
        },
      }),
      prisma.organisation.count({ where }),
    ])

    return reply.status(200).send({
      data: organisations,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    })
  })

  /**
   * POST /api/organisations
   */
  fastify.post('/api/organisations', async (request: FastifyRequest, reply: FastifyReply) => {
    const cid = correlationId(request)
    const body = createOrgSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
    }

    const org = await prisma.organisation.create({ data: body.data })
    return reply.status(201).send({ data: org })
  })

  /**
   * GET /api/organisations/:id
   */
  fastify.get(
    '/api/organisations/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { id } = request.params

      const org = await prisma.organisation.findUnique({
        where: { id },
        include: {
          sites: {
            include: {
              _count: { select: { departments: true, members: true } },
            },
            orderBy: { name: 'asc' },
          },
          _count: { select: { members: true, programmes: true } },
        },
      })

      if (!org) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Organisation ${id} not found`, cid))
      }

      return reply.status(200).send({ data: org })
    }
  )

  /**
   * PUT /api/organisations/:id
   */
  fastify.put(
    '/api/organisations/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { id } = request.params

      const body = updateOrgSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
      }

      const existing = await prisma.organisation.findUnique({ where: { id }, select: { id: true } })
      if (!existing) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Organisation ${id} not found`, cid))
      }

      const org = await prisma.organisation.update({ where: { id }, data: body.data })
      return reply.status(200).send({ data: org })
    }
  )

  /**
   * GET /api/organisations/:id/sites
   */
  fastify.get(
    '/api/organisations/:id/sites',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { id } = request.params

      const org = await prisma.organisation.findUnique({ where: { id }, select: { id: true } })
      if (!org) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Organisation ${id} not found`, cid))
      }

      const sites = await prisma.site.findMany({
        where: { organisationId: id },
        include: {
          _count: { select: { departments: true, members: true } },
        },
        orderBy: { name: 'asc' },
      })

      return reply.status(200).send({ data: sites })
    }
  )

  /**
   * POST /api/organisations/:id/sites
   */
  fastify.post(
    '/api/organisations/:id/sites',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { id } = request.params

      const body = createSiteSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
      }

      const org = await prisma.organisation.findUnique({ where: { id }, select: { id: true } })
      if (!org) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Organisation ${id} not found`, cid))
      }

      const site = await prisma.site.create({
        data: { ...body.data, organisationId: id },
      })

      return reply.status(201).send({ data: site })
    }
  )

  /**
   * GET /api/organisations/:id/sites/:siteId/departments
   */
  fastify.get(
    '/api/organisations/:id/sites/:siteId/departments',
    async (
      request: FastifyRequest<{ Params: { id: string; siteId: string } }>,
      reply: FastifyReply
    ) => {
      const cid = correlationId(request)
      const { id, siteId } = request.params

      const site = await prisma.site.findFirst({
        where: { id: siteId, organisationId: id },
        select: { id: true },
      })
      if (!site) {
        return reply.status(404).send(buildError(404, 'Not Found', `Site ${siteId} not found`, cid))
      }

      const departments = await prisma.department.findMany({
        where: { siteId },
        include: { _count: { select: { teams: true } } },
        orderBy: { name: 'asc' },
      })

      return reply.status(200).send({ data: departments })
    }
  )

  /**
   * POST /api/organisations/:id/sites/:siteId/departments
   */
  fastify.post(
    '/api/organisations/:id/sites/:siteId/departments',
    async (
      request: FastifyRequest<{ Params: { id: string; siteId: string } }>,
      reply: FastifyReply
    ) => {
      const cid = correlationId(request)
      const { id, siteId } = request.params

      const body = createDepartmentSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
      }

      const site = await prisma.site.findFirst({
        where: { id: siteId, organisationId: id },
        select: { id: true },
      })
      if (!site) {
        return reply.status(404).send(buildError(404, 'Not Found', `Site ${siteId} not found`, cid))
      }

      const department = await prisma.department.create({
        data: { ...body.data, siteId },
      })

      return reply.status(201).send({ data: department })
    }
  )
}
