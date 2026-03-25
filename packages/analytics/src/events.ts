/**
 * Typed event taxonomy for Patient Health analytics.
 * Convention: [product]_[entity]_[action]
 *
 * IMPORTANT: No PII in event names or parameters.
 * Use internal IDs (UUIDs) only — never names, emails, or dates of birth.
 */

// ── EMR events ─────────────────────────────────────────────────────────────────

export interface EmrPatientListViewedEvent {
  event: 'emr_patient_list_viewed'
}

export interface EmrPatientRegisteredEvent {
  event: 'emr_patient_registered'
}

export interface EmrPatientRecordViewedEvent {
  event: 'emr_patient_record_viewed'
  patient_id: string
}

export interface EmrEncounterCreatedEvent {
  event: 'emr_encounter_created'
  patient_id: string
}

export interface EmrEncounterSignedEvent {
  event: 'emr_encounter_signed'
  patient_id: string
  encounter_id: string
}

export interface EmrClinicalRecordCreatedEvent {
  event: 'emr_clinical_record_created'
  patient_id: string
  record_type: 'condition' | 'medication' | 'allergy' | 'observation'
}

export interface EmrInboxViewedEvent {
  event: 'emr_inbox_viewed'
}

// ── CRM events ─────────────────────────────────────────────────────────────────

export interface CrmContactListViewedEvent {
  event: 'crm_contact_list_viewed'
}

export interface CrmContactRecordViewedEvent {
  event: 'crm_contact_record_viewed'
  contact_id: string
}

export interface CrmContactCreatedEvent {
  event: 'crm_contact_created'
  source: string
}

export interface CrmCareGapOpenedEvent {
  event: 'crm_care_gap_opened'
  contact_id: string
  gap_type: string
}

export interface CrmCareGapClosedEvent {
  event: 'crm_care_gap_closed'
  contact_id: string
  gap_type: string
}

export interface CrmCampaignCreatedEvent {
  event: 'crm_campaign_created'
}

export interface CrmDashboardViewedEvent {
  event: 'crm_dashboard_viewed'
}

// ── Admin events ───────────────────────────────────────────────────────────────

export interface AdminMemberCreatedEvent {
  event: 'admin_member_created'
}

export interface AdminMemberListViewedEvent {
  event: 'admin_member_list_viewed'
}

export interface AdminMemberRecordViewedEvent {
  event: 'admin_member_record_viewed'
  member_id: string
}

export interface AdminProgrammeEnrolledEvent {
  event: 'admin_programme_enrolled'
  programme_id: string
}

export interface AdminDashboardViewedEvent {
  event: 'admin_dashboard_viewed'
}

export interface AdminAnalyticsViewedEvent {
  event: 'admin_analytics_viewed'
  tab: string
}

// ── Union ──────────────────────────────────────────────────────────────────────

export type AnalyticsEvent =
  | EmrPatientListViewedEvent
  | EmrPatientRegisteredEvent
  | EmrPatientRecordViewedEvent
  | EmrEncounterCreatedEvent
  | EmrEncounterSignedEvent
  | EmrClinicalRecordCreatedEvent
  | EmrInboxViewedEvent
  | CrmContactListViewedEvent
  | CrmContactRecordViewedEvent
  | CrmContactCreatedEvent
  | CrmCareGapOpenedEvent
  | CrmCareGapClosedEvent
  | CrmCampaignCreatedEvent
  | CrmDashboardViewedEvent
  | AdminMemberCreatedEvent
  | AdminMemberListViewedEvent
  | AdminMemberRecordViewedEvent
  | AdminProgrammeEnrolledEvent
  | AdminDashboardViewedEvent
  | AdminAnalyticsViewedEvent
