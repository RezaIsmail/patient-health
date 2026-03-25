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

export function broadcastToAdminClients(eventType: string, data: unknown, eventId?: string): void {
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

export async function adminEventRoutes(fastify: FastifyInstance) {
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

    reply.raw.write(formatSseEvent('connected', { clientId, userId, service: 'admin' }))

    clients.set(clientId, { id: clientId, userId, raw: reply.raw })

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
