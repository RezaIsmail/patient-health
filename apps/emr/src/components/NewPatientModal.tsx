import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { Button } from '@patient-health/ui'
import { api } from '../lib/api'
import type { CreatePatientDto, PatientSummary } from '@patient-health/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step1Fields {
  firstName: string
  lastName: string
  preferredName: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other' | 'unknown' | ''
  phone: string
  email: string
}

interface Step2Fields {
  payerName: string
  memberId: string
  groupId: string
  subscriberName: string
}

type Step1Errors = Partial<Record<keyof Step1Fields, string>>
type Step2Errors = Partial<Record<keyof Step2Fields, string>>

interface NewPatientModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (patient: PatientSummary) => void
}

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastState {
  visible: boolean
  message: string
}

// ─── Field component ──────────────────────────────────────────────────────────

interface FieldProps {
  id: string
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

function Field({ id, label, error, required = false, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-gray-200 bg-white h-10 px-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'

const selectClass =
  'w-full rounded-lg border border-gray-200 bg-white h-10 px-3 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'

// ─── Validation ───────────────────────────────────────────────────────────────

function validateStep1(fields: Step1Fields): Step1Errors {
  const errors: Step1Errors = {}

  if (!fields.firstName.trim()) errors.firstName = 'First name is required.'
  if (!fields.lastName.trim()) errors.lastName = 'Last name is required.'
  if (!fields.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required.'
  } else {
    const dob = new Date(fields.dateOfBirth)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (isNaN(dob.getTime())) {
      errors.dateOfBirth = 'Enter a valid date.'
    } else if (dob >= today) {
      errors.dateOfBirth = 'Date of birth must be in the past.'
    }
  }
  if (!fields.gender) errors.gender = 'Gender is required.'
  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Enter a valid email address.'
  }

  return errors
}

function validateStep2(fields: Step2Fields, skipped: boolean): Step2Errors {
  if (skipped) return {}
  const errors: Step2Errors = {}
  if (fields.payerName && !fields.memberId.trim()) {
    errors.memberId = 'Member ID is required when a payer is entered.'
  }
  if (fields.memberId && !fields.payerName.trim()) {
    errors.payerName = 'Payer name is required when a member ID is entered.'
  }
  return errors
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export default function NewPatientModal({ open, onClose, onSuccess }: NewPatientModalProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const panelRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLButtonElement>(null)

  const [step, setStep] = useState<1 | 2>(1)
  const [insuranceSkipped, setInsuranceSkipped] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [step1, setStep1] = useState<Step1Fields>({
    firstName: '',
    lastName: '',
    preferredName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
  })
  const [step1Errors, setStep1Errors] = useState<Step1Errors>({})

  const [step2, setStep2] = useState<Step2Fields>({
    payerName: '',
    memberId: '',
    groupId: '',
    subscriberName: '',
  })
  const [step2Errors, setStep2Errors] = useState<Step2Errors>({})

  // ── Focus trap and keyboard handling ───────────────────────────────────────

  useEffect(() => {
    if (!open) return

    const panel = panelRef.current
    if (!panel) return

    // Focus the close button when the panel opens
    firstFocusableRef.current?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key !== 'Tab') return

      const focusable = panel!.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  // ── Reset state when closed ────────────────────────────────────────────────

  useEffect(() => {
    if (!open) {
      setStep(1)
      setInsuranceSkipped(false)
      setSubmitError(null)
      setStep1({ firstName: '', lastName: '', preferredName: '', dateOfBirth: '', gender: '', phone: '', email: '' })
      setStep1Errors({})
      setStep2({ payerName: '', memberId: '', groupId: '', subscriberName: '' })
      setStep2Errors({})
    }
  }, [open])

  // ── Prevent body scroll when open ─────────────────────────────────────────

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // ── Mutation ───────────────────────────────────────────────────────────────

  const mutation = useMutation({
    mutationFn: async (dto: CreatePatientDto) => {
      const response = await api.post<{ data: PatientSummary }>('/api/patients', dto)
      return response.data.data
    },
    onSuccess: (patient) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      onSuccess(patient)
      onClose()
      navigate(`/patients/${patient.id}`)
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error
          ? err.message
          : 'Registration failed. Please try again.'
      setSubmitError(message)
    },
  })

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleStep1Next() {
    const errors = validateStep1(step1)
    if (Object.keys(errors).length > 0) {
      setStep1Errors(errors)
      return
    }
    setStep1Errors({})
    setStep(2)
  }

  function handleSubmit() {
    if (insuranceSkipped) {
      submitPatient()
      return
    }

    const errors = validateStep2(step2, false)
    if (Object.keys(errors).length > 0) {
      setStep2Errors(errors)
      return
    }
    setStep2Errors({})
    submitPatient()
  }

  function submitPatient() {
    setSubmitError(null)

    const hasInsurance =
      !insuranceSkipped &&
      (step2.payerName.trim() !== '' || step2.memberId.trim() !== '')

    const dto: CreatePatientDto = {
      firstName: step1.firstName.trim(),
      lastName: step1.lastName.trim(),
      preferredName: step1.preferredName.trim() || undefined,
      dateOfBirth: step1.dateOfBirth,
      gender: step1.gender as 'male' | 'female' | 'other' | 'unknown',
      phone: step1.phone.trim() || undefined,
      email: step1.email.trim() || undefined,
      insurance: hasInsurance
        ? {
            payerName: step2.payerName.trim(),
            memberId: step2.memberId.trim(),
            groupId: step2.groupId.trim() || undefined,
            subscriberName: step2.subscriberName.trim() || undefined,
          }
        : undefined,
    }

    mutation.mutate(dto)
  }

  function handleSkipInsurance() {
    setInsuranceSkipped(true)
    setStep2Errors({})
    submitPatient()
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="New Patient Registration"
        className="fixed inset-y-0 right-0 z-50 flex w-[480px] flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">New Patient</h2>
          <button
            ref={firstFocusableRef}
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex flex-shrink-0 gap-2 border-b border-gray-100 px-6 py-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              step === 1
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            Step 1 of 2 — Personal Details
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              step === 2
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            Step 2 of 2 — Insurance
          </span>
        </div>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 1 ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Field id="firstName" label="First Name" error={step1Errors.firstName} required>
                  <input
                    id="firstName"
                    type="text"
                    value={step1.firstName}
                    onChange={(e) => setStep1((s) => ({ ...s, firstName: e.target.value }))}
                    className={inputClass}
                    placeholder="Jane"
                    autoComplete="given-name"
                    aria-describedby={step1Errors.firstName ? 'firstName-error' : undefined}
                    aria-invalid={!!step1Errors.firstName}
                  />
                </Field>

                <Field id="lastName" label="Last Name" error={step1Errors.lastName} required>
                  <input
                    id="lastName"
                    type="text"
                    value={step1.lastName}
                    onChange={(e) => setStep1((s) => ({ ...s, lastName: e.target.value }))}
                    className={inputClass}
                    placeholder="Smith"
                    autoComplete="family-name"
                    aria-describedby={step1Errors.lastName ? 'lastName-error' : undefined}
                    aria-invalid={!!step1Errors.lastName}
                  />
                </Field>
              </div>

              <Field id="preferredName" label="Preferred Name">
                <input
                  id="preferredName"
                  type="text"
                  value={step1.preferredName}
                  onChange={(e) => setStep1((s) => ({ ...s, preferredName: e.target.value }))}
                  className={inputClass}
                  placeholder="Optional — nickname or goes-by name"
                />
              </Field>

              <Field id="dateOfBirth" label="Date of Birth" error={step1Errors.dateOfBirth} required>
                <input
                  id="dateOfBirth"
                  type="date"
                  value={step1.dateOfBirth}
                  onChange={(e) => setStep1((s) => ({ ...s, dateOfBirth: e.target.value }))}
                  className={inputClass}
                  max={new Date().toISOString().split('T')[0]}
                  aria-describedby={step1Errors.dateOfBirth ? 'dateOfBirth-error' : undefined}
                  aria-invalid={!!step1Errors.dateOfBirth}
                />
              </Field>

              <Field id="gender" label="Gender" error={step1Errors.gender} required>
                <select
                  id="gender"
                  value={step1.gender}
                  onChange={(e) =>
                    setStep1((s) => ({
                      ...s,
                      gender: e.target.value as Step1Fields['gender'],
                    }))
                  }
                  className={selectClass}
                  aria-describedby={step1Errors.gender ? 'gender-error' : undefined}
                  aria-invalid={!!step1Errors.gender}
                >
                  <option value="">Select gender…</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="unknown">Unknown</option>
                </select>
              </Field>

              <Field id="phone" label="Phone">
                <input
                  id="phone"
                  type="tel"
                  value={step1.phone}
                  onChange={(e) => setStep1((s) => ({ ...s, phone: e.target.value }))}
                  className={inputClass}
                  placeholder="(555) 000-0000"
                  autoComplete="tel"
                />
              </Field>

              <Field id="email" label="Email" error={step1Errors.email}>
                <input
                  id="email"
                  type="email"
                  value={step1.email}
                  onChange={(e) => setStep1((s) => ({ ...s, email: e.target.value }))}
                  className={inputClass}
                  placeholder="jane.smith@example.com"
                  autoComplete="email"
                  aria-describedby={step1Errors.email ? 'email-error' : undefined}
                  aria-invalid={!!step1Errors.email}
                />
              </Field>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-500">
                Insurance information can be added now or updated later from the patient chart.
              </p>

              <Field id="payerName" label="Payer Name" error={step2Errors.payerName}>
                <input
                  id="payerName"
                  type="text"
                  value={step2.payerName}
                  onChange={(e) => setStep2((s) => ({ ...s, payerName: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Blue Cross Blue Shield"
                  aria-describedby={step2Errors.payerName ? 'payerName-error' : undefined}
                  aria-invalid={!!step2Errors.payerName}
                />
              </Field>

              <Field id="memberId" label="Member ID" error={step2Errors.memberId}>
                <input
                  id="memberId"
                  type="text"
                  value={step2.memberId}
                  onChange={(e) => setStep2((s) => ({ ...s, memberId: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. XYZ123456789"
                  aria-describedby={step2Errors.memberId ? 'memberId-error' : undefined}
                  aria-invalid={!!step2Errors.memberId}
                />
              </Field>

              <Field id="groupId" label="Group ID">
                <input
                  id="groupId"
                  type="text"
                  value={step2.groupId}
                  onChange={(e) => setStep2((s) => ({ ...s, groupId: e.target.value }))}
                  className={inputClass}
                  placeholder="Optional"
                />
              </Field>

              <Field id="subscriberName" label="Subscriber Name">
                <input
                  id="subscriberName"
                  type="text"
                  value={step2.subscriberName}
                  onChange={(e) => setStep2((s) => ({ ...s, subscriberName: e.target.value }))}
                  className={inputClass}
                  placeholder="Optional — if different from patient"
                />
              </Field>

              {submitError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {submitError}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-200 px-6 py-4">
          {step === 1 ? (
            <>
              <button
                onClick={onClose}
                className="text-sm text-gray-500 transition-colors hover:text-gray-700"
              >
                Cancel
              </button>
              <Button variant="default" size="default" onClick={handleStep1Next}>
                Next →
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => {
                    setStep(1)
                    setStep2Errors({})
                    setSubmitError(null)
                  }}
                >
                  ← Back
                </Button>
                <button
                  onClick={handleSkipInsurance}
                  disabled={mutation.isPending}
                  className="text-sm text-blue-600 transition-colors hover:text-blue-800 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Skip insurance
                </button>
              </div>
              <Button
                variant="default"
                size="default"
                onClick={handleSubmit}
                isLoading={mutation.isPending}
                disabled={mutation.isPending}
              >
                Register Patient
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
