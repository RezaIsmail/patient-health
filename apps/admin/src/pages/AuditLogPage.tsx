import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FileText, Download, ChevronDown, ChevronRight, Search, X } from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'
import { format } from 'date-fns'

interface FieldChange {
  field: string
  oldValue: unknown
  newValue: unknown
}

interface AuditEvent {
  id: string
  eventId: string
  timestamp: string
  service: string
  entityType: string
  entityId?: string
  action: string
  actorId: string
  actorRole?: string
  correlationId?: string
  ipAddress?: string
  fieldChanges?: FieldChange[]
  memberId?: string
  notes?: string
}

interface Meta {
  page: number
  limit: number
  total: number
  totalPages: number
}

const SERVICE_CONFIG: Record<string, string> = {
  emr: 'bg-blue-100 text-blue-700',
  crm: 'bg-emerald-100 text-emerald-700',
  admin: 'bg-indigo-100 text-indigo-700',
  auth: 'bg-violet-100 text-violet-700',
}

const ACTION_CONFIG: Record<string, string> = {
  create: 'bg-green-100 text-green-700',
  update: 'bg-amber-100 text-amber-700',
  delete: 'bg-red-100 text-red-700',
  view: 'bg-gray-100 text-gray-600',
}

interface HipaaReportData {
  member?: { id: string; memberNumber: string; firstName: string; lastName: string }
  events: AuditEvent[]
  totalEvents: number
  reportGeneratedAt: string
}

export default function AuditLogPage() {
  const [serviceFilter, setServiceFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [entityTypeFilter, setEntityTypeFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [searchId, setSearchId] = useState('')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const [showHipaaModal, setShowHipaaModal] = useState(false)
  const [hipaaMemberId, setHipaaMemberId] = useState('')
  const [hipaaQueried, setHipaaQueried] = useState(false)

  const queryParams = {
    service: serviceFilter || undefined,
    action: actionFilter || undefined,
    entityType: entityTypeFilter || undefined,
    dateFrom: dateFrom ? new Date(dateFrom).toISOString() : undefined,
    dateTo: dateTo ? new Date(dateTo).toISOString() : undefined,
    actorId: searchId || undefined,
    page,
    limit: 50,
  }

  const { data, isLoading } = useQuery<{ data: AuditEvent[]; meta: Meta }>({
    queryKey: ['admin-audit', queryParams],
    queryFn: () =>
      api
        .get('/api/audit', {
          params: Object.fromEntries(
            Object.entries(queryParams).filter(([, v]) => v !== undefined)
          ),
        })
        .then((r) => r.data),
  })

  const { data: hipaaData, isLoading: hipaaLoading } = useQuery<{ data: HipaaReportData }>({
    queryKey: ['admin-hipaa-report', hipaaMemberId],
    queryFn: () => api.get(`/api/audit/member/${hipaaMemberId}`).then((r) => r.data),
    enabled: hipaaQueried && !!hipaaMemberId,
  })

  const events = data?.data ?? []
  const meta = data?.meta

  function handleExport() {
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(queryParams)
          .filter(([k, v]) => v !== undefined && k !== 'page' && k !== 'limit')
          .map(([k, v]) => [k, String(v)])
      )
    )
    window.open(`/api/audit/export?${params.toString()}`, '_blank')
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-indigo-600" />
          <h1 className="text-base font-semibold text-gray-900">Audit Log</h1>
          {meta && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
              {meta.total.toLocaleString()} events
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHipaaModal(true)}
            className="flex items-center gap-1.5 rounded-md border border-indigo-300 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition-colors"
          >
            HIPAA Report
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 border-b border-gray-200 bg-white px-6 py-3">
        <select
          value={serviceFilter}
          onChange={(e) => { setServiceFilter(e.target.value); setPage(1) }}
          className="rounded-md border border-gray-300 py-1.5 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All services</option>
          <option value="emr">EMR</option>
          <option value="crm">CRM</option>
          <option value="admin">Admin</option>
          <option value="auth">Auth</option>
        </select>

        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}
          className="rounded-md border border-gray-300 py-1.5 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
          <option value="view">View</option>
        </select>

        <input
          type="text"
          placeholder="Entity type…"
          value={entityTypeFilter}
          onChange={(e) => { setEntityTypeFilter(e.target.value); setPage(1) }}
          className="rounded-md border border-gray-300 py-1.5 px-3 text-sm w-32 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        <div className="flex items-center gap-1">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
            className="rounded-md border border-gray-300 py-1.5 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <span className="text-gray-400 text-xs">to</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
            className="rounded-md border border-gray-300 py-1.5 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
          <input
            type="text"
            placeholder="Actor ID…"
            value={searchId}
            onChange={(e) => { setSearchId(e.target.value); setPage(1) }}
            className="w-36 rounded-md border border-gray-300 py-1.5 pl-7 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-6 space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <FileText className="h-12 w-12 mb-3" />
            <p className="text-base font-medium text-gray-600">No audit events found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="w-8 px-4 py-3" />
                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide">
                  Timestamp
                </th>
                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide">
                  Service
                </th>
                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide">
                  Entity Type
                </th>
                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide">
                  Action
                </th>
                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide">
                  Actor
                </th>
                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide">
                  Entity ID
                </th>
                <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide">
                  Correlation ID
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((event) => (
                <>
                  <tr
                    key={event.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
                  >
                    <td className="px-4 py-2.5">
                      {expandedId === event.id ? (
                        <ChevronDown className="h-3 w-3 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-gray-400" />
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-gray-500 whitespace-nowrap">
                      {format(new Date(event.timestamp), 'MMM d, HH:mm:ss')}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${SERVICE_CONFIG[event.service] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        {event.service}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-gray-700">{event.entityType}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${ACTION_CONFIG[event.action] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        {event.action}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-gray-400">
                      {event.actorId.slice(0, 8)}…
                    </td>
                    <td className="px-4 py-2.5 font-mono text-gray-400 max-w-[120px] truncate">
                      {event.entityId?.slice(0, 8) ?? '—'}…
                    </td>
                    <td className="px-4 py-2.5 font-mono text-gray-300 max-w-[120px] truncate">
                      {event.correlationId?.slice(0, 8) ?? '—'}…
                    </td>
                  </tr>

                  {expandedId === event.id && (
                    <tr key={`${event.id}-expand`}>
                      <td colSpan={8} className="bg-indigo-50 px-12 py-3">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wide mb-1">
                              Event Details
                            </p>
                            <div className="space-y-0.5 text-xs text-gray-600">
                              <p>
                                <span className="font-medium">Event ID:</span>{' '}
                                <span className="font-mono">{event.eventId}</span>
                              </p>
                              <p>
                                <span className="font-medium">Actor Role:</span>{' '}
                                {event.actorRole ?? '—'}
                              </p>
                              <p>
                                <span className="font-medium">IP Address:</span>{' '}
                                {event.ipAddress ?? '—'}
                              </p>
                              {event.notes && (
                                <p>
                                  <span className="font-medium">Notes:</span> {event.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          {event.fieldChanges && event.fieldChanges.length > 0 && (
                            <div>
                              <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wide mb-1">
                                Field Changes
                              </p>
                              <div className="space-y-1">
                                {event.fieldChanges.map((fc, i) => (
                                  <div key={i} className="text-xs">
                                    <span className="font-medium text-gray-700">{fc.field}:</span>{' '}
                                    <span className="text-red-600 line-through">
                                      {String(fc.oldValue ?? '—')}
                                    </span>{' '}
                                    <span className="text-gray-400">→</span>{' '}
                                    <span className="text-green-600">
                                      {String(fc.newValue ?? '—')}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
          <p className="text-xs text-gray-500">
            Page {meta.page} of {meta.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* HIPAA Report Modal */}
      {showHipaaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">HIPAA Access Report</h2>
              <button
                onClick={() => {
                  setShowHipaaModal(false)
                  setHipaaMemberId('')
                  setHipaaQueried(false)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <input
                type="text"
                placeholder="Enter Member ID (UUID)…"
                value={hipaaMemberId}
                onChange={(e) => setHipaaMemberId(e.target.value)}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={() => setHipaaQueried(true)}
                disabled={!hipaaMemberId || hipaaLoading}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                Generate
              </button>
            </div>

            {hipaaQueried && (
              <div className="flex-1 overflow-auto">
                {hipaaLoading ? (
                  <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : hipaaData?.data.member ? (
                  <>
                    <div className="mb-3 rounded-lg bg-indigo-50 px-4 py-3">
                      <p className="text-xs font-semibold text-indigo-700">
                        Report for: {hipaaData.data.member.firstName}{' '}
                        {hipaaData.data.member.lastName} —{' '}
                        <span className="font-mono">{hipaaData.data.member.memberNumber}</span>
                      </p>
                      <p className="text-[10px] text-indigo-500 mt-0.5">
                        {hipaaData.data.totalEvents} total access events · Generated{' '}
                        {format(new Date(hipaaData.data.reportGeneratedAt), 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>

                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 text-left">
                          <th className="px-3 py-2 font-semibold text-gray-500">Timestamp</th>
                          <th className="px-3 py-2 font-semibold text-gray-500">Service</th>
                          <th className="px-3 py-2 font-semibold text-gray-500">Entity</th>
                          <th className="px-3 py-2 font-semibold text-gray-500">Action</th>
                          <th className="px-3 py-2 font-semibold text-gray-500">Actor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {hipaaData.data.events.map((event) => (
                          <tr key={event.id}>
                            <td className="px-3 py-2 text-gray-500">
                              {format(new Date(event.timestamp), 'MMM d, yyyy HH:mm')}
                            </td>
                            <td className="px-3 py-2">
                              <span
                                className={`rounded px-1 py-0.5 text-[9px] font-semibold uppercase ${SERVICE_CONFIG[event.service] ?? 'bg-gray-100 text-gray-600'}`}
                              >
                                {event.service}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-gray-700">{event.entityType}</td>
                            <td className="px-3 py-2">
                              <span
                                className={`rounded px-1 py-0.5 text-[9px] font-medium ${ACTION_CONFIG[event.action] ?? 'bg-gray-100 text-gray-600'}`}
                              >
                                {event.action}
                              </span>
                            </td>
                            <td className="px-3 py-2 font-mono text-gray-400">
                              {event.actorId.slice(0, 8)}…
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : hipaaQueried ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <FileText className="h-8 w-8 mb-2" />
                    <p className="text-sm">Member not found or no events recorded</p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
