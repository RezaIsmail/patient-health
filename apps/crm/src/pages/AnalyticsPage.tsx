import { useQuery } from '@tanstack/react-query'
import { BarChart2, TrendingUp, GitBranch, Users, AlertTriangle } from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'

interface ReferralAnalytics {
  byStage: Array<{ stage: string; _count: { id: number } }>
  byPriority: Array<{ priority: string; _count: { id: number } }>
  recentVolume: Array<{ type: string; _count: { id: number } }>
}

interface GapAnalytics {
  openByType: Array<{ gapType: string; _count: { id: number } }>
  closedThisMonth: number
  totalOpen: number
}

const GAP_TYPE_LABELS: Record<string, string> = {
  mammogram: 'Mammogram',
  colorectal_screening: 'Colorectal Screening',
  hba1c: 'HbA1c Monitoring',
  flu_vaccine: 'Flu Vaccination',
  bp_check: 'Blood Pressure Check',
  medication_refill: 'Medication Refill',
  behavioural_health_assessment: 'Behavioural Health',
  post_discharge_followup: 'Post-Discharge Follow-up',
  other: 'Other',
}

const PRIORITY_CONFIG: Record<string, string> = {
  emergent: 'bg-red-500',
  urgent: 'bg-orange-400',
  routine: 'bg-gray-300',
}

const STAGE_CONFIG: Record<string, string> = {
  received: 'bg-gray-400',
  reviewing: 'bg-blue-500',
  authorized: 'bg-amber-400',
  scheduled: 'bg-emerald-500',
  completed: 'bg-emerald-700',
  declined: 'bg-red-400',
  cancelled: 'bg-gray-300',
}

export default function AnalyticsPage() {
  const referralQuery = useQuery<{ data: ReferralAnalytics }>({
    queryKey: ['analytics-referrals'],
    queryFn: () => api.get('/api/analytics/referrals').then((r) => r.data),
  })

  const gapQuery = useQuery<{ data: GapAnalytics }>({
    queryKey: ['analytics-gaps'],
    queryFn: () => api.get('/api/analytics/care-gaps').then((r) => r.data),
  })

  const referrals = referralQuery.data?.data
  const gaps = gapQuery.data?.data

  const maxReferralCount = Math.max(...(referrals?.byStage.map((s) => s._count.id) ?? [1]), 1)
  const maxGapCount = Math.max(...(gaps?.openByType.map((g) => g._count.id) ?? [1]), 1)

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-14 items-center border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-emerald-600" />
          <h1 className="text-base font-semibold text-gray-900">Analytics</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Referrals by Stage */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-5">
              <GitBranch className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-semibold text-gray-900">Referrals by Stage</h2>
            </div>
            {referralQuery.isLoading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
            ) : !referrals?.byStage.length ? (
              <p className="text-sm text-gray-400 text-center py-8">No referral data</p>
            ) : (
              <div className="space-y-3">
                {referrals.byStage
                  .sort((a, b) => b._count.id - a._count.id)
                  .map(({ stage, _count }) => {
                    const pct = Math.round((_count.id / maxReferralCount) * 100)
                    const bar = STAGE_CONFIG[stage] ?? 'bg-gray-400'
                    return (
                      <div key={stage}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-medium text-gray-700 capitalize">{stage}</span>
                          <span className="font-bold text-gray-900">{_count.id}</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100">
                          <div className={`h-2 rounded-full transition-all duration-500 ${bar}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>

          {/* Referrals by Priority */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-semibold text-gray-900">Open Referrals by Priority</h2>
            </div>
            {referralQuery.isLoading ? (
              <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
            ) : !referrals?.byPriority.length ? (
              <p className="text-sm text-gray-400 text-center py-8">No data</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {referrals.byPriority.map(({ priority, _count }) => (
                  <div key={priority} className="rounded-lg bg-gray-50 p-4 text-center">
                    <div className={`h-3 w-3 rounded-full mx-auto mb-2 ${PRIORITY_CONFIG[priority] ?? 'bg-gray-400'}`} />
                    <p className="text-2xl font-bold text-gray-900">{_count.id}</p>
                    <p className="text-xs text-gray-500 capitalize mt-0.5">{priority}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Care Gaps by Type */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm font-semibold text-gray-900">Open Care Gaps by Type</h2>
              </div>
              {gaps && (
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{gaps.totalOpen}</p>
                  <p className="text-[10px] text-gray-400">total open</p>
                </div>
              )}
            </div>
            {gapQuery.isLoading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-full" />)}</div>
            ) : !gaps?.openByType.length ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <AlertTriangle className="h-8 w-8 mb-2" />
                <p className="text-sm font-medium">No open care gaps</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {gaps.openByType.map(({ gapType, _count }) => {
                  const pct = Math.round((_count.id / maxGapCount) * 100)
                  return (
                    <div key={gapType}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700">{GAP_TYPE_LABELS[gapType] ?? gapType}</span>
                        <span className="font-bold text-gray-900">{_count.id}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-amber-100">
                        <div className="h-1.5 rounded-full bg-amber-400 transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Gap Closure Summary */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-5">
              <Users className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-semibold text-gray-900">Care Gap Performance (30 days)</h2>
            </div>
            {gapQuery.isLoading ? (
              <div className="space-y-3"><Skeleton className="h-24 w-full" /></div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-emerald-50 p-5 text-center">
                  <p className="text-4xl font-bold text-emerald-700">{gaps?.closedThisMonth ?? 0}</p>
                  <p className="text-xs text-emerald-600 mt-1 font-medium">Gaps closed this month</p>
                </div>
                <div className="rounded-lg bg-amber-50 p-5 text-center">
                  <p className="text-4xl font-bold text-amber-700">{gaps?.totalOpen ?? 0}</p>
                  <p className="text-xs text-amber-600 mt-1 font-medium">Total open gaps</p>
                </div>
                {gaps && gaps.totalOpen > 0 && gaps.closedThisMonth > 0 && (
                  <div className="col-span-2 rounded-lg bg-gray-50 p-4 text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Closure rate: <span className="font-bold text-emerald-700">
                        {Math.round((gaps.closedThisMonth / (gaps.closedThisMonth + gaps.totalOpen)) * 100)}%
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">of total gap activity this month</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
