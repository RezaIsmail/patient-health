import { CHANNELS } from '@patient-health/events'
import type { DomainEvent } from '@patient-health/events'
import { redisSub } from './redis'
import { broadcast, formatSseEvent } from './sseRegistry'

// ── Event handler ─────────────────────────────────────────────────────────────

function handleIncomingEvent(event: DomainEvent): void {
  // Forward the full event envelope as an SSE message to all connected CRM frontend clients.
  // The frontend's useServerEvents hook casts the data as DomainEvent and narrows on event.type.
  broadcast(formatSseEvent(event.type, event, event.id))
}

// ── Subscriber bootstrap ──────────────────────────────────────────────────────

/**
 * Subscribe to all relevant cross-service Redis channels.
 * Must be called once at service startup after Redis connects.
 */
export async function initEventSubscriber(): Promise<void> {
  const channels = [
    CHANNELS.EMR_PATIENT_CREATED,
    CHANNELS.EMR_PATIENT_UPDATED,
    CHANNELS.EMR_CLINICAL_SYNCED,
    CHANNELS.ADMIN_MEMBER_CREATED,
  ]

  await redisSub.subscribe(...channels)

  redisSub.on('message', (_channel: string, message: string) => {
    try {
      const event = JSON.parse(message) as DomainEvent
      handleIncomingEvent(event)
    } catch {
      // Malformed Redis message — skip silently
    }
  })

  console.info(`[eventSubscriber:crm] subscribed to ${channels.length} channels`)
}
