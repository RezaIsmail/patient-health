import { v4 as uuidv4 } from 'uuid'
import { CHANNELS } from '@patient-health/events'
import type { ContactRiskChangedPayload, CareGapOpenedPayload } from '@patient-health/events'
import { redisPub } from './redis'
import { broadcast, formatSseEvent } from './sseRegistry'

// ── Internal helpers ──────────────────────────────────────────────────────────

function buildEnvelope(type: string, payload: unknown, correlationId: string): object {
  return {
    id: uuidv4(),
    type,
    occurredAt: new Date().toISOString(),
    correlationId,
    sourceService: 'crm-service',
    payload,
  }
}

/** Publish to Redis channel AND broadcast directly to connected CRM SSE clients.
 *  Fire-and-forget — never throws. */
function publish(channel: string, type: string, payload: unknown, correlationId: string): void {
  const envelope = buildEnvelope(type, payload, correlationId)

  // Direct SSE push to CRM frontend clients (avoids a Redis round-trip for intra-service events)
  broadcast(formatSseEvent(type, envelope))

  // Redis publish for other services (Admin) to consume
  redisPub.publish(channel, JSON.stringify(envelope)).catch((err: Error) => {
    console.error(`[eventPublisher:crm] publish failed for ${channel}: ${err.message}`)
  })
}

// ── Public API ────────────────────────────────────────────────────────────────

export function publishContactRiskChanged(
  payload: ContactRiskChangedPayload,
  correlationId: string,
): void {
  publish(CHANNELS.CRM_CONTACT_RISK_CHANGED, 'crm:contact:risk_changed', payload, correlationId)
}

export function publishCareGapOpened(payload: CareGapOpenedPayload, correlationId: string): void {
  publish(CHANNELS.CRM_CARE_GAP_OPENED, 'crm:care_gap:opened', payload, correlationId)
}
