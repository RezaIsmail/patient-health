import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Webhook, Plus, X, Trash2, Zap, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'

// ─── Types ────────────────────────────────────────────────────────────────────

interface WebhookEndpoint {
  id: string
  name: string
  url: string
  secret: string
  events: string[]
  isActive: boolean
  description?: string
  createdAt: string
  _count: { deliveries: number }
}

interface WebhookDelivery {
  id: string
  eventType: string
  httpStatus?: number
  deliveredAt?: string
  failedAt?: string
  createdAt: string
}

interface WebhookDetail extends WebhookEndpoint {
  deliveries: WebhookDelivery[]
}

interface PingResult {
  ok: boolean
  httpStatus: number | null
  message: string
}

const EVENT_TYPES = [
  'contact.created',
  'contact.updated',
  'contact.risk_level_changed',
  'referral.stage_changed',
  'care_plan.activated',
  'care_plan.completed',
  'care_gap.opened',
  'care_gap.closed',
  'campaign.launched',
  'campaign.completed',
  'task.completed',
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function WebhooksPage() {
  const qc = useQueryClient()
  const [selected, setSelected] = useState<WebhookDetail | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [pingResult, setPingResult] = useState<PingResult | null>(null)
  const [form, setForm] = useState({
    name: '',
    url: '',
    description: '',
    events: [] as string[],
    createdBy: 'current-user',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['webhooks'],
    queryFn: () =>
      api.get<{ data: WebhookEndpoint[] }>('/api/webhooks').then((r) => r.data),
  })

  const fetchDetail = useMutation({
    mutationFn: (id: string) =>
      api.get<{ data: WebhookDetail }>(`/api/webhooks/${id}`).then((r) => r.data.data),
    onSuccess: (d) => setSelected(d),
  })

  const createWebhook = useMutation({
    mutationFn: (data: typeof form) => api.post('/api/webhooks', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['webhooks'] })
      setShowCreate(false)
      setForm({ name: '', url: '', description: '', events: [], createdBy: 'current-user' })
    },
  })

  const toggleActive = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.patch(`/api/webhooks/${id}`, { isActive: !isActive }),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['webhooks'] })
      fetchDetail.mutate(id)
    },
  })

  const deleteWebhook = useMutation({
    mutationFn: (id: string) => api.delete(`/api/webhooks/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['webhooks'] })
      setSelected(null)
    },
  })

  const pingWebhook = useMutation({
    mutationFn: (id: string) =>
      api.post<{ data: PingResult }>(`/api/webhooks/${id}/ping`, {}).then((r) => r.data.data),
    onSuccess: (result) => setPingResult(result),
  })

  const toggleEvent = (event: string) => {
    setForm((f) => ({
      ...f,
      events: f.events.includes(event)
        ? f.events.filter((e) => e !== event)
        : [...f.events, event],
    }))
  }

  const endpoints = data?.data ?? []

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <Webhook className="h-5 w-5 text-gray-400" />
          <div>
            <h1 className="text-base font-semibold text-gray-900">Webhook Endpoints</h1>
            <p className="text-xs text-gray-500">
              Receive real-time events when data changes in the CRM
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Endpoint
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Endpoint list */}
        <div className="w-72 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
          {isLoading ? (
            <div className="space-y-2 p-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded" />)}
            </div>
          ) : endpoints.length === 0 ? (
            <div className="p-8 text-center">
              <Webhook className="mx-auto mb-2 h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-500">No endpoints configured</p>
              <p className="mt-1 text-xs text-gray-400">
                Add an endpoint to start receiving events
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {endpoints.map((ep) => (
                <li key={ep.id}>
                  <button
                    onClick={() => fetchDetail.mutate(ep.id)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 ${
                      selected?.id === ep.id ? 'bg-indigo-50' : ''
                    }`}
                  >
                    <div
                      className={`mt-0.5 h-2 w-2 flex-shrink-0 rounded-full ${
                        ep.isActive ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{ep.name}</p>
                      <p className="truncate text-xs text-gray-400">{ep.url}</p>
                      <p className="mt-0.5 text-[10px] text-gray-400">
                        {ep.events.length} event{ep.events.length !== 1 ? 's' : ''} · {ep._count.deliveries} deliveries
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Detail panel */}
        <div className="flex flex-1 flex-col overflow-hidden bg-gray-50">
          {!selected ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <Webhook className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                <p className="text-sm text-gray-500">Select an endpoint to view details</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6">
              {/* Title */}
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-gray-900">{selected.name}</h2>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        selected.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {selected.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{selected.url}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setPingResult(null)
                      pingWebhook.mutate(selected.id)
                    }}
                    disabled={pingWebhook.isPending}
                    className="flex items-center gap-1.5 rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-white disabled:opacity-50"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    {pingWebhook.isPending ? 'Sending…' : 'Ping'}
                  </button>
                  <button
                    onClick={() => toggleActive.mutate({ id: selected.id, isActive: selected.isActive })}
                    className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-white"
                  >
                    {selected.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this webhook endpoint?')) {
                        deleteWebhook.mutate(selected.id)
                      }
                    }}
                    className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Ping result */}
              {pingResult && (
                <div
                  className={`mb-4 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm ${
                    pingResult.ok
                      ? 'border-green-200 bg-green-50 text-green-800'
                      : 'border-red-200 bg-red-50 text-red-800'
                  }`}
                >
                  {pingResult.ok ? (
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600" />
                  )}
                  <span>
                    {pingResult.message}
                    {pingResult.httpStatus && ` (HTTP ${pingResult.httpStatus})`}
                  </span>
                </div>
              )}

              {/* Signing secret */}
              <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
                <p className="mb-1 text-xs font-medium text-gray-700">Signing secret</p>
                <code className="text-sm text-gray-600">{selected.secret}</code>
                <p className="mt-1 text-xs text-gray-400">
                  Verify the <code>X-Signature</code> header on incoming requests using HMAC-SHA256
                </p>
              </div>

              {/* Subscribed events */}
              <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
                <p className="mb-2 text-xs font-medium text-gray-700">Subscribed events</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.events.map((e) => (
                    <span
                      key={e}
                      className="inline-flex rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent deliveries */}
              <div className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-100 px-4 py-2.5">
                  <p className="text-xs font-medium text-gray-700">Recent deliveries</p>
                </div>
                {selected.deliveries.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">No deliveries yet</div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {selected.deliveries.map((d) => (
                      <li key={d.id} className="flex items-center gap-3 px-4 py-2.5">
                        {d.deliveredAt ? (
                          <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                        ) : d.failedAt ? (
                          <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                        ) : (
                          <Clock className="h-4 w-4 flex-shrink-0 text-gray-400" />
                        )}
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900">{d.eventType}</span>
                          {d.httpStatus && (
                            <span className="ml-2 text-xs text-gray-400">HTTP {d.httpStatus}</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(d.createdAt).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Add Webhook Endpoint</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="My integration"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">URL *</label>
                <input
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  placeholder="https://example.com/webhooks/crm"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What system will receive these events?"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-700">
                  Events to subscribe * ({form.events.length} selected)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {EVENT_TYPES.map((event) => (
                    <label key={event} className="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={form.events.includes(event)}
                        onChange={() => toggleEvent(event)}
                        className="h-3.5 w-3.5 rounded border-gray-300 text-indigo-600"
                      />
                      <span className="text-xs text-gray-700">{event}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => createWebhook.mutate(form)}
                disabled={!form.name || !form.url || form.events.length === 0 || createWebhook.isPending}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {createWebhook.isPending ? 'Creating…' : 'Create Endpoint'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
