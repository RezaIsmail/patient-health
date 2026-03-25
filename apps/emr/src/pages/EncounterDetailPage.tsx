import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft,
  Save,
  PenLine,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
} from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'
import { trackEvent } from '@patient-health/analytics'
import { format } from 'date-fns'
import type { EncounterDetailDto, PatientSummary } from '@patient-health/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusBadge(status: string, signedAt?: string) {
  if (signedAt) return { label: 'Signed', cls: 'bg-green-100 text-green-700', icon: <CheckCircle className="h-3.5 w-3.5" /> }
  if (status === 'in-progress') return { label: 'In Progress', cls: 'bg-blue-100 text-blue-700', icon: <Clock className="h-3.5 w-3.5" /> }
  if (status === 'cancelled') return { label: 'Cancelled', cls: 'bg-gray-100 text-gray-500', icon: <AlertTriangle className="h-3.5 w-3.5" /> }
  return { label: status, cls: 'bg-gray-100 text-gray-500', icon: null }
}

// ─── SOAP section textarea ─────────────────────────────────────────────────

function SoapSection({
  label,
  placeholder,
  value,
  onChange,
  disabled,
  minRows = 4,
}: {
  label: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  disabled: boolean
  minRows?: number
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={minRows}
        className={`w-full resize-y rounded-md border px-3 py-2 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled
            ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-600'
            : 'border-gray-200 bg-white text-gray-900 focus:border-blue-400'
        }`}
      />
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function EncounterDetailPage() {
  const { patientId, encounterId } = useParams<{ patientId: string; encounterId: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [form, setForm] = useState({
    chiefComplaint: '',
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    notes: '',
  })
  const [isDirty, setIsDirty] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load encounter
  const { data: encounter, isLoading } = useQuery({
    queryKey: ['encounter', patientId, encounterId],
    queryFn: () =>
      api.get<{ data: EncounterDetailDto }>(`/api/patients/${patientId}/encounters/${encounterId}`)
        .then((r) => r.data.data),
  })

  // Load patient header
  const { data: patient } = useQuery({
    queryKey: ['patient', patientId],
    queryFn: () =>
      api.get<{ data: { patient: PatientSummary } }>(`/api/patients/${patientId}/chart`)
        .then((r) => r.data.data.patient),
  })

  // Seed form from loaded encounter
  useEffect(() => {
    if (encounter) {
      setForm({
        chiefComplaint: encounter.chiefComplaint ?? '',
        subjective: encounter.subjective ?? '',
        objective: encounter.objective ?? '',
        assessment: encounter.assessment ?? '',
        plan: encounter.plan ?? '',
        notes: encounter.notes ?? '',
      })
    }
  }, [encounter])

  const saveMutation = useMutation({
    mutationFn: (data: typeof form) =>
      api.put(`/api/patients/${patientId}/encounters/${encounterId}`, data),
    onSuccess: () => {
      setIsDirty(false)
      setLastSaved(new Date())
      qc.invalidateQueries({ queryKey: ['encounter', patientId, encounterId] })
    },
  })

  const signMutation = useMutation({
    mutationFn: () =>
      api.post(`/api/patients/${patientId}/encounters/${encounterId}/sign`, {
        providerName: patient ? `${patient.firstName} ${patient.lastName}` : undefined,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['encounter', patientId, encounterId] })
      qc.invalidateQueries({ queryKey: ['patientChart', patientId] })
      trackEvent({ event: 'emr_encounter_signed', patient_id: patientId ?? '', encounter_id: encounterId ?? '' })
    },
  })

  // Auto-save when form changes (debounced 3s)
  const handleFieldChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setIsDirty(true)
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => {
      saveMutation.mutate({ ...form, [field]: value })
    }, 3000)
  }

  const isSigned = !!encounter?.signedAt
  const badge = encounter ? statusBadge(encounter.status, encounter.signedAt) : null

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/patients/${patientId}`)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to chart
          </button>
          <span className="text-gray-200">|</span>
          <div className="flex items-center gap-2">
            <PenLine className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-900">
              {encounter?.type ?? 'Office Visit'} Note
            </span>
            {badge && (
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.cls}`}>
                {badge.icon}
                {badge.label}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastSaved && !isDirty && (
            <span className="text-xs text-gray-400">
              Saved {format(lastSaved, 'h:mm a')}
            </span>
          )}
          {isDirty && (
            <span className="text-xs text-amber-500">Unsaved changes</span>
          )}
          {!isSigned && (
            <>
              <button
                onClick={() => saveMutation.mutate(form)}
                disabled={!isDirty || saveMutation.isPending}
                className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                <Save className="h-3.5 w-3.5" />
                {saveMutation.isPending ? 'Saving…' : 'Save'}
              </button>
              <button
                onClick={() => {
                  if (confirm('Sign and finalise this note? It cannot be edited after signing.')) {
                    signMutation.mutate()
                  }
                }}
                disabled={signMutation.isPending}
                className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                {signMutation.isPending ? 'Signing…' : 'Sign Note'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Patient context strip */}
      {patient && (
        <div className="flex items-center gap-4 border-b border-blue-100 bg-blue-50 px-6 py-2 text-xs text-blue-800">
          <User className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="font-semibold">{patient.firstName} {patient.lastName}</span>
          <span>MRN: {patient.mrn}</span>
          <span>DOB: {patient.dateOfBirth}</span>
          <span>Age: {patient.age}</span>
          {patient.primaryInsurance && <span>Ins: {patient.primaryInsurance}</span>}
          {encounter?.startTime && (
            <>
              <Calendar className="ml-2 h-3.5 w-3.5 flex-shrink-0" />
              <span>{format(new Date(encounter.startTime), 'MMMM d, yyyy · h:mm a')}</span>
            </>
          )}
        </div>
      )}

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="mx-auto max-w-3xl space-y-6">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-5">
            {/* Chief Complaint */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Chief Complaint
                </label>
                <input
                  value={form.chiefComplaint}
                  onChange={(e) => handleFieldChange('chiefComplaint', e.target.value)}
                  disabled={isSigned}
                  placeholder="Patient's reason for visit in their own words…"
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isSigned
                      ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-600'
                      : 'border-gray-200 bg-white focus:border-blue-400'
                  }`}
                />
              </div>
            </div>

            {/* SOAP sections */}
            <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">SOAP Note</h3>
              <div className="space-y-5">
                <SoapSection
                  label="S — Subjective"
                  placeholder="History of present illness (HPI), review of systems (ROS), pertinent history…"
                  value={form.subjective}
                  onChange={(v) => handleFieldChange('subjective', v)}
                  disabled={isSigned}
                  minRows={5}
                />
                <SoapSection
                  label="O — Objective"
                  placeholder="Physical examination findings, vital signs, relevant test results reviewed…"
                  value={form.objective}
                  onChange={(v) => handleFieldChange('objective', v)}
                  disabled={isSigned}
                  minRows={5}
                />
                <SoapSection
                  label="A — Assessment"
                  placeholder="Diagnoses with ICD-10 codes, clinical impression, differential diagnosis…"
                  value={form.assessment}
                  onChange={(v) => handleFieldChange('assessment', v)}
                  disabled={isSigned}
                  minRows={4}
                />
                <SoapSection
                  label="P — Plan"
                  placeholder="Treatment plan, medications prescribed, orders placed, referrals, follow-up instructions…"
                  value={form.plan}
                  onChange={(v) => handleFieldChange('plan', v)}
                  disabled={isSigned}
                  minRows={5}
                />
              </div>
            </div>

            {/* Addendum notes — always editable even after signing */}
            {isSigned && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-amber-700">
                  Addendum
                </label>
                <p className="mb-2 text-xs text-amber-600">
                  This note is signed. Use the addendum to add clarifications or corrections.
                </p>
                <textarea
                  value={form.notes}
                  onChange={(e) => {
                    handleFieldChange('notes', e.target.value)
                  }}
                  placeholder="Addendum notes…"
                  rows={3}
                  className="w-full resize-y rounded-md border border-amber-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => saveMutation.mutate(form)}
                    disabled={!isDirty || saveMutation.isPending}
                    className="rounded-md bg-amber-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-40"
                  >
                    {saveMutation.isPending ? 'Saving…' : 'Save Addendum'}
                  </button>
                </div>
              </div>
            )}

            {/* Signature block — shown when signed */}
            {encounter?.signedAt && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-5 py-3 text-xs text-green-800">
                <CheckCircle className="mb-1 inline h-3.5 w-3.5 text-green-600" />
                {' '}Electronically signed by{' '}
                <span className="font-semibold">{encounter.signedByName ?? encounter.providerName ?? 'Provider'}</span>
                {' '}on{' '}
                <span className="font-semibold">{format(new Date(encounter.signedAt), 'MMMM d, yyyy \'at\' h:mm a')}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
