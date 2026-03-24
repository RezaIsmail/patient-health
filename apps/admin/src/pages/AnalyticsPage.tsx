import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  BarChart2,
  Users,
  ClipboardList,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Plus,
  X,
  Trash2,
  Play,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardData {
  members: { total: number; active: number; byRisk: Array<{ riskLevel: string; count: number }> }
  programmes: { total: number; active: number; enrollmentsByState: Array<{ state: string; count: number }> }
  system: { auditEventsToday: number; recentAlerts: Array<{ ruleId: string; name: string; severity: string; message: string; timestamp: string }> }
}

interface ProgrammeStats {
  programmeId: string
  name: string
  type: string
  totalEnrollments: number
  stateFunnel: Record<string, number>
  velocityLast30d: number
  consentRate: number
  capacityUtilisation: number | null
  disenrollmentReasons: Array<{ reason: string; count: number }>
}

interface ProgrammeAnalytics {
  summary: { activeProgrammes: number; totalActiveEnrollments: number; newEnrollmentsLast30d: number }
  programmes: ProgrammeStats[]
}

interface ComplianceData {
  summary: { totalEventsLast30d: number; deleteActionsLast30d: number; roleGrantsLast30d: number; roleRevocationsLast30d: number; sensitiveViewsToday: number }
  byService: Array<{ service: string; count: number }>
  byAction: Array<{ action: string; count: number }>
  byEntityType: Array<{ entityType: string; count: number }>
  trend: Array<{ date: string; count: number }>
}

interface AlertRule {
  id: string
  name: string
  description?: string
  isActive: boolean
  service?: string
  entityType?: string
  action?: string
  actorRole?: string
  threshold: number
  windowMinutes: number
  severity: string
  createdBy: string
  createdAt: string
}

interface EvalResult {
  ruleId: string
  name: string
  severity: string
  threshold: number
  windowMinutes: number
  windowStart: string
  evaluatedAt: string
  currentCount: number
  breached: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SEVERITY_COLOURS: Record<string, string> = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
}

const RISK_COLOURS: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-400',
  medium: 'bg-yellow-400',
  low: 'bg-green-400',
}

const STATE_ORDER = ['referred', 'screened', 'eligible', 'consented', 'enrolled', 'active', 'graduated', 'disenrolled', 'transferred', 'declined']

type Tab = 'overview' | 'programmes' | 'compliance' | 'alert-rules'

// ─── Component ────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const qc = useQueryClient()
  const [tab, setTab] = useState<Tab>('overview')
  const [showCreateRule, setShowCreateRule] = useState(false)
  const [evalResult, setEvalResult] = useState<Record<string, EvalResult>>({})
  const [ruleForm, setRuleForm] = useState({
    name: '',
    description: '',
    service: '',
    entityType: '',
    action: '',
    actorRole: '',
    threshold: 10,
    windowMinutes: 60,
    severity: 'medium',
  })

  const { data: dashData, isLoading: dashLoading } = useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: () => api.get<{ data: DashboardData }>('/api/analytics/dashboard').then((r) => r.data.data),
    refetchInterval: 60_000,
  })

  const { data: progData, isLoading: progLoading } = useQuery({
    queryKey: ['analytics', 'programmes'],
    queryFn: () => api.get<{ data: ProgrammeAnalytics }>('/api/analytics/programmes').then((r) => r.data.data),
    enabled: tab === 'programmes',
  })

  const { data: compData, isLoading: compLoading } = useQuery({
    queryKey: ['analytics', 'compliance'],
    queryFn: () => api.get<{ data: ComplianceData }>('/api/analytics/compliance').then((r) => r.data.data),
    enabled: tab === 'compliance',
  })

  const { data: rulesData, isLoading: rulesLoading } = useQuery({
    queryKey: ['audit-alert-rules'],
    queryFn: () => api.get<{ data: AlertRule[] }>('/api/audit-alert-rules').then((r) => r.data.data),
    enabled: tab === 'alert-rules',
  })

  const createRule = useMutation({
    mutationFn: (data: typeof ruleForm) =>
      api.post('/api/audit-alert-rules', {
        ...data,
        service: data.service || null,
        entityType: data.entityType || null,
        action: data.action || null,
        actorRole: data.actorRole || null,
        threshold: Number(data.threshold),
        windowMinutes: Number(data.windowMinutes),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['audit-alert-rules'] })
      setShowCreateRule(false)
      setRuleForm({ name: '', description: '', service: '', entityType: '', action: '', actorRole: '', threshold: 10, windowMinutes: 60, severity: 'medium' })
    },
  })

  const toggleRule = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/api/audit-alert-rules/${id}`, { isActive: !isActive }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['audit-alert-rules'] }),
  })

  const deleteRule = useMutation({
    mutationFn: (id: string) => api.delete(`/api/audit-alert-rules/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['audit-alert-rules'] }),
  })

  const evaluateRule = useMutation({
    mutationFn: (id: string) =>
      api.post<{ data: EvalResult }>(`/api/audit-alert-rules/${id}/evaluate`, {}).then((r) => r.data.data),
    onSuccess: (result) => setEvalResult((prev) => ({ ...prev, [result.ruleId]: result })),
  })

  const tabs: Array<{ key: Tab; label: string; icon: React.ReactNode }> = [
    { key: 'overview', label: 'Overview', icon: <BarChart2 className="h-4 w-4" /> },
    { key: 'programmes', label: 'Programmes', icon: <ClipboardList className="h-4 w-4" /> },
    { key: 'compliance', label: 'Compliance', icon: <ShieldAlert className="h-4 w-4" /> },
    { key: 'alert-rules', label: 'Alert Rules', icon: <AlertTriangle className="h-4 w-4" /> },
  ]

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <BarChart2 className="h-5 w-5 text-gray-400" />
          <div>
            <h1 className="text-base font-semibold text-gray-900">Analytics & Compliance</h1>
            <p className="text-xs text-gray-500">Programme performance, compliance monitoring, and alert rules</p>
          </div>
        </div>
        {tab === 'alert-rules' && (
          <button
            onClick={() => setShowCreateRule(true)}
            className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add Rule
          </button>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-200 bg-white px-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* ── Overview tab ────────────────────────────────────────────────── */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* KPI cards */}
            {dashLoading ? (
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
              </div>
            ) : dashData && (
              <>
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                  <KpiCard label="Total Members" value={dashData.members.total} icon={<Users className="h-4 w-4 text-indigo-500" />} />
                  <KpiCard label="Active Members" value={dashData.members.active} icon={<Users className="h-4 w-4 text-green-500" />} />
                  <KpiCard label="Active Programmes" value={dashData.programmes.active} icon={<ClipboardList className="h-4 w-4 text-blue-500" />} />
                  <KpiCard label="Audit Events Today" value={dashData.system.auditEventsToday} icon={<ShieldAlert className="h-4 w-4 text-gray-500" />} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Risk distribution */}
                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <p className="mb-3 text-xs font-semibold text-gray-700 uppercase tracking-wide">Members by Risk Level</p>
                    <div className="space-y-2">
                      {['critical', 'high', 'medium', 'low'].map((level) => {
                        const item = dashData.members.byRisk.find((r) => r.riskLevel === level)
                        const count = item?.count ?? 0
                        const pct = dashData.members.total > 0 ? Math.round((count / dashData.members.total) * 100) : 0
                        return (
                          <div key={level} className="flex items-center gap-2">
                            <span className="w-16 text-xs capitalize text-gray-600">{level}</span>
                            <div className="flex-1 rounded-full bg-gray-100 h-2">
                              <div
                                className={`h-2 rounded-full ${RISK_COLOURS[level]}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-12 text-right text-xs text-gray-500">{count} ({pct}%)</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Enrollment funnel */}
                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <p className="mb-3 text-xs font-semibold text-gray-700 uppercase tracking-wide">Enrollments by State</p>
                    <div className="space-y-1.5">
                      {dashData.programmes.enrollmentsByState.map((e) => (
                        <div key={e.state} className="flex items-center justify-between text-sm">
                          <span className="capitalize text-gray-600">{e.state.replace(/_/g, ' ')}</span>
                          <span className="font-medium text-gray-900">{e.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Active alerts */}
                {dashData.system.recentAlerts.length > 0 && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="mb-2 text-xs font-semibold text-red-800 uppercase tracking-wide">Active Alert Breaches</p>
                    <div className="space-y-2">
                      {dashData.system.recentAlerts.map((alert) => (
                        <div key={alert.ruleId} className="flex items-start gap-2">
                          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                          <div>
                            <span className={`mr-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${SEVERITY_COLOURS[alert.severity]}`}>
                              {alert.severity}
                            </span>
                            <span className="text-sm text-red-800">{alert.message}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Programmes tab ──────────────────────────────────────────────── */}
        {tab === 'programmes' && (
          <div className="space-y-4">
            {progLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)}
              </div>
            ) : progData && (
              <>
                {/* Summary */}
                <div className="grid grid-cols-3 gap-4">
                  <KpiCard label="Active Programmes" value={progData.summary.activeProgrammes} icon={<ClipboardList className="h-4 w-4 text-indigo-500" />} />
                  <KpiCard label="Active Enrollments" value={progData.summary.totalActiveEnrollments} icon={<Users className="h-4 w-4 text-green-500" />} />
                  <KpiCard label="New (Last 30d)" value={progData.summary.newEnrollmentsLast30d} icon={<TrendingUp className="h-4 w-4 text-blue-500" />} />
                </div>

                {/* Per-programme cards */}
                {progData.programmes.map((prog) => (
                  <div key={prog.programmeId} className="rounded-lg border border-gray-200 bg-white p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{prog.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{prog.type.replace(/_/g, ' ')}</p>
                      </div>
                      <div className="flex gap-3 text-right text-xs">
                        <div>
                          <p className="font-semibold text-gray-900">{prog.velocityLast30d}</p>
                          <p className="text-gray-500">new / 30d</p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{prog.consentRate}%</p>
                          <p className="text-gray-500">consent rate</p>
                        </div>
                        {prog.capacityUtilisation !== null && (
                          <div>
                            <p className="font-semibold text-gray-900">{prog.capacityUtilisation}%</p>
                            <p className="text-gray-500">capacity</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* State funnel */}
                    <div className="flex flex-wrap gap-2">
                      {STATE_ORDER.filter((s) => (prog.stateFunnel[s] ?? 0) > 0).map((state) => (
                        <span key={state} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700">
                          <span className="capitalize">{state.replace(/_/g, ' ')}</span>
                          <span className="font-semibold">{prog.stateFunnel[state]}</span>
                        </span>
                      ))}
                    </div>

                    {prog.disenrollmentReasons.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        Top disenrollment reason:{' '}
                        <span className="font-medium text-gray-700">{prog.disenrollmentReasons[0].reason}</span>
                        {' '}({prog.disenrollmentReasons[0].count})
                      </div>
                    )}
                  </div>
                ))}

                {progData.programmes.length === 0 && (
                  <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                    <ClipboardList className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                    <p className="text-sm text-gray-500">No active programmes</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Compliance tab ──────────────────────────────────────────────── */}
        {tab === 'compliance' && (
          <div className="space-y-4">
            {compLoading ? (
              <div className="grid grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
              </div>
            ) : compData && (
              <>
                {/* KPI row */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
                  <KpiCard label="Audit Events (30d)" value={compData.summary.totalEventsLast30d} icon={<ShieldAlert className="h-4 w-4 text-gray-500" />} />
                  <KpiCard label="Delete Actions (30d)" value={compData.summary.deleteActionsLast30d} icon={<Trash2 className="h-4 w-4 text-red-500" />} />
                  <KpiCard label="Role Grants (30d)" value={compData.summary.roleGrantsLast30d} icon={<CheckCircle className="h-4 w-4 text-green-500" />} />
                  <KpiCard label="Role Revocations (30d)" value={compData.summary.roleRevocationsLast30d} icon={<X className="h-4 w-4 text-orange-500" />} />
                  <KpiCard label="Sensitive Views Today" value={compData.summary.sensitiveViewsToday} icon={<Users className="h-4 w-4 text-blue-500" />} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* By service */}
                  <DistributionTable title="By Service" rows={compData.byService.map((r) => ({ label: r.service, count: r.count }))} />
                  {/* By action */}
                  <DistributionTable title="By Action" rows={compData.byAction.map((r) => ({ label: r.action, count: r.count }))} />
                  {/* By entity type */}
                  <DistributionTable title="By Entity Type" rows={compData.byEntityType.map((r) => ({ label: r.entityType, count: r.count }))} />
                </div>

                {/* 7-day trend */}
                {compData.trend.length > 0 && (
                  <div className="rounded-lg border border-gray-200 bg-white p-4">
                    <p className="mb-3 text-xs font-semibold text-gray-700 uppercase tracking-wide">Audit Volume — 7 Day Trend</p>
                    <div className="flex items-end gap-2 h-24">
                      {compData.trend.map((day) => {
                        const max = Math.max(...compData.trend.map((d) => d.count))
                        const height = max > 0 ? Math.round((day.count / max) * 100) : 0
                        return (
                          <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
                            <span className="text-[9px] text-gray-400">{day.count}</span>
                            <div className="w-full rounded-t bg-indigo-400" style={{ height: `${height}%`, minHeight: '2px' }} />
                            <span className="text-[9px] text-gray-400">{day.date.slice(5)}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Alert rules tab ─────────────────────────────────────────────── */}
        {tab === 'alert-rules' && (
          <div className="space-y-3">
            {rulesLoading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
              </div>
            ) : (rulesData ?? []).length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                <p className="text-sm text-gray-500">No alert rules configured</p>
                <p className="mt-1 text-xs text-gray-400">Create rules to receive anomaly alerts on the dashboard</p>
              </div>
            ) : (
              (rulesData ?? []).map((rule) => {
                const result = evalResult[rule.id]
                return (
                  <div key={rule.id} className={`rounded-lg border bg-white p-4 ${rule.isActive ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{rule.name}</p>
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${SEVERITY_COLOURS[rule.severity]}`}>
                            {rule.severity}
                          </span>
                          {!rule.isActive && (
                            <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">Disabled</span>
                          )}
                        </div>
                        {rule.description && <p className="mt-0.5 text-xs text-gray-500">{rule.description}</p>}
                        <p className="mt-1 text-xs text-gray-400">
                          Trigger if{' '}
                          <span className="font-medium text-gray-600">
                            {[rule.service, rule.entityType, rule.action].filter(Boolean).join(' / ') || 'any event'}
                          </span>
                          {' '}exceeds <span className="font-medium text-gray-600">{rule.threshold}</span> in{' '}
                          <span className="font-medium text-gray-600">{rule.windowMinutes}min</span>
                        </p>
                        {result && (
                          <div className={`mt-2 inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs ${result.breached ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                            {result.breached
                              ? <AlertTriangle className="h-3.5 w-3.5" />
                              : <CheckCircle className="h-3.5 w-3.5" />}
                            {result.breached ? `BREACHED — ${result.currentCount} events` : `OK — ${result.currentCount} events`}
                            {' '}in window (evaluated {new Date(result.evaluatedAt).toLocaleTimeString()})
                          </div>
                        )}
                      </div>
                      <div className="flex flex-shrink-0 gap-1.5">
                        <button
                          onClick={() => evaluateRule.mutate(rule.id)}
                          disabled={evaluateRule.isPending}
                          title="Evaluate now"
                          className="rounded border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Play className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => toggleRule.mutate({ id: rule.id, isActive: rule.isActive })}
                          title={rule.isActive ? 'Disable' : 'Enable'}
                          className="rounded border border-gray-300 p-1.5 text-gray-500 hover:bg-gray-50"
                        >
                          {rule.isActive
                            ? <ToggleRight className="h-3.5 w-3.5 text-indigo-600" />
                            : <ToggleLeft className="h-3.5 w-3.5" />}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete rule "${rule.name}"?`)) deleteRule.mutate(rule.id)
                          }}
                          title="Delete"
                          className="rounded border border-red-200 p-1.5 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* ── Create rule modal ──────────────────────────────────────────────────── */}
      {showCreateRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Create Alert Rule</h2>
              <button onClick={() => setShowCreateRule(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <FormField label="Name *">
                <input
                  value={ruleForm.name}
                  onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
                  placeholder="e.g. Excessive delete actions"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </FormField>
              <FormField label="Description">
                <input
                  value={ruleForm.description}
                  onChange={(e) => setRuleForm({ ...ruleForm, description: e.target.value })}
                  placeholder="What does this rule detect?"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </FormField>
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Service filter">
                  <select value={ruleForm.service} onChange={(e) => setRuleForm({ ...ruleForm, service: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option value="">Any service</option>
                    {['emr', 'crm', 'admin', 'auth'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </FormField>
                <FormField label="Action filter">
                  <select value={ruleForm.action} onChange={(e) => setRuleForm({ ...ruleForm, action: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option value="">Any action</option>
                    {['create', 'update', 'delete', 'view'].map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </FormField>
                <FormField label="Entity type filter">
                  <input
                    value={ruleForm.entityType}
                    onChange={(e) => setRuleForm({ ...ruleForm, entityType: e.target.value })}
                    placeholder="e.g. member"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </FormField>
                <FormField label="Severity">
                  <select value={ruleForm.severity} onChange={(e) => setRuleForm({ ...ruleForm, severity: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    {['low', 'medium', 'high', 'critical'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </FormField>
                <FormField label="Threshold (events)">
                  <input
                    type="number"
                    min={1}
                    value={ruleForm.threshold}
                    onChange={(e) => setRuleForm({ ...ruleForm, threshold: Number(e.target.value) })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </FormField>
                <FormField label="Window (minutes)">
                  <input
                    type="number"
                    min={1}
                    value={ruleForm.windowMinutes}
                    onChange={(e) => setRuleForm({ ...ruleForm, windowMinutes: Number(e.target.value) })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </FormField>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowCreateRule(false)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => createRule.mutate(ruleForm)}
                disabled={!ruleForm.name || createRule.isPending}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {createRule.isPending ? 'Creating…' : 'Create Rule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
    </div>
  )
}

function DistributionTable({ title, rows }: { title: string; rows: Array<{ label: string; count: number }> }) {
  const total = rows.reduce((sum, r) => sum + r.count, 0)
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="mb-3 text-xs font-semibold text-gray-700 uppercase tracking-wide">{title}</p>
      <div className="space-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-2">
            <span className="flex-1 truncate text-xs capitalize text-gray-600">{row.label.replace(/_/g, ' ')}</span>
            <span className="text-xs font-medium text-gray-900">{row.count}</span>
            <span className="w-10 text-right text-[10px] text-gray-400">
              {total > 0 ? Math.round((row.count / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}
