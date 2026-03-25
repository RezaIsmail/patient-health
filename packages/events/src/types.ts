// ── Event envelope ────────────────────────────────────────────────────────────

/** Every domain event carries these fields regardless of type. */
export interface EventEnvelope {
  /** UUID identifying this specific event instance */
  id: string
  /** ISO 8601 timestamp of when the event occurred */
  occurredAt: string
  /** Correlation ID from the originating HTTP request */
  correlationId: string
  /** Which service published this event */
  sourceService: 'emr-service' | 'crm-service' | 'admin-service'
}

// ── Payload types ─────────────────────────────────────────────────────────────

export interface PatientCreatedPayload {
  patientId: string
  mrn: string
  firstName: string
  lastName: string
}

export interface PatientUpdatedPayload {
  patientId: string
  mrn: string
  changes: Record<string, unknown>
}

export interface ClinicalSyncedPayload {
  patientId: string
  triggerType: string
  riskLevel: 'low' | 'medium' | 'high'
  activeConditionCount: number
}

export interface ContactRiskChangedPayload {
  contactId: string
  emrPatientId: string | null
  riskLevel: string
  previousRiskLevel: string | null
}

export interface CareGapOpenedPayload {
  careGapId: string
  contactId: string
  title: string
}

export interface MemberCreatedPayload {
  memberId: string
  memberNumber: string
  firstName: string
  lastName: string
}

// ── Discriminated union ───────────────────────────────────────────────────────

/** A typed domain event — use the `type` field to narrow the payload. */
export type DomainEvent =
  | (EventEnvelope & { type: 'emr:patient:created'; payload: PatientCreatedPayload })
  | (EventEnvelope & { type: 'emr:patient:updated'; payload: PatientUpdatedPayload })
  | (EventEnvelope & { type: 'emr:clinical:synced'; payload: ClinicalSyncedPayload })
  | (EventEnvelope & { type: 'crm:contact:risk_changed'; payload: ContactRiskChangedPayload })
  | (EventEnvelope & { type: 'crm:care_gap:opened'; payload: CareGapOpenedPayload })
  | (EventEnvelope & { type: 'admin:member:created'; payload: MemberCreatedPayload })

/** The shape of events sent over SSE to frontend clients.
 *  Alias for DomainEvent so the switch/case statement in hooks narrows the payload type correctly. */
export type SseEvent = DomainEvent
