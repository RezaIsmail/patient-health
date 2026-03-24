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

// ─── Schemas ──────────────────────────────────────────────────────────────────

const createRoleSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  productScope: z.enum(['emr', 'crm', 'admin', 'platform']).default('platform'),
  organisationId: z.string().uuid().optional(),
  permissions: z
    .array(
      z.object({
        resource_type: z.string(),
        action: z.enum(['read', 'write', 'delete', 'admin']),
        scope: z.enum(['own', 'org', 'all']).default('own'),
      })
    )
    .default([]),
})

const updateRoleSchema = createRoleSchema.partial()

const assignRoleSchema = z.object({
  roleId: z.string().uuid(),
  expiresAt: z.string().datetime().optional(),
})

// ─── Plugin ───────────────────────────────────────────────────────────────────

export async function roleRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/roles
   */
  fastify.get('/api/roles', async (request: FastifyRequest, reply: FastifyReply) => {
    const cid = correlationId(request)
    const query = z
      .object({
        productScope: z.string().optional(),
        page: z.coerce.number().int().min(1).default(1),
        pageSize: z.coerce.number().int().min(1).max(100).default(50),
      })
      .safeParse(request.query)

    if (!query.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', query.error.message, cid))
    }

    const { productScope, page, pageSize } = query.data
    const skip = (page - 1) * pageSize

    const where = { ...(productScope && { productScope }) }

    const [roles, total] = await Promise.all([
      prisma.role.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ isBuiltIn: 'desc' }, { name: 'asc' }],
        include: { _count: { select: { userRoles: true } } },
      }),
      prisma.role.count({ where }),
    ])

    return reply.status(200).send({
      data: roles,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    })
  })

  /**
   * POST /api/roles
   */
  fastify.post('/api/roles', async (request: FastifyRequest, reply: FastifyReply) => {
    const cid = correlationId(request)
    const body = createRoleSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
    }

    const { permissions, ...rest } = body.data
    const role = await prisma.role.create({
      data: {
        ...rest,
        isBuiltIn: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        permissions: permissions as any,
      },
    })

    return reply.status(201).send({ data: role })
  })

  /**
   * GET /api/roles/:id
   */
  fastify.get(
    '/api/roles/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { id } = request.params

      const role = await prisma.role.findUnique({
        where: { id },
        include: {
          userRoles: {
            where: { revokedAt: null },
            orderBy: { grantedAt: 'desc' },
            take: 50,
          },
          _count: { select: { userRoles: true } },
        },
      })

      if (!role) {
        return reply.status(404).send(buildError(404, 'Not Found', `Role ${id} not found`, cid))
      }

      return reply.status(200).send({ data: role })
    }
  )

  /**
   * PUT /api/roles/:id
   */
  fastify.put(
    '/api/roles/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { id } = request.params

      const body = updateRoleSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
      }

      const existing = await prisma.role.findUnique({
        where: { id },
        select: { id: true, isBuiltIn: true },
      })
      if (!existing) {
        return reply.status(404).send(buildError(404, 'Not Found', `Role ${id} not found`, cid))
      }
      if (existing.isBuiltIn) {
        return reply
          .status(403)
          .send(buildError(403, 'Forbidden', 'Built-in roles cannot be modified', cid))
      }

      const { permissions, ...rest } = body.data
      const role = await prisma.role.update({
        where: { id },
        data: {
          ...rest,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(permissions !== undefined && { permissions: permissions as any }),
        },
      })

      return reply.status(200).send({ data: role })
    }
  )

  /**
   * GET /api/users/:userId/roles
   */
  fastify.get(
    '/api/users/:userId/roles',
    async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
      const { userId } = request.params

      const userRoles = await prisma.userRole.findMany({
        where: { userId, revokedAt: null },
        include: { role: true },
        orderBy: { grantedAt: 'desc' },
      })

      return reply.status(200).send({ data: userRoles })
    }
  )

  /**
   * POST /api/users/:userId/roles
   */
  fastify.post(
    '/api/users/:userId/roles',
    async (request: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const grantedBy = getUserId(request)
      const { userId } = request.params

      const body = assignRoleSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
      }

      const role = await prisma.role.findUnique({
        where: { id: body.data.roleId },
        select: { id: true },
      })
      if (!role) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Role ${body.data.roleId} not found`, cid))
      }

      const userRole = await prisma.userRole.create({
        data: {
          userId,
          roleId: body.data.roleId,
          grantedBy,
          expiresAt: body.data.expiresAt ? new Date(body.data.expiresAt) : null,
        },
        include: { role: true },
      })

      return reply.status(201).send({ data: userRole })
    }
  )

  /**
   * DELETE /api/users/:userId/roles/:roleId
   */
  fastify.delete(
    '/api/users/:userId/roles/:roleId',
    async (
      request: FastifyRequest<{ Params: { userId: string; roleId: string } }>,
      reply: FastifyReply
    ) => {
      const cid = correlationId(request)
      const revokedBy = getUserId(request)
      const { userId, roleId } = request.params

      const userRole = await prisma.userRole.findFirst({
        where: { userId, roleId, revokedAt: null },
        select: { id: true },
      })
      if (!userRole) {
        return reply
          .status(404)
          .send(
            buildError(
              404,
              'Not Found',
              `Active role assignment not found for user ${userId}`,
              cid
            )
          )
      }

      await prisma.userRole.update({
        where: { id: userRole.id },
        data: { revokedAt: new Date(), revokedBy },
      })

      return reply.status(200).send({ data: { userId, roleId, revoked: true } })
    }
  )
}
