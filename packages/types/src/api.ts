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
