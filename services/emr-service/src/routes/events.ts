import type { FastifyInstance, FastifyRequest } from 'fastify'
import { v4 as uuidv4 } from 'uuid'

// ── In-process SSE client registry ───────────────────────────────────────────

interface SseClient {
  id: string
  userId: string
  raw: import('node:http').ServerResponse
}

const clients = new Map<string, SseClient>()

function formatSseEvent(eventType: string, data: unknown, eventId?: string): string {
  const lines: string[] = []
  if (eventId) lines.push(`id: ${eventId}`)
  lines.push(`event: ${eventType}`)
  lines.push(`data: ${JSON.stringify(data)}`)
  lines.push('')
  return lines.join('\n') + '\n'
}

/** Broadcast an event to all connected EMR frontend SSE clients */
export function broadcastToEmrClients(eventType: string, data: unknown, eventId?: string): void {
  if (clients.size === 0) return
  const msg = formatSseEvent(eventType, data, eventId)
  for (const client of clients.values()) {
    try {
      client.raw.write(msg)
    } catch {
      clients.delete(client.id)
    }
  }
}

// ── SSE Route ─────────────────────────────────────────────────────────────────

export async function emrEventRoutes(fastify: FastifyInstance) {
  /**
   * GET /api/events/stream
   * Server-Sent Events endpoint for the EMR frontend.
   * Protected by the existing JWT preHandler — no additional auth needed.
   */
  fastify.get('/api/events/stream', async (request: FastifyRequest, reply) => {
    const clientId = uuidv4()
    const userId = (request as FastifyRequest & { userId: string }).userId ?? 'unknown'

    // Set SSE response headers and take control of the raw response
    reply.raw.setHeader('Content-Type', 'text/event-stream')
    reply.raw.setHeader('Cache-Control', 'no-cache, no-transform')
    reply.raw.setHeader('Connection', 'keep-alive')
    reply.raw.setHeader('X-Accel-Buffering', 'no') // disable Nginx buffering
    reply.raw.statusCode = 200
    reply.hijack()
    reply.raw.flushHeaders()

    // Send initial connected event so the client knows the stream is live
    reply.raw.write(formatSseEvent('connected', { clientId, userId, service: 'emr' }))

    clients.set(clientId, { id: clientId, userId, raw: reply.raw })

    // 30s heartbeat — keeps connection alive through proxies and load balancers
    const heartbeat = setInterval(() => {
      try {
        reply.raw.write(': ping\n\n')
      } catch {
        clearInterval(heartbeat)
        clients.delete(clientId)
      }
    }, 30_000)

    const cleanup = () => {
      clearInterval(heartbeat)
      clients.delete(clientId)
    }

    request.raw.on('close', cleanup)
    request.raw.on('error', cleanup)
  })
}
