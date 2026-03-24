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

const createProgrammeSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  programmeType: z
    .enum([
      'chronic_disease',
      'preventive',
      'behavioural_health',
      'post_discharge',
      'complex_care',
      'other',
    ])
    .default('chronic_disease'),
  status: z.enum(['draft', 'active', 'inactive']).default('draft'),
  organisationId: z.string().uuid(),
  eligibilityCriteria: z.record(z.unknown()).optional(),
  enrollmentCapacity: z.number().int().positive().optional(),
  slaDefinitions: z.record(z.unknown()).optional(),
})

const updateProgrammeSchema = createProgrammeSchema.partial().omit({ organisationId: true })

const listProgrammesQuerySchema = z.object({
  status: z.string().optional(),
  organisationId: z.string().optional(),
  programmeType: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
})

const ENROLLMENT_STATES = [
  'referred',
  'screened',
  'eligible',
  'consented',
  'enrolled',
  'active',
  'graduated',
  'disenrolled',
  'transferred',
  'declined',
] as const

// ─── Plugin ───────────────────────────────────────────────────────────────────

export async function programmeRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/programmes
   */
  fastify.get('/api/programmes', async (request: FastifyRequest, reply: FastifyReply) => {
    const cid = correlationId(request)
    const query = listProgrammesQuerySchema.safeParse(request.query)
    if (!query.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', query.error.message, cid))
    }

    const { status, organisationId, programmeType, page, pageSize } = query.data
    const skip = (page - 1) * pageSize

    const where = {
      ...(status && { status }),
      ...(organisationId && { organisationId }),
      ...(programmeType && { programmeType }),
    }

    const [programmes, total] = await Promise.all([
      prisma.programme.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { name: 'asc' },
        include: {
          organisation: { select: { id: true, name: true } },
          _count: { select: { enrollments: true } },
        },
      }),
      prisma.programme.count({ where }),
    ])

    return reply.status(200).send({
      data: programmes,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    })
  })

  /**
   * POST /api/programmes
   */
  fastify.post('/api/programmes', async (request: FastifyRequest, reply: FastifyReply) => {
    const cid = correlationId(request)
    const body = createProgrammeSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
    }

    const { eligibilityCriteria, slaDefinitions, ...rest } = body.data
    const programme = await prisma.programme.create({
      data: {
        ...rest,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        eligibilityCriteria: (eligibilityCriteria ?? undefined) as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        slaDefinitions: (slaDefinitions ?? undefined) as any,
      },
      include: {
        organisation: { select: { id: true, name: true } },
      },
    })

    return reply.status(201).send({ data: programme })
  })

  /**
   * GET /api/programmes/:id
   */
  fastify.get(
    '/api/programmes/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { id } = request.params

      const programme = await prisma.programme.findUnique({
        where: { id },
        include: {
          organisation: { select: { id: true, name: true } },
          _count: { select: { enrollments: true } },
        },
      })

      if (!programme) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Programme ${id} not found`, cid))
      }

      // Compute enrollment counts per state
      const enrollmentsByState = await Promise.all(
        ENROLLMENT_STATES.map(async (state) => ({
          state,
          count: await prisma.programmeEnrollment.count({
            where: { programmeId: id, state },
          }),
        }))
      )

      return reply.status(200).send({
        data: { ...programme, enrollmentsByState },
      })
    }
  )

  /**
   * PUT /api/programmes/:id
   */
  fastify.put(
    '/api/programmes/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { id } = request.params

      const body = updateProgrammeSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, cid))
      }

      const existing = await prisma.programme.findUnique({ where: { id }, select: { id: true } })
      if (!existing) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Programme ${id} not found`, cid))
      }

      const { eligibilityCriteria, slaDefinitions, ...rest } = body.data
      const programme = await prisma.programme.update({
        where: { id },
        data: {
          ...rest,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(eligibilityCriteria !== undefined && { eligibilityCriteria: eligibilityCriteria as any }),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(slaDefinitions !== undefined && { slaDefinitions: slaDefinitions as any }),
        },
      })

      return reply.status(200).send({ data: programme })
    }
  )

  /**
   * GET /api/programmes/:id/enrollments
   */
  fastify.get(
    '/api/programmes/:id/enrollments',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const cid = correlationId(request)
      const { id } = request.params
      const query = z
        .object({
          state: z.string().optional(),
          page: z.coerce.number().int().min(1).default(1),
          pageSize: z.coerce.number().int().min(1).max(100).default(20),
        })
        .safeParse(request.query)

      if (!query.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', query.error.message, cid))
      }

      const programme = await prisma.programme.findUnique({ where: { id }, select: { id: true } })
      if (!programme) {
        return reply
          .status(404)
          .send(buildError(404, 'Not Found', `Programme ${id} not found`, cid))
      }

      const { state, page, pageSize } = query.data
      const skip = (page - 1) * pageSize

      const where = {
        programmeId: id,
        ...(state && { state }),
      }

      const [enrollments, total] = await Promise.all([
        prisma.programmeEnrollment.findMany({
          where,
          skip,
          take: pageSize,
          include: {
            member: {
              select: {
                id: true,
                memberNumber: true,
                firstName: true,
                lastName: true,
                status: true,
                riskLevel: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.programmeEnrollment.count({ where }),
      ])

      return reply.status(200).send({
        data: enrollments,
        meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
      })
    }
  )
}
