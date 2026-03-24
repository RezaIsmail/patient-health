import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import {
  Inbox,
  PenLine,
  FlaskConical,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  RefreshCw,
} from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'
import { format } from 'date-fns'
import type { InboxItemDto } from '@patient-health/types'

export default function InboxPage() {
  const qc = useQueryClient()
  const navigate = useNavigate()

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['inbox'],
    queryFn: () =>
      api.get<{ data: InboxItemDto[]; meta: { total: number } }>('/api/inbox').then((r) => r.data),
    refetchInterval: 60_000,
  })

  const reviewResult = useMutation({
    mutationFn: (id: string) => api.post(`/api/observations/${id}/review`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inbox'] }),
  })

  const items = data?.data ?? []
  const unsigned = items.filter((i) => i.itemType === 'unsigned_encounter')
  const results = items.filter((i) => i.itemType === 'abnormal_result')

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <Inbox className="h-5 w-5 text-gray-400" />
          <div>
            <h1 className="text-base font-semibold text-gray-900">Provider Inbox</h1>
            <p className="text-xs text-gray-500">
              {isLoading ? '…' : `${items.length} item${items.length !== 1 ? 's' : ''} require attention`}
            </p>
          </div>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <CheckCircle className="h-10 w-10 text-green-400" />
            <p className="text-base font-medium text-gray-700">All caught up!</p>
            <p className="text-sm text-gray-500">No unsigned notes or unreviewed results</p>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            {/* Unsigned encounter notes */}
            {unsigned.length > 0 && (
              <section>
                <div className="mb-2 flex items-center gap-2">
                  <PenLine className="h-4 w-4 text-blue-500" />
                  <h2 className="text-sm font-semibold text-gray-800">Unsigned Notes</h2>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                    {unsigned.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {unsigned.map((item) => (
                    <InboxCard
                      key={item.id}
                      item={item}
                      icon={<PenLine className="h-4 w-4 text-blue-500" />}
                      actionLabel="Open Note"
                      onAction={() => navigate(`/patients/${item.patientId}/encounters/${item.id}`)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Abnormal results */}
            {results.length > 0 && (
              <section>
                <div className="mb-2 flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-red-500" />
                  <h2 className="text-sm font-semibold text-gray-800">Unreviewed Abnormal Results</h2>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-[10px] font-bold text-red-700">
                    {results.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {results.map((item) => (
                    <InboxCard
                      key={item.id}
                      item={item}
                      icon={<AlertTriangle className="h-4 w-4 text-red-500" />}
                      actionLabel="View Chart"
                      onAction={() => navigate(`/patients/${item.patientId}`)}
                      secondaryAction={{
                        label: reviewResult.isPending ? 'Acknowledging…' : 'Acknowledge',
                        onClick: () => reviewResult.mutate(item.id),
                      }}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Inbox card ───────────────────────────────────────────────────────────────

function InboxCard({
  item,
  icon,
  actionLabel,
  onAction,
  secondaryAction,
}: {
  item: InboxItemDto
  icon: React.ReactNode
  actionLabel: string
  onAction: () => void
  secondaryAction?: { label: string; onClick: () => void }
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-300">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p className="text-sm font-medium text-gray-900">{item.patientName}</p>
          <span className="text-xs text-gray-400">MRN: {item.mrn}</span>
        </div>
        <p className="mt-0.5 text-sm text-gray-600">{item.summary}</p>
        <p className="mt-1 text-xs text-gray-400">
          {format(new Date(item.createdAt), 'MMM d, yyyy · h:mm a')}
        </p>
      </div>
      <div className="flex flex-shrink-0 gap-2">
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            {secondaryAction.label}
          </button>
        )}
        <button
          onClick={onAction}
          className="flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700"
        >
          <ExternalLink className="h-3 w-3" />
          {actionLabel}
        </button>
      </div>
    </div>
  )
}
