import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Megaphone, Plus, Send, Pause, CheckCircle } from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'
import { format } from 'date-fns'
import CampaignBuilderModal from '../components/crm/CampaignBuilderModal'

interface Campaign {
  id: string
  name: string
  description?: string
  type: string
  status: string
  sentCount: number
  deliveredCount: number
  openedCount: number
  respondedCount: number
  scheduledAt?: string
  launchedAt?: string
  completedAt?: string
  createdAt: string
  _count?: { members: number }
}

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-600', icon: null },
  scheduled: { label: 'Scheduled', className: 'bg-blue-100 text-blue-700', icon: <Send className="h-3 w-3" /> },
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700', icon: <Send className="h-3 w-3" /> },
  paused: { label: 'Paused', className: 'bg-amber-100 text-amber-700', icon: <Pause className="h-3 w-3" /> },
  completed: { label: 'Completed', className: 'bg-gray-200 text-gray-700', icon: <CheckCircle className="h-3 w-3" /> },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-600', icon: null },
}

const TYPE_ICONS: Record<string, string> = {
  email: '📧',
  sms: '💬',
  phone: '📞',
  multi_channel: '📡',
}

function pct(num: number, denom: number): string {
  if (!denom) return '—'
  return `${Math.round((num / denom) * 100)}%`
}

export default function CampaignsPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [showBuilder, setShowBuilder] = useState(false)
  const queryClient = useQueryClient()

  const query = useQuery<{ data: Campaign[] }>({
    queryKey: ['campaigns', statusFilter],
    queryFn: () => {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)
      params.set('pageSize', '50')
      return api.get(`/api/campaigns?${params}`).then((r) => r.data)
    },
  })

  const launchMutation = useMutation({
    mutationFn: (campaignId: string) => api.post(`/api/campaigns/${campaignId}/launch`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['campaigns'] }),
  })

  const campaigns = query.data?.data ?? []

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-base font-semibold text-gray-900">Campaigns</h1>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All statuses</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button
          onClick={() => setShowBuilder(true)}
          className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Plus className="h-3.5 w-3.5" />
          New Campaign
        </button>
      </div>

      {showBuilder && <CampaignBuilderModal onClose={() => setShowBuilder(false)} />}

      <div className="flex-1 overflow-y-auto p-6">
        {query.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Megaphone className="h-12 w-12 mb-3" />
            <p className="text-base font-medium">No campaigns</p>
            <p className="text-sm mt-1">Create your first outreach campaign</p>
          </div>
        ) : (
          <div className="space-y-3">
            {campaigns.map((campaign) => {
              const cfg = STATUS_CONFIG[campaign.status] ?? STATUS_CONFIG.draft
              const deliveryRate = pct(campaign.deliveredCount, campaign.sentCount)
              const openRate = pct(campaign.openedCount, campaign.deliveredCount)
              const responseRate = pct(campaign.respondedCount, campaign.deliveredCount)

              return (
                <div key={campaign.id} className="rounded-xl border border-gray-200 bg-white p-5">
                  <div className="flex items-start gap-4">
                    {/* Type icon */}
                    <div className="text-2xl">{TYPE_ICONS[campaign.type] ?? '📢'}</div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">{campaign.name}</h3>
                        <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.className}`}>
                          {cfg.icon}
                          {cfg.label}
                        </span>
                        <span className="text-xs text-gray-400 capitalize">{campaign.type.replace('_', ' ')}</span>
                      </div>

                      {campaign.description && (
                        <p className="text-xs text-gray-500 mb-2 truncate">{campaign.description}</p>
                      )}

                      {/* Metrics */}
                      {campaign.sentCount > 0 && (
                        <div className="flex items-center gap-6 text-xs">
                          <div>
                            <span className="font-bold text-gray-800">{campaign.sentCount.toLocaleString()}</span>
                            <span className="text-gray-400 ml-1">sent</span>
                          </div>
                          <div>
                            <span className="font-bold text-gray-800">{deliveryRate}</span>
                            <span className="text-gray-400 ml-1">delivered</span>
                          </div>
                          <div>
                            <span className="font-bold text-emerald-700">{openRate}</span>
                            <span className="text-gray-400 ml-1">open rate</span>
                          </div>
                          <div>
                            <span className="font-bold text-blue-700">{responseRate}</span>
                            <span className="text-gray-400 ml-1">response rate</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-400">
                        <span>Created {format(new Date(campaign.createdAt), 'MMM d, yyyy')}</span>
                        {campaign.launchedAt && <span>Launched {format(new Date(campaign.launchedAt), 'MMM d, yyyy')}</span>}
                        {campaign.scheduledAt && !campaign.launchedAt && (
                          <span className="text-blue-600">Scheduled for {format(new Date(campaign.scheduledAt), 'MMM d, yyyy h:mm a')}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                        <button
                          onClick={() => launchMutation.mutate(campaign.id)}
                          disabled={launchMutation.isPending}
                          className="flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                          <Send className="h-3 w-3" />
                          Launch
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
