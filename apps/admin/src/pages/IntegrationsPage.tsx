import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plug, RefreshCw, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'
import { format } from 'date-fns'

interface IntegrationStatus {
  name: string
  displayName: string
  status: 'healthy' | 'degraded' | 'down'
  lastSync: string
  errorRateLastHour: number
  latencyP95Ms: number
  messageQueueDepth: number
  description: string
}

interface IntegrationsData {
  integrations: IntegrationStatus[]
  overall: 'healthy' | 'degraded' | 'down'
  checkedAt: string
}

const STATUS_CONFIG: Record<
  string,
  { dot: string; label: string; card: string; text: string }
> = {
  healthy: {
    dot: 'bg-green-500',
    label: 'Healthy',
    card: 'border-gray-200',
    text: 'text-green-600',
  },
  degraded: {
    dot: 'bg-amber-500',
    label: 'Degraded',
    card: 'border-amber-200 bg-amber-50/30',
    text: 'text-amber-600',
  },
  down: {
    dot: 'bg-red-500',
    label: 'Down',
    card: 'border-red-200 bg-red-50/30',
    text: 'text-red-600',
  },
}

// 7-day simulated uptime (1 = up, 0 = down, 0.5 = degraded)
function getMockUptimeBars(name: string): number[] {
  const base = name === 'sms-provider' ? [1, 1, 1, 0.5, 0.5, 0.5, 0.5] : [1, 1, 1, 1, 1, 1, 1]
  return base
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

// Mock recent integration errors
const MOCK_ERRORS = [
  {
    id: '1',
    integration: 'sms-provider',
    type: 'delivery_failure',
    message: 'Twilio API returned 429 Too Many Requests — rate limit hit during bulk send',
    timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: '2',
    integration: 'sms-provider',
    type: 'timeout',
    message: 'SMS delivery confirmation timed out after 30s for 3 messages',
    timestamp: new Date(Date.now() - 28 * 60000).toISOString(),
  },
  {
    id: '3',
    integration: 'email-provider',
    type: 'bounce',
    message: 'SendGrid reported 2 hard bounces in the last hour',
    timestamp: new Date(Date.now() - 55 * 60000).toISOString(),
  },
]

export default function IntegrationsPage() {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<{ data: IntegrationsData }>({
    queryKey: ['admin-integrations'],
    queryFn: () => api.get('/api/integrations/status').then((r) => r.data),
    refetchInterval: 60_000,
  })

  const resyncMutation = useMutation({
    mutationFn: (name: string) =>
      api.post(`/api/integrations/${name}/resync`).then((r) => r.data),
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ['admin-integrations'] }), 3000)
    },
  })

  const integrations = data?.data?.integrations ?? []
  const overall = data?.data?.overall ?? 'healthy'
  const checkedAt = data?.data?.checkedAt

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-2">
          <Plug className="h-4 w-4 text-indigo-600" />
          <h1 className="text-base font-semibold text-gray-900">Integrations</h1>
          {checkedAt && (
            <span className="text-xs text-gray-400">
              · checked {formatRelativeTime(checkedAt)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {overall === 'healthy' ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          )}
          <span
            className={`text-sm font-medium ${
              overall === 'healthy'
                ? 'text-green-600'
                : overall === 'degraded'
                  ? 'text-amber-600'
                  : 'text-red-600'
            }`}
          >
            {overall === 'healthy'
              ? 'All systems operational'
              : overall === 'degraded'
                ? 'Partial degradation'
                : 'Critical issues detected'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Integration Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {integrations.map((intg) => {
              const cfg = STATUS_CONFIG[intg.status] ?? STATUS_CONFIG.healthy
              const uptimeBars = getMockUptimeBars(intg.name)
              const isResyncing =
                resyncMutation.isPending && resyncMutation.variables === intg.name

              return (
                <div
                  key={intg.name}
                  className={`rounded-xl border bg-white p-5 ${cfg.card}`}
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${cfg.dot} flex-shrink-0`} />
                        <h3 className="font-medium text-gray-900 text-sm">{intg.displayName}</h3>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5 ml-4.5">{intg.description}</p>
                    </div>
                    <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="rounded-lg bg-gray-50 px-2 py-2 text-center">
                      <p className="text-xs font-bold text-gray-800">{intg.latencyP95Ms}ms</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">P95 latency</p>
                    </div>
                    <div
                      className={`rounded-lg px-2 py-2 text-center ${intg.errorRateLastHour > 2 ? 'bg-red-50' : 'bg-gray-50'}`}
                    >
                      <p
                        className={`text-xs font-bold ${intg.errorRateLastHour > 2 ? 'text-red-700' : 'text-gray-800'}`}
                      >
                        {intg.errorRateLastHour}%
                      </p>
                      <p className="text-[9px] text-gray-400 mt-0.5">Error rate/hr</p>
                    </div>
                    <div
                      className={`rounded-lg px-2 py-2 text-center ${intg.messageQueueDepth > 20 ? 'bg-amber-50' : 'bg-gray-50'}`}
                    >
                      <p
                        className={`text-xs font-bold ${intg.messageQueueDepth > 20 ? 'text-amber-700' : 'text-gray-800'}`}
                      >
                        {intg.messageQueueDepth}
                      </p>
                      <p className="text-[9px] text-gray-400 mt-0.5">Queue depth</p>
                    </div>
                  </div>

                  {/* 7-day uptime bars */}
                  <div className="mb-3">
                    <p className="text-[9px] text-gray-400 mb-1 uppercase tracking-wide">
                      7-day uptime
                    </p>
                    <div className="flex items-end gap-0.5 h-6">
                      {uptimeBars.map((v, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-sm transition-all ${
                            v === 1
                              ? 'bg-green-400'
                              : v === 0.5
                                ? 'bg-amber-400'
                                : 'bg-red-400'
                          }`}
                          style={{ height: `${v === 0 ? 25 : v === 0.5 ? 60 : 100}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-0.5">
                      {['7d', '6d', '5d', '4d', '3d', '2d', 'now'].map((d) => (
                        <span key={d} className="text-[8px] text-gray-300">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Clock className="h-2.5 w-2.5" />
                      <span>Last sync {formatRelativeTime(intg.lastSync)}</span>
                    </div>
                    <button
                      onClick={() => resyncMutation.mutate(intg.name)}
                      disabled={isResyncing}
                      className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-[10px] font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                      <RefreshCw className={`h-2.5 w-2.5 ${isResyncing ? 'animate-spin' : ''}`} />
                      {isResyncing ? 'Queued…' : 'Re-sync'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Error Feed */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-gray-900">Recent Integration Errors</h2>
          </div>

          {MOCK_ERRORS.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <CheckCircle className="h-8 w-8 mb-2 text-green-400" />
              <p className="text-sm">No recent errors — all integrations healthy</p>
            </div>
          ) : (
            <div className="space-y-2">
              {MOCK_ERRORS.map((err) => {
                const intgStatus = integrations.find((i) => i.name === err.integration)?.status
                return (
                  <div
                    key={err.id}
                    className="flex items-start gap-3 rounded-lg border border-red-100 bg-red-50/50 px-4 py-3"
                  >
                    <AlertTriangle className="h-3.5 w-3.5 mt-0.5 text-red-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-semibold text-red-700 uppercase">
                          {err.integration}
                        </span>
                        <span
                          className={`rounded px-1 py-0.5 text-[9px] font-medium ${
                            STATUS_CONFIG[intgStatus ?? 'down'].text
                          } bg-white border border-gray-100`}
                        >
                          {err.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700">{err.message}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 flex-shrink-0">
                      {formatRelativeTime(err.timestamp)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Resync success notification */}
        {resyncMutation.isSuccess && (
          <div className="fixed bottom-6 right-6 flex items-center gap-2 rounded-lg border border-green-200 bg-white px-4 py-3 shadow-lg">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <p className="text-sm text-gray-700">
              Resync queued — job ID:{' '}
              <span className="font-mono text-xs">
                {(resyncMutation.data as { data?: { jobId?: string } })?.data?.jobId?.slice(0, 8)}…
              </span>
            </p>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center">
          Last checked:{' '}
          {checkedAt ? format(new Date(checkedAt), 'MMM d, yyyy HH:mm:ss') : '—'} · Auto-refreshes
          every minute
        </p>
      </div>
    </div>
  )
}
