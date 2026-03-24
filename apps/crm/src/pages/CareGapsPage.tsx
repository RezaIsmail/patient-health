import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AlertTriangle, CheckCircle2, TrendingUp, Filter } from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'
import { format, differenceInDays } from 'date-fns'

interface CareGap {
  id: string
  gapType: string
  description: string
  status: 'open' | 'in_progress' | 'closed' | 'excluded'
  priority: 'critical' | 'high' | 'medium' | 'low'
  contactId: string
  identifiedAt: string
  dueDate?: string
  closedAt?: string
  closedBy?: string
  contact?: { firstName: string; lastName: string; riskLevel: string }
}

const PRIORITY_CONFIG: Record<string, { label: string; dot: string; badge: string }> = {
  critical: { label: 'Critical', dot: 'bg-red-500', badge: 'bg-red-100 text-red-700' },
  high: { label: 'High', dot: 'bg-orange-400', badge: 'bg-orange-100 text-orange-700' },
  medium: { label: 'Medium', dot: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-700' },
  low: { label: 'Low', dot: 'bg-gray-300', badge: 'bg-gray-100 text-gray-600' },
}

const STATUS_TABS = [
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
  { value: 'excluded', label: 'Excluded' },
] as const

const GAP_TYPE_LABELS: Record<string, string> = {
  mammogram: 'Mammogram',
  colorectal_screening: 'Colorectal Screening',
  diabetes_eye_exam: 'Diabetes Eye Exam',
  diabetes_foot_exam: 'Diabetes Foot Exam',
  hba1c: 'HbA1c Check',
  blood_pressure_control: 'Blood Pressure Control',
  statin_therapy: 'Statin Therapy',
  annual_wellness_visit: 'Annual Wellness Visit',
  depression_screening: 'Depression Screening',
  smoking_cessation: 'Smoking Cessation',
  medication_adherence: 'Medication Adherence',
  follow_up_post_discharge: 'Post-Discharge Follow-up',
  immunisation: 'Immunisation',
  other: 'Other',
}

export default function CareGapsPage() {
  const qc = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<'open' | 'in_progress' | 'closed' | 'excluded'>('open')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [gapTypeFilter, setGapTypeFilter] = useState('')
  const [closingId, setClosingId] = useState<string | null>(null)
  const [closingNote, setClosingNote] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['care-gaps-population', statusFilter, priorityFilter, gapTypeFilter],
    queryFn: () =>
      api
        .get('/api/care-gaps', {
          params: {
            status: statusFilter,
            ...(priorityFilter && { priority: priorityFilter }),
            ...(gapTypeFilter && { gapType: gapTypeFilter }),
            pageSize: 100,
          },
        })
        .then((r) => r.data),
    placeholderData: (prev) => prev,
  })

  const closeMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      api.patch(`/api/care-gaps/${id}`, { status: 'closed', closureNote: note }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['care-gaps-population'] })
      setClosingId(null)
      setClosingNote('')
    },
  })

  const gaps: CareGap[] = data?.data ?? []
  const meta = data?.meta

  // Summary stats
  const byPriority = gaps.reduce<Record<string, number>>((acc, g) => {
    acc[g.priority] = (acc[g.priority] ?? 0) + 1
    return acc
  }, {})

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Care Gaps</h1>
            <p className="text-sm text-gray-500 mt-0.5">Population-level care gap management</p>
          </div>
        </div>

        {/* Priority summary */}
        {statusFilter === 'open' && gaps.length > 0 && (
          <div className="mt-4 flex items-center gap-3">
            {(['critical', 'high', 'medium', 'low'] as const).map((p) => {
              const count = byPriority[p] ?? 0
              if (!count) return null
              const cfg = PRIORITY_CONFIG[p]
              return (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(priorityFilter === p ? '' : p)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    priorityFilter === p
                      ? `${cfg.badge} ring-2 ring-offset-1 ring-current`
                      : cfg.badge
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                  {count} {cfg.label}
                </button>
              )
            })}
          </div>
        )}

        {/* Filters */}
        <div className="mt-4 flex items-center gap-3 flex-wrap">
          {/* Status tabs */}
          <div className="flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  statusFilter === tab.value
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <select
            value={gapTypeFilter}
            onChange={(e) => setGapTypeFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">All Gap Types</option>
            {Object.entries(GAP_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {(priorityFilter || gapTypeFilter) && (
            <button
              onClick={() => { setPriorityFilter(''); setGapTypeFilter('') }}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 underline"
            >
              <Filter className="h-3 w-3" />
              Clear filters
            </button>
          )}

          <span className="ml-auto text-xs text-gray-400">
            {meta?.total ?? gaps.length} gap{(meta?.total ?? gaps.length) !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : gaps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            {statusFilter === 'closed' ? (
              <>
                <CheckCircle2 className="h-12 w-12 mb-3 text-emerald-400" />
                <p className="text-base font-medium text-gray-600">No closed care gaps</p>
                <p className="text-sm mt-1">Closed gaps will appear here once resolved</p>
              </>
            ) : (
              <>
                <TrendingUp className="h-12 w-12 mb-3" />
                <p className="text-base font-medium">No {statusFilter} care gaps</p>
                <p className="text-sm mt-1">
                  {priorityFilter || gapTypeFilter
                    ? 'Try adjusting your filters'
                    : 'All caught up — great work!'}
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {gaps.map((gap) => {
              const ageDays = differenceInDays(new Date(), new Date(gap.identifiedAt))
              const isOverdue = gap.dueDate && new Date(gap.dueDate) < new Date()
              const priorityCfg = PRIORITY_CONFIG[gap.priority] ?? PRIORITY_CONFIG.low

              return (
                <div
                  key={gap.id}
                  className={`rounded-xl border bg-white px-5 py-4 ${
                    gap.priority === 'critical'
                      ? 'border-red-200'
                      : gap.priority === 'high'
                      ? 'border-orange-200'
                      : 'border-gray-200'
                  }`}
                >
                  {/* Close dialog inline */}
                  {closingId === gap.id ? (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-800">Close Care Gap</p>
                      <textarea
                        value={closingNote}
                        onChange={(e) => setClosingNote(e.target.value)}
                        rows={2}
                        placeholder="Describe how this gap was closed (e.g. mammogram completed 2026-03-15)…"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => closeMutation.mutate({ id: gap.id, note: closingNote })}
                          disabled={!closingNote.trim() || closeMutation.isPending}
                          className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {closeMutation.isPending ? 'Closing…' : 'Confirm Close'}
                        </button>
                        <button
                          onClick={() => { setClosingId(null); setClosingNote('') }}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <div className={`h-2 w-2 rounded-full flex-shrink-0 mt-2 ${priorityCfg.dot}`} />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-900">
                            {GAP_TYPE_LABELS[gap.gapType] ?? gap.gapType}
                          </span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityCfg.badge}`}>
                            {priorityCfg.label}
                          </span>
                          {isOverdue && (
                            <span className="flex items-center gap-0.5 rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                              <AlertTriangle className="h-2.5 w-2.5" />
                              Overdue
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5">{gap.description}</p>
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          {gap.contact && (
                            <Link
                              to={`/contacts/${gap.contactId}`}
                              className="text-xs text-emerald-600 hover:underline"
                            >
                              {gap.contact.firstName} {gap.contact.lastName}
                            </Link>
                          )}
                          <span className="text-xs text-gray-400">
                            Identified {ageDays === 0 ? 'today' : `${ageDays}d ago`} · {format(new Date(gap.identifiedAt), 'MMM d, yyyy')}
                          </span>
                          {gap.dueDate && (
                            <span className={`text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                              Due {format(new Date(gap.dueDate), 'MMM d, yyyy')}
                            </span>
                          )}
                          {gap.closedAt && (
                            <span className="text-xs text-emerald-500">
                              Closed {format(new Date(gap.closedAt), 'MMM d, yyyy')}
                              {gap.closedBy && ` by ${gap.closedBy}`}
                            </span>
                          )}
                        </div>
                      </div>

                      {statusFilter === 'open' || statusFilter === 'in_progress' ? (
                        <button
                          onClick={() => setClosingId(gap.id)}
                          className="flex-shrink-0 flex items-center gap-1 rounded-md border border-emerald-300 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Close Gap
                        </button>
                      ) : null}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
