import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import {
  GitBranch,
  CheckSquare,
  Users,
  AlertTriangle,
  ClipboardList,
  Megaphone,
  TrendingUp,
  Clock,
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { Skeleton } from '@patient-health/ui'

interface DashboardData {
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
    launchedAt: string
  }>
  myActivity: {
    tasksCompletedThisWeek: number
    contactsTouchedThisWeek: number
  }
}

const STAGE_LABELS: Record<string, string> = {
  received: 'Received',
  reviewing: 'Reviewing',
  authorized: 'Authorized',
  scheduled: 'Scheduled',
}

const RISK_CONFIG: Record<string, { label: string; bg: string; text: string; bar: string }> = {
  critical: { label: 'Critical', bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-500' },
  high: { label: 'High', bg: 'bg-orange-50', text: 'text-orange-700', bar: 'bg-orange-400' },
  medium: { label: 'Medium', bg: 'bg-yellow-50', text: 'text-yellow-700', bar: 'bg-yellow-400' },
  low: { label: 'Low', bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-400' },
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

export default function DashboardPage() {
  const { user } = useAuthStore()

  const { data, isLoading } = useQuery<{ data: DashboardData }>({
    queryKey: ['crm-dashboard'],
    queryFn: () => api.get('/api/analytics/dashboard').then((r) => r.data),
    refetchInterval: 60_000,
  })

  const dashboard = data?.data

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-500">
            Good morning{user ? `, ${user.firstName}` : ''} — here's what needs your attention today
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock className="h-3 w-3" />
          <span>Auto-refreshes every minute</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* ── KPI Row ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Open Referrals */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Open Referrals</span>
              <GitBranch className="h-4 w-4 text-emerald-500" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold text-gray-900">{dashboard?.referrals.openTotal ?? 0}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">across pipeline stages</p>
          </div>

          {/* Overdue Tasks */}
          <div className={`rounded-xl border p-4 ${(dashboard?.tasks.overdueCount ?? 0) > 0 ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Overdue Tasks</span>
              <AlertTriangle className={`h-4 w-4 ${(dashboard?.tasks.overdueCount ?? 0) > 0 ? 'text-red-500' : 'text-gray-400'}`} />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className={`text-3xl font-bold ${(dashboard?.tasks.overdueCount ?? 0) > 0 ? 'text-red-700' : 'text-gray-900'}`}>
                {dashboard?.tasks.overdueCount ?? 0}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400">{dashboard?.tasks.myOpenCount ?? 0} assigned to me</p>
          </div>

          {/* Open Care Gaps */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Open Care Gaps</span>
              <TrendingUp className="h-4 w-4 text-amber-500" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold text-gray-900">{dashboard?.careGaps.totalOpen ?? 0}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">requiring closure</p>
          </div>

          {/* Active Care Plans */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Care Plans</span>
              <ClipboardList className="h-4 w-4 text-emerald-500" />
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold text-gray-900">{dashboard?.carePlans.activeCount ?? 0}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">in progress</p>
          </div>
        </div>

        {/* ── Main Grid ────────────────────────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Referral Pipeline */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <GitBranch className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-semibold text-gray-900">Referral Pipeline</h2>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <div className="space-y-2">
                {dashboard?.referrals.pipeline.map(({ stage, count }) => {
                  const total = dashboard.referrals.openTotal
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={stage}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700">{STAGE_LABELS[stage] ?? stage}</span>
                        <span className="text-gray-500">{count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100">
                        <div
                          className="h-1.5 rounded-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Active Contacts by Risk */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-semibold text-gray-900">Contacts by Risk Level</h2>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            ) : (
              <div className="space-y-2">
                {dashboard?.contacts.byRisk.map(({ riskLevel, count }) => {
                  const cfg = RISK_CONFIG[riskLevel]
                  const total = dashboard.contacts.totalActive
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={riskLevel} className={`rounded-lg p-3 ${cfg.bg}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
                        <span className={`text-sm font-bold ${cfg.text}`}>{count}</span>
                      </div>
                      <div className="mt-1.5 h-1 rounded-full bg-white/50">
                        <div
                          className={`h-1 rounded-full transition-all duration-500 ${cfg.bar}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
                <p className="text-xs text-gray-400 pt-1">{dashboard?.contacts.totalActive ?? 0} total active contacts</p>
              </div>
            )}
          </div>

          {/* My Activity */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckSquare className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-semibold text-gray-900">My Activity This Week</h2>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="rounded-lg bg-emerald-50 p-4 text-center">
                  <p className="text-3xl font-bold text-emerald-700">{dashboard?.myActivity.tasksCompletedThisWeek ?? 0}</p>
                  <p className="text-xs text-emerald-600 mt-1">Tasks completed</p>
                </div>
                <div className="rounded-lg bg-blue-50 p-4 text-center">
                  <p className="text-3xl font-bold text-blue-700">{dashboard?.myActivity.contactsTouchedThisWeek ?? 0}</p>
                  <p className="text-xs text-blue-600 mt-1">Contacts touched</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom Row ───────────────────────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top Care Gaps */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Top Open Care Gaps</h2>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            ) : dashboard?.careGaps.byType.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <TrendingUp className="h-8 w-8 mb-2" />
                <p className="text-sm">No open care gaps</p>
              </div>
            ) : (
              <div className="space-y-2">
                {dashboard?.careGaps.byType.map(({ gapType, count }) => (
                  <div key={gapType} className="flex items-center justify-between rounded-md bg-amber-50 px-3 py-2">
                    <span className="text-xs font-medium text-amber-800">{GAP_TYPE_LABELS[gapType] ?? gapType}</span>
                    <span className="text-sm font-bold text-amber-700">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Campaigns */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Megaphone className="h-4 w-4 text-emerald-600" />
              <h2 className="text-sm font-semibold text-gray-900">Recent Campaigns</h2>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}
              </div>
            ) : dashboard?.campaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <Megaphone className="h-8 w-8 mb-2" />
                <p className="text-sm">No active campaigns</p>
              </div>
            ) : (
              <div className="space-y-2">
                {dashboard?.campaigns.map((c) => (
                  <div key={c.id} className="rounded-md border border-gray-100 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-800 truncate max-w-[180px]">{c.name}</span>
                      <span className={`text-[10px] font-semibold rounded px-1.5 py-0.5 ${
                        c.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <div className="flex gap-3 mt-1 text-[10px] text-gray-500">
                      <span>{c.sentCount.toLocaleString()} sent</span>
                      <span>{c.openRate}% open rate</span>
                      <span>{c.responseRate}% response</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
