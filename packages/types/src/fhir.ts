// HL7 FHIR R4 TypeScript types
// Reference: https://hl7.org/fhir/R4/

// ─── Base types ──────────────────────────────────────────────────────────────

export interface FHIRResource {
  resourceType: string
  id?: string
  meta?: {
    versionId?: string
    lastUpdated?: string
    profile?: string[]
  }
}

export interface CodeableConcept {
  coding?: Array<{
    system?: string
    code?: string
    display?: string
  }>
  text?: string
}

export interface HumanName {
  use?: 'usual' | 'official' | 'temp' | 'nickname' | 'anonymous' | 'old' | 'maiden'
  family?: string
  given?: string[]
  prefix?: string[]
  suffix?: string[]
  text?: string
}

export interface ContactPoint {
  system?: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other'
  value?: string
  use?: 'home' | 'work' | 'temp' | 'old' | 'mobile'
}

export interface Address {
  use?: 'home' | 'work' | 'temp' | 'old' | 'billing'
  line?: string[]
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface Reference {
  reference?: string
  display?: string
}

export interface Quantity {
  value?: number
  unit?: string
  system?: string
  code?: string
}

export interface Period {
  start?: string
  end?: string
}

// ─── FHIR Patient ─────────────────────────────────────────────────────────────

export interface FHIRPatient extends FHIRResource {
  resourceType: 'Patient'
  identifier?: Array<{ system?: string; value?: string }>
  active?: boolean
  name?: HumanName[]
  telecom?: ContactPoint[]
  gender?: 'male' | 'female' | 'other' | 'unknown'
  birthDate?: string
  address?: Address[]
  photo?: Array<{ contentType?: string; data?: string; url?: string }>
  contact?: Array<{
    relationship?: CodeableConcept[]
    name?: HumanName
    telecom?: ContactPoint[]
  }>
  communication?: Array<{
    language: CodeableConcept
    preferred?: boolean
  }>
  generalPractitioner?: Reference[]
}

// ─── FHIR Condition (problem list) ────────────────────────────────────────────

export interface FHIRCondition extends FHIRResource {
  resourceType: 'Condition'
  clinicalStatus?: CodeableConcept
  verificationStatus?: CodeableConcept
  category?: CodeableConcept[]
  severity?: CodeableConcept
  code?: CodeableConcept
  subject: Reference
  encounter?: Reference
  onsetDateTime?: string
  abatementDateTime?: string
  recordedDate?: string
  recorder?: Reference
  note?: Array<{ text: string }>
}

// ─── FHIR Observation (vitals, results) ───────────────────────────────────────

export interface FHIRObservation extends FHIRResource {
  resourceType: 'Observation'
  status:
    | 'registered'
    | 'preliminary'
    | 'final'
    | 'amended'
    | 'corrected'
    | 'cancelled'
    | 'entered-in-error'
    | 'unknown'
  category?: CodeableConcept[]
  code: CodeableConcept
  subject?: Reference
  encounter?: Reference
  effectiveDateTime?: string
  issued?: string
  valueQuantity?: Quantity
  valueCodeableConcept?: CodeableConcept
  valueString?: string
  interpretation?: CodeableConcept[]
  referenceRange?: Array<{
    low?: Quantity
    high?: Quantity
    text?: string
  }>
  component?: Array<{
    code: CodeableConcept
    valueQuantity?: Quantity
    valueString?: string
  }>
}

// ─── FHIR MedicationRequest (prescriptions) ───────────────────────────────────

export interface FHIRMedicationRequest extends FHIRResource {
  resourceType: 'MedicationRequest'
  status:
    | 'active'
    | 'on-hold'
    | 'cancelled'
    | 'completed'
    | 'entered-in-error'
    | 'stopped'
    | 'draft'
    | 'unknown'
  intent:
    | 'proposal'
    | 'plan'
    | 'order'
    | 'original-order'
    | 'reflex-order'
    | 'filler-order'
    | 'instance-order'
    | 'option'
  medicationCodeableConcept?: CodeableConcept
  subject: Reference
  encounter?: Reference
  authoredOn?: string
  requester?: Reference
  dosageInstruction?: Array<{
    text?: string
    timing?: { repeat?: { frequency?: number; period?: number; periodUnit?: string } }
    doseAndRate?: Array<{ doseQuantity?: Quantity }>
  }>
  dispenseRequest?: {
    numberOfRepeatsAllowed?: number
    quantity?: Quantity
  }
}

// ─── FHIR AllergyIntolerance ──────────────────────────────────────────────────

export interface FHIRAllergyIntolerance extends FHIRResource {
  resourceType: 'AllergyIntolerance'
  clinicalStatus?: CodeableConcept
  verificationStatus?: CodeableConcept
  type?: 'allergy' | 'intolerance'
  category?: Array<'food' | 'medication' | 'environment' | 'biologic'>
  criticality?: 'low' | 'high' | 'unable-to-assess'
  code?: CodeableConcept
  patient: Reference
  onsetDateTime?: string
  recordedDate?: string
  recorder?: Reference
  reaction?: Array<{
    substance?: CodeableConcept
    manifestation: CodeableConcept[]
    severity?: 'mild' | 'moderate' | 'severe'
    description?: string
  }>
}

// ─── FHIR Immunization ────────────────────────────────────────────────────────

export interface FHIRImmunization extends FHIRResource {
  resourceType: 'Immunization'
  status: 'completed' | 'entered-in-error' | 'not-done'
  vaccineCode: CodeableConcept
  patient: Reference
  occurrenceDateTime?: string
  recorded?: string
  primarySource?: boolean
  lotNumber?: string
  site?: CodeableConcept
  route?: CodeableConcept
  doseQuantity?: Quantity
  performer?: Array<{ function?: CodeableConcept; actor: Reference }>
  note?: Array<{ text: string }>
  protocolApplied?: Array<{
    series?: string
    doseNumberPositiveInt?: number
  }>
}

// ─── FHIR Encounter ───────────────────────────────────────────────────────────

export interface FHIREncounter extends FHIRResource {
  resourceType: 'Encounter'
  status:
    | 'planned'
    | 'arrived'
    | 'triaged'
    | 'in-progress'
    | 'onleave'
    | 'finished'
    | 'cancelled'
    | 'entered-in-error'
    | 'unknown'
  class: { system?: string; code?: string; display?: string }
  type?: CodeableConcept[]
  subject?: Reference
  participant?: Array<{
    type?: CodeableConcept[]
    individual?: Reference
  }>
  period?: Period
  reasonCode?: CodeableConcept[]
  diagnosis?: Array<{
    condition: Reference
    use?: CodeableConcept
    rank?: number
  }>
  serviceProvider?: Reference
}

// ─── FHIR Appointment ─────────────────────────────────────────────────────────

export interface FHIRAppointment extends FHIRResource {
  resourceType: 'Appointment'
  status:
    | 'proposed'
    | 'pending'
    | 'booked'
    | 'arrived'
    | 'fulfilled'
    | 'cancelled'
    | 'noshow'
    | 'entered-in-error'
    | 'checked-in'
    | 'waitlist'
  serviceType?: CodeableConcept[]
  reasonCode?: CodeableConcept[]
  priority?: number
  description?: string
  start?: string
  end?: string
  minutesDuration?: number
  comment?: string
  participant: Array<{
    type?: CodeableConcept[]
    actor?: Reference
    required?: 'required' | 'optional' | 'information-only'
    status: 'accepted' | 'declined' | 'tentative' | 'needs-action'
  }>
}
