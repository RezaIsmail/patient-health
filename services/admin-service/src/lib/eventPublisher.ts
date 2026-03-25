import { v4 as uuidv4 } from 'uuid'
import { CHANNELS } from '@patient-health/events'
import type { MemberCreatedPayload } from '@patient-health/events'
import { redisPub } from './redis'
import { broadcastToAdminClients } from '../routes/events'

// ── Internal helpers ──────────────────────────────────────────────────────────

function buildEnvelope(type: string, payload: unknown, correlationId: string): object {
  return {
    id: uuidv4(),
    type,
    occurredAt: new Date().toISOString(),
    correlationId,
    sourceService: 'admin-service',
    payload,
  }
}

/** Publish to Redis channel AND broadcast directly to connected Admin SSE clients.
 *  Fire-and-forget — never throws. */
function publish(channel: string, type: string, payload: unknown, correlationId: string): void {
  const envelope = buildEnvelope(type, payload, correlationId)

  // Direct SSE push to Admin frontend clients (avoids a Redis round-trip for intra-service events)
  broadcastToAdminClients(type, envelope)

  // Redis publish for other services (CRM) to consume
  redisPub.publish(channel, JSON.stringify(envelope)).catch((err: Error) => {
    console.error(`[eventPublisher:admin] publish failed for ${channel}: ${err.message}`)
  })
}

// ── Public API ────────────────────────────────────────────────────────────────

export function publishMemberCreated(payload: MemberCreatedPayload, correlationId: string): void {
  publish(CHANNELS.ADMIN_MEMBER_CREATED, 'admin:member:created', payload, correlationId)
}
