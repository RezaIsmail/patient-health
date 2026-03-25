/** All Redis pub/sub channels used across Patient Health services.
 *  Convention: ph:<source-service>:<entity>:<action>
 */
export const CHANNELS = {
  EMR_PATIENT_CREATED: 'ph:emr:patient:created',
  EMR_PATIENT_UPDATED: 'ph:emr:patient:updated',
  EMR_CLINICAL_SYNCED: 'ph:emr:clinical:synced',
  CRM_CONTACT_RISK_CHANGED: 'ph:crm:contact:risk_changed',
  CRM_CARE_GAP_OPENED: 'ph:crm:care_gap:opened',
  ADMIN_MEMBER_CREATED: 'ph:admin:member:created',
} as const

export type Channel = (typeof CHANNELS)[keyof typeof CHANNELS]
