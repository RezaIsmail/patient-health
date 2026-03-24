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

const targetSegmentSchema = z.object({
  status: z.array(z.string()).optional(),
  riskLevel: z.array(z.string()).optional(),
  gapType: z.string().optional(),
  accountId: z.string().optional(),
  assignedTo: z.string().optional(),
  sdohFlags: z.array(z.string()).optional(),
}).optional()

const createCampaignSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  type: z.enum(['email', 'sms', 'phone', 'multi_channel']).default('email'),
  targetSegment: targetSegmentSchema,
  subject: z.string().max(500).optional(),
  content: z.string().max(50000).optional(),
  scheduledAt: z.string().datetime().optional(),
})

const updateCampaignSchema = createCampaignSchema.partial()

export async function campaignRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/campaigns
   */
  fastify.get('/api/campaigns', async (request: FastifyRequest, reply: FastifyReply) => {
    const q = request.query as Record<string, string>
    const status = q.status
    const type = q.type
    const page = parseInt(q.page ?? '1', 10)
    const pageSize = Math.min(parseInt(q.pageSize ?? '20', 10), 100)
    const skip = (page - 1) * pageSize

    const where = {
      ...(status && { status }),
      ...(type && { type }),
    }

    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { members: true } },
        },
      }),
      prisma.campaign.count({ where }),
    ])

    return reply.status(200).send({
      data: campaigns,
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    })
  })

  /**
   * POST /api/campaigns
   */
  fastify.post('/api/campaigns', async (request: FastifyRequest, reply: FastifyReply) => {
    const correlationId = cid(request)
    const userId = getUserId(request)
    const body = createCampaignSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
    }

    const { scheduledAt, ...rest } = body.data
    const campaign = await prisma.campaign.create({
      data: {
        ...rest,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        targetSegment: (rest.targetSegment ?? undefined) as any,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
        createdBy: userId,
      },
    })

    return reply.status(201).send({ data: campaign })
  })

  /**
   * GET /api/campaigns/:id
   */
  fastify.get(
    '/api/campaigns/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const { id } = request.params

      const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: {
          members: {
            take: 100,
            include: { contact: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } },
          },
          _count: { select: { members: true } },
        },
      })

      if (!campaign) {
        return reply.status(404).send(buildError(404, 'Not Found', `Campaign ${id} not found`, correlationId))
      }

      return reply.status(200).send({ data: campaign })
    }
  )

  /**
   * PATCH /api/campaigns/:id
   */
  fastify.patch(
    '/api/campaigns/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const { id } = request.params

      const body = updateCampaignSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
      }

      const existing = await prisma.campaign.findUnique({ where: { id }, select: { id: true, status: true } })
      if (!existing) {
        return reply.status(404).send(buildError(404, 'Not Found', `Campaign ${id} not found`, correlationId))
      }

      if (existing.status === 'completed' || existing.status === 'cancelled') {
        return reply.status(409).send(buildError(409, 'Conflict', 'Cannot modify a completed or cancelled campaign', correlationId))
      }

      const { scheduledAt, ...rest } = body.data
      const campaign = await prisma.campaign.update({
        where: { id },
        data: {
          ...rest,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(rest.targetSegment !== undefined && { targetSegment: rest.targetSegment as any }),
          ...(scheduledAt !== undefined && { scheduledAt: new Date(scheduledAt) }),
        },
      })

      return reply.status(200).send({ data: campaign })
    }
  )

  /**
   * POST /api/campaigns/:id/launch
   * Resolves the target segment, creates CampaignMember records, and marks campaign as active.
   */
  fastify.post(
    '/api/campaigns/:id/launch',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const { id } = request.params

      const campaign = await prisma.campaign.findUnique({
        where: { id },
        select: { id: true, status: true, targetSegment: true, type: true },
      })

      if (!campaign) {
        return reply.status(404).send(buildError(404, 'Not Found', `Campaign ${id} not found`, correlationId))
      }

      if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
        return reply.status(409).send(buildError(409, 'Conflict', 'Only draft or scheduled campaigns can be launched', correlationId))
      }

      // Resolve target segment — build a contact where clause from criteria
      const segment = campaign.targetSegment as {
        status?: string[]
        riskLevel?: string[]
        gapType?: string
        accountId?: string
        assignedTo?: string
      } | null

      const contactWhere: Record<string, unknown> = {}
      if (segment?.status?.length) contactWhere.status = { in: segment.status }
      if (segment?.riskLevel?.length) contactWhere.riskLevel = { in: segment.riskLevel }
      if (segment?.accountId) contactWhere.accountId = segment.accountId
      if (segment?.assignedTo) contactWhere.assignedTo = segment.assignedTo

      const contacts = await prisma.contact.findMany({
        where: contactWhere,
        select: { id: true },
      })

      if (contacts.length === 0) {
        return reply.status(422).send(buildError(422, 'Unprocessable Entity', 'No contacts match the target segment', correlationId))
      }

      // Create campaign members (skip existing)
      await prisma.campaignMember.createMany({
        data: contacts.map((c) => ({
          campaignId: id,
          contactId: c.id,
          status: 'pending',
        })),
        skipDuplicates: true,
      })

      const launchedCampaign = await prisma.campaign.update({
        where: { id },
        data: {
          status: 'active',
          launchedAt: new Date(),
          sentCount: contacts.length,
        },
      })

      return reply.status(200).send({ data: launchedCampaign, meta: { contactsEnrolled: contacts.length } })
    }
  )
}
