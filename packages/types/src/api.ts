// API request/response types shared across frontend and backend

// ─── Standard wrappers ────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  meta?: {
    page?: number
    pageSize?: number
    total?: number
  }
}

export interface ApiError {
  statusCode: number
  error: string
  message: string
  correlationId: string
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number
  pageSize?: number
}

// ─── Patient API types ────────────────────────────────────────────────────────

export interface CreatePatientDto {
  firstName: string
  lastName: string
  preferredName?: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other' | 'unknown'
  genderIdentity?: string
  phone?: string
  email?: string
  address?: {
    line1?: string
    line2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  insurance?: {
    payerName: string
    memberId: string
    groupId?: string
    subscriberName?: string
  }
}

export interface UpdatePatientDto {
  firstName?: string
  lastName?: string
  preferredName?: string
  phone?: string
  email?: string
  address?: {
    line1?: string
    line2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
}

export interface PatientSummary {
  id: string
  mrn: string
  firstName: string
  lastName: string
  preferredName?: string
  dateOfBirth: string
  age: number
  gender: string
  phone?: string
  email?: string
  primaryInsurance?: string
}

// ─── Chart (longitudinal record) types ────────────────────────────────────────

export interface PatientChartDto {
  patient: PatientSummary
  activeProblems: Array<{
    id: string
    code?: string
    display: string
    onsetDate?: string
    severity?: string
  }>
  medications: Array<{
    id: string
    name: string
    dose?: string
    frequency?: string
    status: string
    prescribedDate?: string
  }>
  allergies: Array<{
    id: string
    substance: string
    reaction?: string
    criticality?: string
  }>
  recentVitals?: {
    recordedAt: string
    bloodPressureSystolic?: number
    bloodPressureDiastolic?: number
    heartRate?: number
    temperature?: number
    weight?: number
    height?: number
    bmi?: number
    oxygenSaturation?: number
  }
  recentResults: Array<{
    id: string
    name: string
    value: string
    unit?: string
    referenceRange?: string
    isAbnormal: boolean
    resultDate: string
  }>
  recentNotes: Array<{
    id: string
    type: string
    authorName: string
    date: string
    summary: string
  }>
  recentEncounters: EncounterSummary[]
  upcomingAppointments: Array<{
    id: string
    date: string
    type: string
    providerName: string
    status: string
  }>
  immunisations: Array<{
    id: string
    vaccine: string
    dateGiven: string
    lotNumber?: string
  }>
  outstandingActions: {
    unsignedOrders: number
    pendingReferrals: number
    unreviewedResults: number
    careGaps: number
  }
}

// ─── Encounter / SOAP note types ──────────────────────────────────────────────

export interface EncounterSummary {
  id: string
  status: string
  encounterClass: string
  type?: string
  reasonDisplay?: string
  startTime?: string
  providerName?: string
  chiefComplaint?: string
  signedAt?: string
  signedByName?: string
}

export interface EncounterDetailDto extends EncounterSummary {
  endTime?: string
  subjective?: string
  objective?: string
  assessment?: string
  plan?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateEncounterDto {
  type?: string
  reasonDisplay?: string
  reasonCode?: string
  encounterClass?: 'AMB' | 'IMP' | 'VR'
  startTime?: string
  providerId: string
  providerName?: string
  chiefComplaint?: string
  subjective?: string
  objective?: string
  assessment?: string
  plan?: string
}

export interface UpdateEncounterDto {
  status?: string
  type?: string
  chiefComplaint?: string
  subjective?: string
  objective?: string
  assessment?: string
  plan?: string
  notes?: string
  endTime?: string
}

export interface InboxItemDto {
  id: string
  itemType: 'unsigned_encounter' | 'abnormal_result'
  patientId: string
  patientName: string
  mrn: string
  summary: string
  createdAt: string
  severity?: 'normal' | 'abnormal' | 'critical'
}

// ─── Auth API types ───────────────────────────────────────────────────────────

export interface LoginDto {
  email: string
  password: string
}

export interface AuthTokensDto {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface UserDto {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  permissions: string[]
}

export type UserRole = 'physician' | 'app' | 'nurse' | 'front_desk' | 'billing' | 'admin' | 'patient'

// ─── Search params ────────────────────────────────────────────────────────────

export interface PatientSearchParams extends PaginationParams {
  q?: string // name, MRN, or DOB
}

// ─── CRM API types ────────────────────────────────────────────────────────────

export type ContactStatus = 'lead' | 'prospect' | 'active' | 'inactive' | 'deceased'
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
export type ReferralStage = 'received' | 'reviewing' | 'authorized' | 'scheduled' | 'completed' | 'declined' | 'cancelled'
export type ReferralPriority = 'routine' | 'urgent' | 'emergent'
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
export type CareGapStatus = 'open' | 'in_progress' | 'closed' | 'declined'
export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled'

export interface CreateContactDto {
  firstName: string
  lastName: string
  preferredName?: string
  dateOfBirth?: string
  sex?: 'male' | 'female' | 'unknown' | 'other'
  phone?: string
  email?: string
  status?: ContactStatus
  source?: 'referral' | 'self-referral' | 'web' | 'partner' | 'import'
  riskLevel?: RiskLevel
  sdohFlags?: string[]
  assignedTo?: string
  accountId?: string
  emrPatientId?: string
  addressLine1?: string
  city?: string
  state?: string
  postalCode?: string
  notes?: string
}

export interface CreateReferralDto {
  contactId: string
  type: 'inbound' | 'outbound'
  priority: ReferralPriority
  reasonDisplay: string
  reasonCode?: string
  referringOrgName?: string
  receivingOrgName?: string
  dueDate?: string
  assignedTo?: string
}

export interface CreateTaskDto {
  title: string
  type: 'call' | 'email' | 'follow_up' | 'assessment' | 'authorization' | 'scheduling' | 'care_plan_review' | 'other'
  priority?: 'low' | 'normal' | 'high' | 'critical'
  contactId?: string
  referralId?: string
  carePlanId?: string
  assignedTo: string
  dueDate?: string
}

export interface CrmDashboardDto {
  referrals: {
    pipeline: Array<{ stage: string; count: number }>
    openTotal: number
  }
  tasks: {
    overdueCount: number
    myOpenCount: number
  }
  contacts: {
    totalActive: number
    byRisk: Array<{ riskLevel: string; count: number }>
  }
  careGaps: {
    totalOpen: number
    byType: Array<{ gapType: string; count: number }>
  }
  carePlans: {
    activeCount: number
  }
  campaigns: Array<{
    id: string
    name: string
    type: string
    status: string
    sentCount: number
    deliveryRate: number
    openRate: number
    responseRate: number
  }>
  myActivity: {
    tasksCompletedThisWeek: number
    contactsTouchedThisWeek: number
  }
}
