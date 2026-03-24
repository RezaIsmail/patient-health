import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Activity,
  Pill,
  AlertTriangle,
  Syringe,
  HeartPulse,
  Link2,
  Link2Off,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react'
import { api } from '../../lib/api'
import { Skeleton } from '@patient-health/ui'
import { format } from 'date-fns'

interface EmrSummaryResult {
  available: boolean
  linked: boolean
  emrPatientId?: string
  reason?: string
  summary?: {
    patient: {
      id: string
      firstName: string
      lastName: string
      dateOfBirth?: string
      mrn?: string
    }
    activeProblems: Array<{ id: string; display: string; status: string; onsetDate?: string }>
    medications: Array<{ id: string; name: string; dose?: string; frequency?: string; status: string }>
    allergies: Array<{ id: string; substance: string; reaction?: string; severity?: string }>
    recentVitals: {
      bloodPressure?: string
      heartRate?: number
      temperature?: number
      weight?: number
      height?: number
      recordedAt?: string
    } | null
    immunisations: Array<{ id: string; vaccineName: string; administeredDate?: string; status: string }>
  }
}

function Section({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          {icon}
          {title}
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        )}
      </button>
      {open && <div className="px-4 pb-4 border-t border-gray-100">{children}</div>}
    </div>
  )
}

export default function EmrSummaryPanel({ contactId }: { contactId: string }) {
  const qc = useQueryClient()
  const [linkId, setLinkId] = useState('')
  const [showLinkForm, setShowLinkForm] = useState(false)

  const { data, isLoading, refetch, isFetching } = useQuery<{ data: EmrSummaryResult }>({
    queryKey: ['emr-summary', contactId],
    queryFn: () => api.get(`/api/contacts/${contactId}/emr-summary`).then((r) => r.data),
    staleTime: 60_000, // 1 minute — EMR data doesn't change instantly
  })

  const linkMutation = useMutation({
    mutationFn: (emrPatientId: string) =>
      api.post(`/api/contacts/${contactId}/emr-link`, { emrPatientId }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['emr-summary', contactId] })
      qc.invalidateQueries({ queryKey: ['contact', contactId] })
      setShowLinkForm(false)
      setLinkId('')
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  const result = data?.data

  // Not linked
  if (!result?.linked) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-10 text-gray-400">
        <Link2Off className="h-10 w-10 mb-3" />
        <p className="text-sm font-medium text-gray-700">No EMR link configured</p>
        <p className="text-xs text-gray-500 mt-1 mb-4 text-center max-w-xs">
          Link this contact to an EMR patient record to view their clinical summary here
        </p>

        {showLinkForm ? (
          <div className="w-full max-w-sm space-y-2 px-4">
            <input
              type="text"
              value={linkId}
              onChange={(e) => setLinkId(e.target.value)}
              placeholder="EMR Patient ID (UUID)"
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {linkMutation.isError && (
              <p className="text-xs text-red-500">
                Could not link — patient may not exist or EMR is unavailable
              </p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => linkMutation.mutate(linkId)}
                disabled={!linkId.trim() || linkMutation.isPending}
                className="flex-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {linkMutation.isPending ? 'Verifying…' : 'Link Patient'}
              </button>
              <button
                onClick={() => setShowLinkForm(false)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLinkForm(true)}
            className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700"
          >
            <Link2 className="h-3.5 w-3.5" />
            Link EMR Record
          </button>
        )}
      </div>
    )
  }

  // Linked but unavailable (EMR service down)
  if (!result.available) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
        <Activity className="h-8 w-8 text-amber-400 mx-auto mb-2" />
        <p className="text-sm font-semibold text-amber-800">EMR unavailable</p>
        <p className="text-xs text-amber-600 mt-1">
          Linked to EMR patient <code className="font-mono">{result.emrPatientId}</code>
        </p>
        <p className="text-xs text-amber-500 mt-1">{result.reason}</p>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-3 flex items-center gap-1.5 mx-auto rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50"
        >
          <RefreshCw className={`h-3 w-3 ${isFetching ? 'animate-spin' : ''}`} />
          Retry
        </button>
      </div>
    )
  }

  const { summary, emrPatientId } = result

  if (!summary) return null

  return (
    <div className="space-y-3">
      {/* EMR header banner */}
      <div className="flex items-center justify-between rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-semibold text-blue-800">
            Live clinical data — {summary.patient.firstName} {summary.patient.lastName}
          </span>
          {summary.patient.mrn && (
            <span className="text-xs text-blue-500 font-mono">MRN: {summary.patient.mrn}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-blue-500 font-mono truncate max-w-[120px]">{emrPatientId}</span>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh clinical data"
            className="rounded p-1 text-blue-400 hover:bg-blue-100 hover:text-blue-700"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Vitals */}
      {summary.recentVitals && (
        <Section title="Recent Vitals" icon={<HeartPulse className="h-4 w-4 text-red-500" />}>
          <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1.5 sm:grid-cols-3">
            {[
              ['Blood Pressure', summary.recentVitals.bloodPressure],
              ['Heart Rate', summary.recentVitals.heartRate ? `${summary.recentVitals.heartRate} bpm` : null],
              ['Temperature', summary.recentVitals.temperature ? `${summary.recentVitals.temperature}°C` : null],
              ['Weight', summary.recentVitals.weight ? `${summary.recentVitals.weight} kg` : null],
              ['Height', summary.recentVitals.height ? `${summary.recentVitals.height} cm` : null],
            ]
              .filter(([, v]) => v)
              .map(([label, value]) => (
                <div key={label as string}>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</p>
                  <p className="text-sm font-semibold text-gray-900">{value}</p>
                </div>
              ))}
          </div>
          {summary.recentVitals.recordedAt && (
            <p className="text-[10px] text-gray-400 mt-3">
              Recorded {format(new Date(summary.recentVitals.recordedAt), 'MMM d, yyyy h:mm a')}
            </p>
          )}
        </Section>
      )}

      {/* Active Problems */}
      <Section
        title={`Active Problems (${summary.activeProblems.length})`}
        icon={<Activity className="h-4 w-4 text-orange-500" />}
      >
        {summary.activeProblems.length === 0 ? (
          <p className="mt-3 text-xs text-gray-400">No active problems on record</p>
        ) : (
          <ul className="mt-3 space-y-1.5">
            {summary.activeProblems.map((prob) => (
              <li key={prob.id} className="flex items-center gap-2 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                <span className="text-gray-800">{prob.display}</span>
                {prob.onsetDate && (
                  <span className="ml-auto text-[10px] text-gray-400 flex-shrink-0">
                    since {format(new Date(prob.onsetDate), 'MMM yyyy')}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Medications */}
      <Section
        title={`Medications (${summary.medications.length})`}
        icon={<Pill className="h-4 w-4 text-purple-500" />}
        defaultOpen={false}
      >
        {summary.medications.length === 0 ? (
          <p className="mt-3 text-xs text-gray-400">No active medications on record</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {summary.medications.map((med) => (
              <li key={med.id} className="flex items-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400 flex-shrink-0 mt-1.5" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{med.name}</p>
                  {(med.dose || med.frequency) && (
                    <p className="text-xs text-gray-500">
                      {[med.dose, med.frequency].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
                <span
                  className={`ml-auto text-[10px] rounded px-1.5 py-0.5 font-medium flex-shrink-0 ${
                    med.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {med.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Allergies */}
      <Section
        title={`Allergies (${summary.allergies.length})`}
        icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
        defaultOpen={false}
      >
        {summary.allergies.length === 0 ? (
          <p className="mt-3 text-xs text-gray-400">No allergies on record (NKDA)</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {summary.allergies.map((allergy) => (
              <li key={allergy.id} className="flex items-start gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full flex-shrink-0 mt-1.5 ${
                    allergy.severity === 'severe' || allergy.severity === 'life-threatening'
                      ? 'bg-red-500'
                      : allergy.severity === 'moderate'
                      ? 'bg-orange-400'
                      : 'bg-yellow-400'
                  }`}
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{allergy.substance}</p>
                  {allergy.reaction && (
                    <p className="text-xs text-gray-500">{allergy.reaction}</p>
                  )}
                </div>
                {allergy.severity && (
                  <span className="ml-auto text-[10px] text-red-600 font-medium capitalize flex-shrink-0">
                    {allergy.severity}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Immunisations */}
      <Section
        title={`Immunisations (${summary.immunisations.length})`}
        icon={<Syringe className="h-4 w-4 text-blue-500" />}
        defaultOpen={false}
      >
        {summary.immunisations.length === 0 ? (
          <p className="mt-3 text-xs text-gray-400">No immunisation records</p>
        ) : (
          <ul className="mt-3 space-y-1.5">
            {summary.immunisations.map((imm) => (
              <li key={imm.id} className="flex items-center gap-2 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                <span className="text-gray-800">{imm.vaccineName}</span>
                {imm.administeredDate && (
                  <span className="ml-auto text-[10px] text-gray-400 flex-shrink-0">
                    {format(new Date(imm.administeredDate), 'MMM yyyy')}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <p className="text-[10px] text-gray-400 text-center">
        Read-only view — clinical data sourced from EMR. To make changes, open the patient record in the EMR.
      </p>
    </div>
  )
}
