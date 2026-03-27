import { useQuery } from '@tanstack/react-query'
import {
  Users,
  ClipboardList,
  FileText,
  CheckCircle,
  Shield,
  Clock,
  AlertTriangle,
  Activity,
} from 'lucide-react'
import { api } from '../lib/api'
import { useAuthStore } from '../stores/authStore'
import { Skeleton } from '@patient-health/ui'
import TodayDate from '../components/TodayDate'

interface DashboardData {
  members: {
    total: number
    active: number
    byRisk: Array<{ riskLevel: string; count: number }>
  }
  programmes: {
    total: number
    active: number
    enrollmentsByState: Array<{ state: string; count: number }>
  }
  system: {
    auditEventsToday: number
    recentAlerts: Array<{ type: string; message: string; timestamp: string }>
  }
  users: {
    total: number
    activeToday: number
  }
}

interface IntegrationStatus {
  name: string
  displayName: string
  status: 'healthy' | 'degraded' | 'down'
  lastSync: string
  errorRateLastHour: number
  latencyP95Ms: number
  messageQueueDepth: number
}

interface IntegrationsData {
  integrations: IntegrationStatus[]
  overall: 'healthy' | 'degraded' | 'down'
  checkedAt: string
}

interface AuditEvent {
  id: string
  timestamp: string
  service: string
  entityType: string
  action: string
  actorId: string
  entityId?: string
}

const RISK_CONFIG: Record<string, { label: string; bg: string; text: string; bar: string }> = {
  critical: { label: 'Critical', bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-500' },
  high: { label: 'High', bg: 'bg-orange-50', text: 'text-orange-700', bar: 'bg-orange-400' },
  medium: { label: 'Medium', bg: 'bg-yellow-50', text: 'text-yellow-700', bar: 'bg-yellow-400' },
  low: { label: 'Low', bg: 'bg-indigo-50', text: 'text-indigo-700', bar: 'bg-indigo-400' },
}

const STATE_ORDER = [
  'referred', 'screened', 'eligible', 'consented', 'enrolled', 'active',
  'graduated', 'disenrolled', 'transferred', 'declined',
]

const STATUS_DOT: Record<string, string> = {
  healthy: 'bg-green-500',
  degraded: 'bg-amber-500',
  down: 'bg-red-500',
}

const STATUS_LABEL: Record<string, string> = {
  healthy: 'Healthy',
  degraded: 'Degraded',
  down: 'Down',
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function DashboardPage() {
  const { user } = useAuthStore()

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery<{ data: DashboardData }>({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/api/analytics/dashboard').then((r) => r.data),
    refetchInterval: 60_000,
  })

  const { data: integrationsData, isLoading: integrationsLoading } = useQuery<{
    data: IntegrationsData
  }>({
    queryKey: ['admin-integrations'],
    queryFn: () => api.get('/api/integrations/status').then((r) => r.data),
    refetchInterval: 60_000,
  })

  const { data: auditData, isLoading: auditLoading } = useQuery<{
    data: AuditEvent[]
    meta: { total: number }
  }>({
    queryKey: ['admin-recent-audit'],
    queryFn: () => api.get('/api/audit?limit=5').then((r) => r.data),
    refetchInterval: 60_000,
  })

  const dashboard = dashboardData?.data
  const integrations = integrationsData?.data
  const recentAudit = auditData?.data ?? []

  const overallStatus = integrations?.overall ?? 'healthy'

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div>
          <h1 className="text-base font-semibold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-500">
            Good morning{user ? `, ${user.firstName}` : ''} — platform operations overview
          </p>
        </div>
        <div className="flex items-center gap-3">
          <TodayDate />
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            <span>Auto-refreshes every minute</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* ── KPI Row ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Total Members */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Total Members
              </span>
              <Users className="h-4 w-4 text-indigo-500" />
            </div>
            {dashboardLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold text-gray-900">{dashboard?.members.total ?? 0}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {dashboard?.members.active ?? 0} active members
            </p>
          </div>

          {/* Active Programmes */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Active Programmes
              </span>
              <ClipboardList className="h-4 w-4 text-indigo-500" />
            </div>
            {dashboardLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold text-gray-900">
                {dashboard?.programmes.active ?? 0}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {dashboard?.programmes.total ?? 0} total programmes
            </p>
          </div>

          {/* Audit Events Today */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Audit Events Today
              </span>
              <FileText className="h-4 w-4 text-amber-500" />
            </div>
            {dashboardLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold text-gray-900">
                {dashboard?.system.auditEventsToday ?? 0}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400">across all services</p>
          </div>

          {/* System Health */}
          <div
            className={`rounded-xl border p-4 ${
              overallStatus === 'healthy'
                ? 'border-green-200 bg-green-50'
                : overallStatus === 'degraded'
                  ? 'border-amber-200 bg-amber-50'
                  : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                System Health
              </span>
              <Shield
                className={`h-4 w-4 ${
                  overallStatus === 'healthy'
                    ? 'text-green-600'
                    : overallStatus === 'degraded'
                      ? 'text-amber-600'
                      : 'text-red-600'
                }`}
              />
            </div>
            {integrationsLoading ? (
              <Skeleton className="h-8 w-24" />
            ) : (
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${STATUS_DOT[overallStatus] ?? 'bg-gray-400'}`}
                />
                <span
                  className={`text-lg font-bold ${
                    overallStatus === 'healthy'
                      ? 'text-green-700'
                      : overallStatus === 'degraded'
                        ? 'text-amber-700'
                        : 'text-red-700'
                  }`}
                >
                  {STATUS_LABEL[overallStatus] ?? 'Unknown'}
                </span>
              </div>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {integrations?.integrations.length ?? 0} integrations monitored
            </p>
          </div>
        </div>

        {/* ── Main Grid ────────────────────────────────────────────────────── */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Members by Risk Level */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-indigo-600" />
              <h2 className="text-sm font-semibold text-gray-900">Members by Risk Level</h2>
            </div>
            {dashboardLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {dashboard?.members.byRisk.map(({ riskLevel, count }) => {
                  const cfg = RISK_CONFIG[riskLevel] ?? RISK_CONFIG.low
                  const total = dashboard.members.active
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
                {!dashboard?.members.byRisk.length && (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <Users className="h-8 w-8 mb-2" />
                    <p className="text-sm">No members yet</p>
                  </div>
                )}
                <p className="text-xs text-gray-400 pt-1">
                  {dashboard?.members.total ?? 0} total members registered
                </p>
              </div>
            )}
          </div>

          {/* Programme Enrollment Funnel */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="h-4 w-4 text-indigo-600" />
              <h2 className="text-sm font-semibold text-gray-900">Enrollment Funnel</h2>
            </div>
            {dashboardLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
                {STATE_ORDER.map((state) => {
                  const found = dashboard?.programmes.enrollmentsByState.find(
                    (e) => e.state === state
                  )
                  const count = found?.count ?? 0
                  const total =
                    dashboard?.programmes.enrollmentsByState.reduce((s, e) => s + e.count, 0) ?? 0
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0
                  if (count === 0) return null
                  return (
                    <div key={state}>
                      <div className="flex items-center justify-between text-xs mb-0.5">
                        <span className="font-medium text-gray-700 capitalize">
                          {state.replace('_', ' ')}
                        </span>
                        <span className="text-gray-500">{count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100">
                        <div
                          className="h-1.5 rounded-full bg-indigo-500 transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
                {!dashboard?.programmes.enrollmentsByState.length && (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <ClipboardList className="h-8 w-8 mb-2" />
                    <p className="text-sm">No enrollments yet</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Integration Status */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-indigo-600" />
              <h2 className="text-sm font-semibold text-gray-900">Integration Status</h2>
            </div>
            {integrationsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {integrations?.integrations.map((intg) => (
                  <div
                    key={intg.name}
                    className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${STATUS_DOT[intg.status] ?? 'bg-gray-400'}`}
                      />
                      <span className="text-xs font-medium text-gray-700">{intg.displayName}</span>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[10px] font-semibold ${
                          intg.status === 'healthy'
                            ? 'text-green-600'
                            : intg.status === 'degraded'
                              ? 'text-amber-600'
                              : 'text-red-600'
                        }`}
                      >
                        {STATUS_LABEL[intg.status]}
                      </span>
                      <p className="text-[10px] text-gray-400">
                        {formatRelativeTime(intg.lastSync)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Recent Audit Activity ─────────────────────────────────────── */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-indigo-600" />
            <h2 className="text-sm font-semibold text-gray-900">Recent Audit Activity</h2>
          </div>
          {auditLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : recentAudit.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <CheckCircle className="h-8 w-8 mb-2" />
              <p className="text-sm">No audit events yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {recentAudit.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-xs hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                        event.service === 'emr'
                          ? 'bg-blue-100 text-blue-700'
                          : event.service === 'crm'
                            ? 'bg-emerald-100 text-emerald-700'
                            : event.service === 'admin'
                              ? 'bg-indigo-100 text-indigo-700'
                              : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {event.service}
                    </span>
                    <span className="font-medium text-gray-700">{event.entityType}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                        event.action === 'create'
                          ? 'bg-green-100 text-green-700'
                          : event.action === 'delete'
                            ? 'bg-red-100 text-red-700'
                            : event.action === 'update'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {event.action}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400">
                    <span>actor: {event.actorId.slice(0, 8)}…</span>
                    <span>{formatRelativeTime(event.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System alerts */}
        {dashboard?.system.recentAlerts && dashboard.system.recentAlerts.length > 0 && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <h2 className="text-sm font-semibold text-amber-900">System Alerts</h2>
            </div>
            <div className="space-y-2">
              {dashboard.system.recentAlerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-amber-800">
                  <span className="font-semibold">[{alert.type}]</span>
                  <span>{alert.message}</span>
                  <span className="ml-auto text-amber-600">
                    {formatRelativeTime(alert.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
