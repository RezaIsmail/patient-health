import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  AlertCircle,
  Pill,
  FlaskConical,
  FileText,
  Calendar,
  Syringe,
  Activity,
  Thermometer,
  Heart,
  Wind,
  Weight,
  Ruler,
  Plus,
  Pencil,
  Trash2,
  PenLine,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, Skeleton, Badge, cn } from '@patient-health/ui'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { usePatientChart } from '../hooks/usePatientChart'
import PatientHeader from '../components/PatientHeader'
import ImmunisationModal from '../components/clinical/ImmunisationModal'
import LabResultModal from '../components/clinical/LabResultModal'
import AllergyModal from '../components/clinical/AllergyModal'
import MedicationModal from '../components/clinical/MedicationModal'
import DeleteConfirmModal from '../components/clinical/DeleteConfirmModal'
import { api } from '../lib/api'
import { format } from 'date-fns'
import type { PatientChartDto } from '@patient-health/types'

// ─── Chart entity types ───────────────────────────────────────────────────────

type ChartImmunisation = PatientChartDto['immunisations'][number]
type ChartLabResult = PatientChartDto['recentResults'][number]
type ChartAllergy = PatientChartDto['allergies'][number]
type ChartMedication = PatientChartDto['medications'][number]

// ─── Modal state discriminated union ─────────────────────────────────────────

type ModalState =
  | { type: 'none' }
  | { type: 'immunisation-add' }
  | { type: 'immunisation-edit'; item: ChartImmunisation }
  | { type: 'immunisation-delete'; item: ChartImmunisation }
  | { type: 'lab-add' }
  | { type: 'lab-edit'; item: ChartLabResult }
  | { type: 'lab-delete'; item: ChartLabResult }
  | { type: 'allergy-add' }
  | { type: 'allergy-edit'; item: ChartAllergy }
  | { type: 'allergy-delete'; item: ChartAllergy }
  | { type: 'medication-add' }
  | { type: 'medication-edit'; item: ChartMedication }
  | { type: 'medication-delete'; item: ChartMedication }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return format(new Date(iso), 'MMM d, yyyy')
  } catch {
    return iso
  }
}

function formatDateTime(iso: string): string {
  try {
    return format(new Date(iso), 'MMM d, yyyy · h:mm a')
  } catch {
    return iso
  }
}

// ─── Section header with count badge and Add button ──────────────────────────

function SectionHeader({
  icon,
  title,
  count,
  onAdd,
  addLabel,
}: {
  icon: React.ReactNode
  title: string
  count?: number
  onAdd?: () => void
  addLabel?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-500" aria-hidden="true">
        {icon}
      </span>
      <span className="text-sm font-semibold text-gray-800">{title}</span>
      {count !== undefined && count > 0 && (
        <Badge variant="secondary" className="text-[11px] font-semibold px-1.5 py-0">
          {count}
        </Badge>
      )}
      {onAdd && (
        <button
          onClick={onAdd}
          aria-label={addLabel ?? `Add ${title}`}
          className="ml-auto flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}

// ─── "None recorded" empty state ──────────────────────────────────────────────

function NoneRecorded({ label }: { label: string }) {
  return (
    <p className="py-2 text-xs text-gray-400 italic" aria-live="polite">
      No {label} recorded
    </p>
  )
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent className="space-y-2 pt-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className={`h-3.5 ${i % 2 === 0 ? 'w-full' : 'w-3/4'}`} />
        ))}
      </CardContent>
    </Card>
  )
}

// ─── Criticality colour ───────────────────────────────────────────────────────

function criticalityVariant(
  criticality?: string
): 'destructive' | 'warning' | 'secondary' {
  if (criticality === 'high') return 'destructive'
  if (criticality === 'low') return 'warning'
  return 'secondary'
}

// ─── Outstanding actions bar ──────────────────────────────────────────────────

function OutstandingActionsBar({
  actions,
}: {
  actions: PatientChartDto['outstandingActions']
}) {
  const items = [
    { label: 'Unsigned orders', count: actions.unsignedOrders, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { label: 'Pending referrals', count: actions.pendingReferrals, color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { label: 'Unreviewed results', count: actions.unreviewedResults, color: 'text-red-700 bg-red-50 border-red-200' },
    { label: 'Care gaps', count: actions.careGaps, color: 'text-purple-700 bg-purple-50 border-purple-200' },
  ].filter((i) => i.count > 0)

  if (items.length === 0) return null

  return (
    <div
      className="flex flex-wrap gap-2 border-b border-gray-200 bg-amber-50/50 px-6 py-2"
      role="status"
      aria-label="Outstanding clinical actions"
    >
      {items.map((item) => (
        <span
          key={item.label}
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${item.color}`}
        >
          <span className="font-bold">{item.count}</span>
          {item.label}
        </span>
      ))}
    </div>
  )
}

// ─── Vitals grid ─────────────────────────────────────────────────────────────

function VitalsGrid({ vitals }: { vitals: NonNullable<PatientChartDto['recentVitals']> }) {
  const items = [
    {
      label: 'Blood Pressure',
      icon: <Activity className="h-3.5 w-3.5" />,
      value:
        vitals.bloodPressureSystolic && vitals.bloodPressureDiastolic
          ? `${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}`
          : null,
      unit: 'mmHg',
      abnormal:
        (vitals.bloodPressureSystolic ?? 0) >= 140 || (vitals.bloodPressureDiastolic ?? 0) >= 90,
    },
    {
      label: 'Heart Rate',
      icon: <Heart className="h-3.5 w-3.5" />,
      value: vitals.heartRate != null ? String(vitals.heartRate) : null,
      unit: 'bpm',
      abnormal: (vitals.heartRate ?? 0) > 100 || (vitals.heartRate ?? 999) < 60,
    },
    {
      label: 'Temperature',
      icon: <Thermometer className="h-3.5 w-3.5" />,
      value: vitals.temperature != null ? String(vitals.temperature) : null,
      unit: '°F',
      abnormal: (vitals.temperature ?? 0) > 99.5 || (vitals.temperature ?? 999) < 96,
    },
    {
      label: 'SpO₂',
      icon: <Wind className="h-3.5 w-3.5" />,
      value: vitals.oxygenSaturation != null ? `${vitals.oxygenSaturation}` : null,
      unit: '%',
      abnormal: (vitals.oxygenSaturation ?? 100) < 95,
    },
    {
      label: 'Weight',
      icon: <Weight className="h-3.5 w-3.5" />,
      value: vitals.weight != null ? String(vitals.weight) : null,
      unit: 'kg',
      abnormal: false,
    },
    {
      label: 'BMI',
      icon: <Ruler className="h-3.5 w-3.5" />,
      value: vitals.bmi != null ? String(vitals.bmi) : null,
      unit: '',
      abnormal: (vitals.bmi ?? 22) > 29.9 || (vitals.bmi ?? 22) < 18.5,
    },
  ].filter((i) => i.value !== null)

  if (items.length === 0) return <NoneRecorded label="vitals" />

  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            'rounded-lg border p-2.5',
            item.abnormal
              ? 'border-red-200 bg-red-50'
              : 'border-gray-100 bg-gray-50'
          )}
        >
          <div className={cn('flex items-center gap-1 mb-1', item.abnormal ? 'text-red-500' : 'text-gray-400')}>
            {item.icon}
            <span className="text-[10px] font-medium uppercase tracking-wide">{item.label}</span>
          </div>
          <p
            className={cn(
              'text-base font-bold leading-none',
              item.abnormal ? 'text-red-700' : 'text-gray-900'
            )}
            aria-label={`${item.label}: ${item.value} ${item.unit}${item.abnormal ? ' — abnormal' : ''}`}
          >
            {item.value}
            {item.unit && (
              <span className="ml-0.5 text-[11px] font-normal text-gray-500">{item.unit}</span>
            )}
          </p>
        </div>
      ))}
    </div>
  )
}

// ─── Row action buttons ───────────────────────────────────────────────────────

function RowActions({
  onEdit,
  onDelete,
  editLabel,
  deleteLabel,
}: {
  onEdit: () => void
  onDelete: () => void
  editLabel: string
  deleteLabel: string
}) {
  return (
    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
      <button
        onClick={onEdit}
        aria-label={editLabel}
        className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Pencil className="h-3 w-3" />
      </button>
      <button
        onClick={onDelete}
        aria-label={deleteLabel}
        className="flex h-6 w-6 items-center justify-center rounded text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  )
}

// ─── Full chart page ──────────────────────────────────────────────────────────

export default function PatientChartPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: chart, isLoading, isError } = usePatientChart(id ?? '')

  const [modal, setModal] = useState<ModalState>({ type: 'none' })

  // ── Delete mutations ───────────────────────────────────────────────────────

  const deleteImmunisation = useMutation({
    mutationFn: async (immunisationId: string) => {
      await api.delete(`/api/patients/${id}/immunisations/${immunisationId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-chart', id] })
      setModal({ type: 'none' })
    },
  })

  const deleteLabResult = useMutation({
    mutationFn: async (observationId: string) => {
      await api.delete(`/api/patients/${id}/observations/${observationId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-chart', id] })
      setModal({ type: 'none' })
    },
  })

  const deleteAllergy = useMutation({
    mutationFn: async (allergyId: string) => {
      await api.delete(`/api/patients/${id}/allergies/${allergyId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-chart', id] })
      setModal({ type: 'none' })
    },
  })

  const stopMedication = useMutation({
    mutationFn: async (medicationId: string) => {
      await api.delete(`/api/patients/${id}/medications/${medicationId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-chart', id] })
      setModal({ type: 'none' })
    },
  })

  const createEncounter = useMutation({
    mutationFn: async () => {
      const res = await api.post<{ data: { id: string } }>(`/api/patients/${id}/encounters`, {
        type: 'Office Visit',
        encounterClass: 'AMB',
        providerId: 'current-user',
        startTime: new Date().toISOString(),
      })
      return res.data.data
    },
    onSuccess: (enc) => {
      navigate(`/patients/${id}/encounters/${enc.id}`)
    },
  })

  function handleSaved() {
    queryClient.invalidateQueries({ queryKey: ['patient-chart', id] })
  }

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b border-gray-200 bg-white px-6 py-3">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </div>
        <div className="flex flex-1 gap-4 overflow-auto p-6">
          <div className="w-56 flex-shrink-0 space-y-4">
            <CardSkeleton lines={4} />
            <CardSkeleton lines={3} />
          </div>
          <div className="flex-1 space-y-4 min-w-0">
            <CardSkeleton lines={3} />
            <CardSkeleton lines={5} />
            <CardSkeleton lines={4} />
          </div>
          <div className="w-52 flex-shrink-0 space-y-4">
            <CardSkeleton lines={4} />
            <CardSkeleton lines={3} />
            <CardSkeleton lines={3} />
          </div>
        </div>
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError || !chart) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <p className="text-sm font-medium text-gray-900">Failed to load patient chart</p>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          Unable to retrieve this patient's record. Please refresh the page or navigate back to the
          patient list.
        </p>
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to patients
        </button>
      </div>
    )
  }

  // ── Full chart ─────────────────────────────────────────────────────────────
  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ── Sticky patient context header ────────────────────────────────── */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-2 bg-white border-b border-gray-100 px-6 py-1.5">
            <button
              onClick={() => navigate('/patients')}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors"
              aria-label="Back to patient list"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Patients
            </button>
            <span className="text-gray-300 text-xs">/</span>
            <span className="text-xs text-gray-600 font-medium">
              {chart.patient.firstName} {chart.patient.lastName}
            </span>
          </div>

          <PatientHeader patient={chart.patient} allergyCount={chart.allergies.length} />
          <OutstandingActionsBar actions={chart.outstandingActions} />
        </div>

        {/* ── Chart body: 3-column grid ──────────────────────────────────── */}
        <div className="flex flex-1 gap-4 overflow-auto p-5">

          {/* ── Left sidebar: Problems + Allergies ─────────────────────── */}
          <aside className="flex w-56 flex-shrink-0 flex-col gap-4" aria-label="Problem list and allergies">

            {/* Active Problems */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <SectionHeader
                    icon={<AlertCircle className="h-3.5 w-3.5" />}
                    title="Active Problems"
                    count={chart.activeProblems.length}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chart.activeProblems.length === 0 ? (
                  <NoneRecorded label="active problems" />
                ) : (
                  <ul className="space-y-2" role="list" aria-label="Active problems">
                    {chart.activeProblems.map((problem) => (
                      <li key={problem.id} className="text-xs">
                        <p className="font-medium text-gray-800 leading-snug">{problem.display}</p>
                        <div className="flex flex-wrap items-center gap-1 mt-0.5">
                          {problem.code && (
                            <span className="text-gray-400 font-mono text-[10px]">{problem.code}</span>
                          )}
                          {problem.severity && (
                            <Badge
                              variant={
                                problem.severity === 'severe'
                                  ? 'destructive'
                                  : problem.severity === 'moderate'
                                  ? 'warning'
                                  : 'secondary'
                              }
                              className="text-[10px] px-1 py-0"
                            >
                              {problem.severity}
                            </Badge>
                          )}
                          {problem.onsetDate && (
                            <span className="text-gray-400 text-[10px]">
                              since {formatDate(problem.onsetDate)}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Allergies */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <SectionHeader
                    icon={<AlertCircle className="h-3.5 w-3.5 text-red-500" />}
                    title="Allergies"
                    count={chart.allergies.length}
                    onAdd={() => setModal({ type: 'allergy-add' })}
                    addLabel="Add allergy"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chart.allergies.length === 0 ? (
                  <p className="py-2 text-xs text-green-600 font-medium">No known allergies</p>
                ) : (
                  <ul className="space-y-2" role="list" aria-label="Allergies">
                    {chart.allergies.map((allergy) => (
                      <li key={allergy.id} className="group text-xs">
                        <div className="flex items-start justify-between gap-1">
                          <p className="font-medium text-gray-800 leading-snug">{allergy.substance}</p>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {allergy.criticality && (
                              <Badge
                                variant={criticalityVariant(allergy.criticality)}
                                className="text-[10px] px-1 py-0"
                              >
                                {allergy.criticality}
                              </Badge>
                            )}
                            <RowActions
                              onEdit={() => setModal({ type: 'allergy-edit', item: allergy })}
                              onDelete={() => setModal({ type: 'allergy-delete', item: allergy })}
                              editLabel={`Edit allergy: ${allergy.substance}`}
                              deleteLabel={`Remove allergy: ${allergy.substance}`}
                            />
                          </div>
                        </div>
                        {allergy.reaction && (
                          <p className="text-gray-500 mt-0.5">{allergy.reaction}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* ── Main column: Vitals + Labs + Notes ──────────────────────── */}
          <div className="flex min-w-0 flex-1 flex-col gap-4">

            {/* Recent Vitals */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <SectionHeader
                    icon={<Activity className="h-3.5 w-3.5" />}
                    title="Recent Vitals"
                  />
                </CardTitle>
                {chart.recentVitals && (
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Recorded {formatDateTime(chart.recentVitals.recordedAt)}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {chart.recentVitals ? (
                  <VitalsGrid vitals={chart.recentVitals} />
                ) : (
                  <NoneRecorded label="recent vitals" />
                )}
              </CardContent>
            </Card>

            {/* Recent Encounters */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <SectionHeader
                    icon={<PenLine className="h-3.5 w-3.5" />}
                    title="Recent Encounters"
                    count={chart.recentEncounters.length}
                    onAdd={() => createEncounter.mutate()}
                    addLabel="Start new encounter"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {createEncounter.isPending && (
                  <p className="py-2 text-xs text-blue-500">Opening new encounter…</p>
                )}
                {chart.recentEncounters.length === 0 ? (
                  <div>
                    <NoneRecorded label="encounter notes" />
                    <button
                      onClick={() => createEncounter.mutate()}
                      disabled={createEncounter.isPending}
                      className="mt-2 flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                    >
                      <Plus className="h-3 w-3" />
                      Start first encounter
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-2" role="list" aria-label="Recent encounters">
                    {chart.recentEncounters.map((enc) => (
                      <li key={enc.id}>
                        <button
                          onClick={() => navigate(`/patients/${id}/encounters/${enc.id}`)}
                          className="group w-full rounded-md border border-gray-100 bg-gray-50 p-3 text-left transition-colors hover:border-blue-200 hover:bg-blue-50"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-gray-800 leading-snug truncate">
                                {enc.chiefComplaint ?? enc.type ?? 'Office Visit'}
                              </p>
                              {enc.startTime && (
                                <p className="mt-0.5 text-[10px] text-gray-400">
                                  {formatDateTime(enc.startTime)}
                                </p>
                              )}
                              {enc.providerName && (
                                <p className="mt-0.5 text-[10px] text-gray-400">{enc.providerName}</p>
                              )}
                            </div>
                            <span className={`inline-flex flex-shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${
                              enc.signedAt
                                ? 'bg-green-100 text-green-700'
                                : enc.status === 'in-progress'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {enc.signedAt
                                ? <><CheckCircle className="h-2.5 w-2.5" /> Signed</>
                                : enc.status === 'in-progress'
                                ? <><Clock className="h-2.5 w-2.5" /> In Progress</>
                                : enc.status}
                            </span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Recent Lab Results */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <SectionHeader
                    icon={<FlaskConical className="h-3.5 w-3.5" />}
                    title="Recent Lab Results"
                    count={chart.recentResults.length}
                    onAdd={() => setModal({ type: 'lab-add' })}
                    addLabel="Add lab result"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chart.recentResults.length === 0 ? (
                  <NoneRecorded label="recent lab results" />
                ) : (
                  <div className="overflow-x-auto -mx-1">
                    <table
                      className="w-full text-xs"
                      aria-label="Recent lab results"
                    >
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="px-1 py-1.5 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                            Test
                          </th>
                          <th className="px-1 py-1.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                            Result
                          </th>
                          <th className="px-1 py-1.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                            Reference
                          </th>
                          <th className="px-1 py-1.5 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                            Date
                          </th>
                          <th className="px-1 py-1.5 w-14" aria-label="Actions" />
                        </tr>
                      </thead>
                      <tbody>
                        {chart.recentResults.map((result) => (
                          <tr
                            key={result.id}
                            className="group border-b border-gray-50 last:border-0"
                          >
                            <td className="px-1 py-2 font-medium text-gray-800">
                              {result.name}
                            </td>
                            <td
                              className={cn(
                                'px-1 py-2 text-right font-semibold tabular-nums',
                                result.isAbnormal ? 'text-red-600' : 'text-gray-800'
                              )}
                              aria-label={`${result.name}: ${result.value}${result.unit ? ' ' + result.unit : ''}${result.isAbnormal ? ' — abnormal' : ''}`}
                            >
                              {result.value}
                              {result.unit && (
                                <span className="ml-0.5 text-[10px] font-normal text-gray-500">
                                  {result.unit}
                                </span>
                              )}
                              {result.isAbnormal && (
                                <span
                                  className="ml-1 text-[9px] font-bold text-red-500 uppercase"
                                  aria-hidden="true"
                                >
                                  ↑
                                </span>
                              )}
                            </td>
                            <td className="px-1 py-2 text-right text-gray-400 hidden sm:table-cell">
                              {result.referenceRange ?? '—'}
                            </td>
                            <td className="px-1 py-2 text-right text-gray-500">
                              {formatDate(result.resultDate)}
                            </td>
                            <td className="px-1 py-2">
                              <RowActions
                                onEdit={() => setModal({ type: 'lab-edit', item: result })}
                                onDelete={() => setModal({ type: 'lab-delete', item: result })}
                                editLabel={`Edit lab result: ${result.name}`}
                                deleteLabel={`Delete lab result: ${result.name}`}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Clinical Notes */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <SectionHeader
                    icon={<FileText className="h-3.5 w-3.5" />}
                    title="Recent Notes"
                    count={chart.recentNotes.length}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chart.recentNotes.length === 0 ? (
                  <NoneRecorded label="clinical notes" />
                ) : (
                  <ul className="space-y-3" role="list" aria-label="Recent clinical notes">
                    {chart.recentNotes.map((note) => (
                      <li
                        key={note.id}
                        className="rounded-md border border-gray-100 bg-gray-50 p-3 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <span className="font-semibold text-gray-800 capitalize">
                              {note.type.replace(/-/g, ' ')}
                            </span>
                            <span className="mx-1.5 text-gray-300">·</span>
                            <span className="text-gray-500">{note.authorName}</span>
                          </div>
                          <span className="text-gray-400 flex-shrink-0">{formatDate(note.date)}</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed line-clamp-3">{note.summary}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Right sidebar: Medications + Immunisations + Appointments ─ */}
          <aside className="flex w-52 flex-shrink-0 flex-col gap-4" aria-label="Medications, immunisations, and appointments">

            {/* Current Medications */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <SectionHeader
                    icon={<Pill className="h-3.5 w-3.5" />}
                    title="Medications"
                    count={chart.medications.length}
                    onAdd={() => setModal({ type: 'medication-add' })}
                    addLabel="Add medication"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chart.medications.length === 0 ? (
                  <NoneRecorded label="active medications" />
                ) : (
                  <ul className="space-y-2.5" role="list" aria-label="Current medications">
                    {chart.medications.map((med) => (
                      <li key={med.id} className="group text-xs border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className="font-semibold text-gray-800 leading-snug">{med.name}</p>
                          <RowActions
                            onEdit={() => setModal({ type: 'medication-edit', item: med })}
                            onDelete={() => setModal({ type: 'medication-delete', item: med })}
                            editLabel={`Edit medication: ${med.name}`}
                            deleteLabel={`Stop medication: ${med.name}`}
                          />
                        </div>
                        {(med.dose || med.frequency) && (
                          <p className="text-gray-500 mt-0.5">
                            {med.dose}
                            {med.dose && med.frequency && ' · '}
                            {med.frequency}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Immunisations */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <SectionHeader
                    icon={<Syringe className="h-3.5 w-3.5" />}
                    title="Immunisations"
                    count={chart.immunisations.length}
                    onAdd={() => setModal({ type: 'immunisation-add' })}
                    addLabel="Add immunisation"
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chart.immunisations.length === 0 ? (
                  <NoneRecorded label="immunisation records" />
                ) : (
                  <ul className="space-y-2" role="list" aria-label="Immunisation history">
                    {chart.immunisations.map((imm) => (
                      <li key={imm.id} className="group text-xs border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                        <div className="flex items-start justify-between gap-1">
                          <p className="font-medium text-gray-800 leading-snug">{imm.vaccine}</p>
                          <RowActions
                            onEdit={() => setModal({ type: 'immunisation-edit', item: imm })}
                            onDelete={() => setModal({ type: 'immunisation-delete', item: imm })}
                            editLabel={`Edit immunisation: ${imm.vaccine}`}
                            deleteLabel={`Delete immunisation: ${imm.vaccine}`}
                          />
                        </div>
                        <p className="text-gray-400 mt-0.5">{formatDate(imm.dateGiven)}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <SectionHeader
                    icon={<Calendar className="h-3.5 w-3.5" />}
                    title="Upcoming"
                    count={chart.upcomingAppointments.length}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {chart.upcomingAppointments.length === 0 ? (
                  <NoneRecorded label="upcoming appointments" />
                ) : (
                  <ul className="space-y-2.5" role="list" aria-label="Upcoming appointments">
                    {chart.upcomingAppointments.map((appt) => (
                      <li key={appt.id} className="text-xs border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                        <p className="font-medium text-gray-800 capitalize leading-snug">
                          {appt.type.replace(/-/g, ' ')}
                        </p>
                        <p className="text-gray-500 mt-0.5">{formatDateTime(appt.date)}</p>
                        <Badge
                          variant="secondary"
                          className="mt-1 text-[10px] px-1.5 py-0 font-medium"
                        >
                          {appt.status}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}

      {modal.type === 'immunisation-add' && (
        <ImmunisationModal
          patientId={id!}
          onClose={() => setModal({ type: 'none' })}
          onSaved={handleSaved}
        />
      )}

      {modal.type === 'immunisation-edit' && (
        <ImmunisationModal
          patientId={id!}
          immunisation={modal.item}
          onClose={() => setModal({ type: 'none' })}
          onSaved={handleSaved}
        />
      )}

      {modal.type === 'immunisation-delete' && (
        <DeleteConfirmModal
          title="Delete Immunisation"
          message={`Are you sure you want to delete the ${modal.item.vaccine} immunisation record from ${formatDate(modal.item.dateGiven)}? This action cannot be undone.`}
          confirmLabel="Delete"
          isDestructive
          onConfirm={() => deleteImmunisation.mutate(modal.item.id)}
          onCancel={() => setModal({ type: 'none' })}
          isLoading={deleteImmunisation.isPending}
        />
      )}

      {modal.type === 'lab-add' && (
        <LabResultModal
          patientId={id!}
          onClose={() => setModal({ type: 'none' })}
          onSaved={handleSaved}
        />
      )}

      {modal.type === 'lab-edit' && (
        <LabResultModal
          patientId={id!}
          result={modal.item}
          onClose={() => setModal({ type: 'none' })}
          onSaved={handleSaved}
        />
      )}

      {modal.type === 'lab-delete' && (
        <DeleteConfirmModal
          title="Delete Lab Result"
          message={`Are you sure you want to delete the ${modal.item.name} result from ${formatDate(modal.item.resultDate)}? This action cannot be undone.`}
          confirmLabel="Delete"
          isDestructive
          onConfirm={() => deleteLabResult.mutate(modal.item.id)}
          onCancel={() => setModal({ type: 'none' })}
          isLoading={deleteLabResult.isPending}
        />
      )}

      {modal.type === 'allergy-add' && (
        <AllergyModal
          patientId={id!}
          onClose={() => setModal({ type: 'none' })}
          onSaved={handleSaved}
        />
      )}

      {modal.type === 'allergy-edit' && (
        <AllergyModal
          patientId={id!}
          allergy={modal.item}
          onClose={() => setModal({ type: 'none' })}
          onSaved={handleSaved}
        />
      )}

      {modal.type === 'allergy-delete' && (
        <DeleteConfirmModal
          title="Remove Allergy"
          message={`Are you sure you want to remove ${modal.item.substance} from this patient's allergy list? This action cannot be undone.`}
          confirmLabel="Remove"
          isDestructive
          onConfirm={() => deleteAllergy.mutate(modal.item.id)}
          onCancel={() => setModal({ type: 'none' })}
          isLoading={deleteAllergy.isPending}
        />
      )}

      {modal.type === 'medication-add' && (
        <MedicationModal
          patientId={id!}
          onClose={() => setModal({ type: 'none' })}
          onSaved={handleSaved}
        />
      )}

      {modal.type === 'medication-edit' && (
        <MedicationModal
          patientId={id!}
          medication={modal.item}
          onClose={() => setModal({ type: 'none' })}
          onSaved={handleSaved}
        />
      )}

      {modal.type === 'medication-delete' && (
        <DeleteConfirmModal
          title="Stop Medication"
          message={`Are you sure you want to stop ${modal.item.name}? This will mark the medication as stopped and record the discontinuation date. The medication will remain in the patient's history for audit purposes.`}
          confirmLabel="Stop Medication"
          isDestructive
          onConfirm={() => stopMedication.mutate(modal.item.id)}
          onCancel={() => setModal({ type: 'none' })}
          isLoading={stopMedication.isPending}
        />
      )}
    </>
  )
}
