import type { ServerResponse } from 'node:http'

// ── Types ─────────────────────────────────────────────────────────────────────

interface SseClient {
  id: string
  userId: string
  raw: ServerResponse
}

// ── In-process registry ───────────────────────────────────────────────────────

const clients = new Map<string, SseClient>()

export function registerClient(id: string, userId: string, raw: ServerResponse): void {
  clients.set(id, { id, userId, raw })
}

export function unregisterClient(id: string): void {
  clients.delete(id)
}

/** Broadcast a pre-formatted SSE string to every connected CRM client */
export function broadcast(message: string): void {
  if (clients.size === 0) return
  for (const client of clients.values()) {
    try {
      client.raw.write(message)
    } catch {
      clients.delete(client.id)
    }
  }
}

export function getClientCount(): number {
  return clients.size
}

// ── SSE formatting helpers ─────────────────────────────────────────────────────

export function formatSseEvent(eventType: string, data: unknown, eventId?: string): string {
  const lines: string[] = []
  if (eventId) lines.push(`id: ${eventId}`)
  lines.push(`event: ${eventType}`)
  lines.push(`data: ${JSON.stringify(data)}`)
  lines.push('')
  return lines.join('\n') + '\n'
}

export function formatHeartbeat(): string {
  return ': ping\n\n'
}
