import type { FastifyInstance, FastifyRequest } from 'fastify'
import { v4 as uuidv4 } from 'uuid'
import {
  registerClient,
  unregisterClient,
  formatSseEvent,
  formatHeartbeat,
} from '../lib/sseRegistry'

/**
 * GET /api/events/stream
 * Server-Sent Events endpoint for the CRM frontend.
 *
 * Also receives forwarded EMR events via Redis pub/sub (see eventSubscriber.ts),
 * enabling the CRM UI to react to changes made in the EMR without a page refresh.
 *
 * Protected by the existing JWT preHandler — no additional auth needed.
 */
export async function crmEventRoutes(fastify: FastifyInstance) {
  fastify.get('/api/events/stream', async (request: FastifyRequest, reply) => {
    const clientId = uuidv4()
    const userId = (request as FastifyRequest & { userId: string }).userId ?? 'unknown'

    reply.raw.setHeader('Content-Type', 'text/event-stream')
    reply.raw.setHeader('Cache-Control', 'no-cache, no-transform')
    reply.raw.setHeader('Connection', 'keep-alive')
    reply.raw.setHeader('X-Accel-Buffering', 'no')
    reply.raw.statusCode = 200
    reply.hijack()
    reply.raw.flushHeaders()

    // Initial handshake event
    reply.raw.write(formatSseEvent('connected', { clientId, userId, service: 'crm' }))

    registerClient(clientId, userId, reply.raw)

    // 30s heartbeat to prevent proxy timeouts
    const heartbeat = setInterval(() => {
      try {
        reply.raw.write(formatHeartbeat())
      } catch {
        clearInterval(heartbeat)
        unregisterClient(clientId)
      }
    }, 30_000)

    const cleanup = () => {
      clearInterval(heartbeat)
      unregisterClient(clientId)
    }

    request.raw.on('close', cleanup)
    request.raw.on('error', cleanup)
  })
}
