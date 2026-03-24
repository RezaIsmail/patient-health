import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import crypto from 'crypto'
import { Prisma } from '../generated/prisma'
import { prisma } from '../lib/prisma'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function cid(request: FastifyRequest): string {
  return (request.headers['x-correlation-id'] as string) ?? uuidv4()
}

function buildError(statusCode: number, error: string, message: string, correlationId: string) {
  return { statusCode, error, message, correlationId }
}

// ─── Event types ──────────────────────────────────────────────────────────────

export const WEBHOOK_EVENT_TYPES = [
  'contact.created',
  'contact.updated',
  'contact.risk_level_changed',
  'referral.stage_changed',
  'care_plan.activated',
  'care_plan.completed',
  'care_gap.opened',
  'care_gap.closed',
  'campaign.launched',
  'campaign.completed',
  'task.completed',
] as const

export type WebhookEventType = (typeof WEBHOOK_EVENT_TYPES)[number]

// ─── HMAC signing ─────────────────────────────────────────────────────────────

export function signPayload(secret: string, payload: string): string {
  return `sha256=${crypto.createHmac('sha256', secret).update(payload).digest('hex')}`
}

// ─── Dispatch function (called from other routes) ─────────────────────────────

export async function dispatchWebhookEvent(eventType: WebhookEventType, data: Record<string, unknown>) {
  const endpoints = await prisma.webhookEndpoint.findMany({
    where: { isActive: true },
  })

  const event = {
    id: uuidv4(),
    eventType,
    timestamp: new Date().toISOString(),
    data,
  }
  const payload = JSON.stringify(event)

  // Fire-and-forget delivery — record attempts, retry on failure is infrastructure concern
  for (const endpoint of endpoints) {
    const subscribedEvents = endpoint.events as string[]
    if (!subscribedEvents.includes(eventType) && !subscribedEvents.includes('*')) continue

    const delivery = await prisma.webhookDelivery.create({
      data: {
        endpointId: endpoint.id,
        eventType,
        payload: event as Prisma.InputJsonValue,
      },
    })

    // Attempt delivery without blocking
    ;(async () => {
      try {
        const signature = signPayload(endpoint.secret, payload)
        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Signature': signature,
            'X-Event-Type': eventType,
            'X-Delivery-Id': delivery.id,
          },
          body: payload,
          signal: AbortSignal.timeout(10_000),
        })

        await prisma.webhookDelivery.update({
          where: { id: delivery.id },
          data: {
            httpStatus: response.status,
            responseBody: (await response.text()).slice(0, 1000),
            deliveredAt: response.ok ? new Date() : undefined,
            failedAt: response.ok ? undefined : new Date(),
          },
        })
      } catch (err) {
        await prisma.webhookDelivery.update({
          where: { id: delivery.id },
          data: {
            failedAt: new Date(),
            responseBody: err instanceof Error ? err.message : 'Unknown error',
            nextRetryAt: new Date(Date.now() + 5 * 60 * 1000), // retry in 5 minutes
          },
        })
      }
    })().catch(() => {})
  }
}

// ─── Schemas ──────────────────────────────────────────────────────────────────

const createEndpointSchema = z.object({
  name: z.string().min(1).max(200),
  url: z.string().url(),
  events: z.array(z.string()).min(1),
  description: z.string().optional(),
  createdBy: z.string().min(1),
})

const updateEndpointSchema = createEndpointSchema.omit({ createdBy: true }).partial().extend({
  isActive: z.boolean().optional(),
})

// ─── Plugin ───────────────────────────────────────────────────────────────────

export async function webhookRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/webhooks/event-types
   * Available event types for subscription
   */
  fastify.get('/api/webhooks/event-types', async (_request, reply) => {
    return reply.status(200).send({ data: WEBHOOK_EVENT_TYPES })
  })

  /**
   * GET /api/webhooks
   */
  fastify.get('/api/webhooks', async (_request: FastifyRequest, reply: FastifyReply) => {
    const endpoints = await prisma.webhookEndpoint.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { deliveries: true } } },
    })

    // Mask secrets in response
    return reply.status(200).send({
      data: endpoints.map((e) => ({
        ...e,
        secret: `••••${e.secret.slice(-4)}`,
      })),
    })
  })

  /**
   * POST /api/webhooks
   */
  fastify.post('/api/webhooks', async (request: FastifyRequest, reply: FastifyReply) => {
    const correlationId = cid(request)
    const body = createEndpointSchema.safeParse(request.body)
    if (!body.success) {
      return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
    }

    // Auto-generate secret if not provided
    const secret = crypto.randomBytes(32).toString('hex')

    const endpoint = await prisma.webhookEndpoint.create({
      data: {
        ...body.data,
        secret,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        events: body.data.events as any,
      },
    })

    return reply.status(201).send({
      data: { ...endpoint, secret }, // only time the full secret is returned
    })
  })

  /**
   * GET /api/webhooks/:id
   */
  fastify.get(
    '/api/webhooks/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const { id } = request.params

      const endpoint = await prisma.webhookEndpoint.findUnique({
        where: { id },
        include: {
          deliveries: {
            orderBy: { createdAt: 'desc' },
            take: 20,
          },
        },
      })

      if (!endpoint) {
        return reply.status(404).send(buildError(404, 'Not Found', `Webhook ${id} not found`, correlationId))
      }

      return reply.status(200).send({
        data: { ...endpoint, secret: `••••${endpoint.secret.slice(-4)}` },
      })
    }
  )

  /**
   * PATCH /api/webhooks/:id
   */
  fastify.patch(
    '/api/webhooks/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const { id } = request.params

      const body = updateEndpointSchema.safeParse(request.body)
      if (!body.success) {
        return reply.status(400).send(buildError(400, 'Bad Request', body.error.message, correlationId))
      }

      const endpoint = await prisma.webhookEndpoint.findUnique({ where: { id }, select: { id: true } })
      if (!endpoint) {
        return reply.status(404).send(buildError(404, 'Not Found', `Webhook ${id} not found`, correlationId))
      }

      const { events, ...rest } = body.data
      const updated = await prisma.webhookEndpoint.update({
        where: { id },
        data: {
          ...rest,
          ...(events !== undefined && { events: events as never }),
        },
      })

      return reply.status(200).send({
        data: { ...updated, secret: `••••${updated.secret.slice(-4)}` },
      })
    }
  )

  /**
   * DELETE /api/webhooks/:id
   */
  fastify.delete(
    '/api/webhooks/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const { id } = request.params

      const endpoint = await prisma.webhookEndpoint.findUnique({ where: { id }, select: { id: true } })
      if (!endpoint) {
        return reply.status(404).send(buildError(404, 'Not Found', `Webhook ${id} not found`, correlationId))
      }

      await prisma.webhookEndpoint.delete({ where: { id } })
      return reply.status(204).send()
    }
  )

  /**
   * POST /api/webhooks/:id/ping
   * Send a test event to verify the endpoint is reachable
   */
  fastify.post(
    '/api/webhooks/:id/ping',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const correlationId = cid(request)
      const { id } = request.params

      const endpoint = await prisma.webhookEndpoint.findUnique({ where: { id } })
      if (!endpoint) {
        return reply.status(404).send(buildError(404, 'Not Found', `Webhook ${id} not found`, correlationId))
      }

      const testPayload = JSON.stringify({
        id: uuidv4(),
        eventType: 'ping',
        timestamp: new Date().toISOString(),
        data: { message: 'This is a test delivery from Patient Health CRM' },
      })

      try {
        const signature = signPayload(endpoint.secret, testPayload)
        const response = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Signature': signature,
            'X-Event-Type': 'ping',
          },
          body: testPayload,
          signal: AbortSignal.timeout(10_000),
        })

        return reply.status(200).send({
          data: {
            ok: response.ok,
            httpStatus: response.status,
            message: response.ok ? 'Ping delivered successfully' : 'Endpoint returned an error',
          },
        })
      } catch (err) {
        return reply.status(200).send({
          data: {
            ok: false,
            httpStatus: null,
            message: err instanceof Error ? err.message : 'Delivery failed',
          },
        })
      }
    }
  )
}
