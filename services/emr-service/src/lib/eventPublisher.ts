import { v4 as uuidv4 } from 'uuid'
import { CHANNELS } from '@patient-health/events'
import type { PatientCreatedPayload, PatientUpdatedPayload, ClinicalSyncedPayload } from '@patient-health/events'
import { redisPub } from './redis'
import { broadcastToEmrClients } from '../routes/events'

// ── Internal helpers ──────────────────────────────────────────────────────────

function buildEnvelope(
  type: string,
  payload: unknown,
  correlationId: string
): object {
  return {
    id: uuidv4(),
    type,
    occurredAt: new Date().toISOString(),
    correlationId,
    sourceService: 'emr-service',
    payload,
  }
}

/** Publish to Redis channel AND broadcast directly to connected EMR SSE clients.
 *  Fire-and-forget — never throws. */
function publish(channel: string, type: string, payload: unknown, correlationId: string): void {
  const envelope = buildEnvelope(type, payload, correlationId)
  const json = JSON.stringify(envelope)

  // Direct SSE push to EMR frontend clients (avoids a Redis round-trip for intra-service events)
  broadcastToEmrClients(type, envelope)

  // Redis publish for other services (CRM, Admin) to consume
  redisPub.publish(channel, json).catch((err: Error) => {
    console.error(`[eventPublisher] publish failed for ${channel}: ${err.message}`)
  })
}

// ── Public API ────────────────────────────────────────────────────────────────

export function publishPatientCreated(payload: PatientCreatedPayload, correlationId: string): void {
  publish(CHANNELS.EMR_PATIENT_CREATED, 'emr:patient:created', payload, correlationId)
}

export function publishPatientUpdated(payload: PatientUpdatedPayload, correlationId: string): void {
  publish(CHANNELS.EMR_PATIENT_UPDATED, 'emr:patient:updated', payload, correlationId)
}

export function publishClinicalSynced(payload: ClinicalSyncedPayload, correlationId: string): void {
  publish(CHANNELS.EMR_CLINICAL_SYNCED, 'emr:clinical:synced', payload, correlationId)
}
