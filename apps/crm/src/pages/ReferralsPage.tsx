import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, Clock, AlertCircle, User } from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'
import { format, differenceInDays } from 'date-fns'

interface Contact {
  id: string
  firstName: string
  lastName: string
  riskLevel: string
  phone?: string
  dateOfBirth?: string
}

interface Referral {
  id: string
  referralNumber: string
  contactId: string
  type: string
  stage: string
  priority: string
  referringOrgName?: string
  receivingOrgName?: string
  reasonDisplay: string
  dueDate?: string
  assignedTo?: string
  createdAt: string
  contact?: Contact
}

type BoardData = Record<string, Referral[]>

const STAGE_CONFIG: Record<string, { label: string; color: string; borderColor: string }> = {
  received: { label: 'Received', color: 'bg-gray-50', borderColor: 'border-gray-300' },
  reviewing: { label: 'Reviewing', color: 'bg-blue-50', borderColor: 'border-blue-300' },
  authorized: { label: 'Authorized', color: 'bg-amber-50', borderColor: 'border-amber-300' },
  scheduled: { label: 'Scheduled', color: 'bg-emerald-50', borderColor: 'border-emerald-300' },
}

const PRIORITY_BADGE: Record<string, string> = {
  emergent: 'bg-red-100 text-red-700',
  urgent: 'bg-orange-100 text-orange-700',
  routine: 'bg-gray-100 text-gray-600',
}

const RISK_DOT: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-400',
  medium: 'bg-yellow-400',
  low: 'bg-emerald-400',
}

export default function ReferralsPage() {
  const [view, setView] = useState<'board' | 'list'>('board')
  const queryClient = useQueryClient()

  const boardQuery = useQuery<{ data: BoardData }>({
    queryKey: ['referrals-board'],
    queryFn: () => api.get('/api/referrals/board').then((r) => r.data),
    enabled: view === 'board',
  })

  const listQuery = useQuery<{ data: Referral[] }>({
    queryKey: ['referrals-list'],
    queryFn: () => api.get('/api/referrals?pageSize=100').then((r) => r.data),
    enabled: view === 'list',
  })

  const stageMutation = useMutation({
    mutationFn: ({ id, stage }: { id: string; stage: string }) =>
      api.patch(`/api/referrals/${id}/stage`, { stage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['referrals-board'] })
      queryClient.invalidateQueries({ queryKey: ['referrals-list'] })
    },
  })

  const STAGES = Object.keys(STAGE_CONFIG)

  const board = boardQuery.data?.data
  const referrals = listQuery.data?.data ?? []

  const getSLAStatus = (createdAt: string) => {
    const age = differenceInDays(new Date(), new Date(createdAt))
    if (age > 7) return 'red'
    if (age > 3) return 'amber'
    return 'green'
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-base font-semibold text-gray-900">Referrals</h1>
          <div className="flex rounded-md border border-gray-200 p-0.5">
            {(['board', 'list'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors capitalize ${
                  view === v ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">
          <Plus className="h-3.5 w-3.5" />
          New Referral
        </button>
      </div>

      {/* Board View */}
      {view === 'board' && (
        <div className="flex-1 overflow-x-auto p-6">
          {boardQuery.isLoading ? (
            <div className="flex gap-4">
              {STAGES.map((s) => <Skeleton key={s} className="h-96 w-64 flex-shrink-0 rounded-xl" />)}
            </div>
          ) : (
            <div className="flex gap-4 h-full min-h-0">
              {STAGES.map((stage) => {
                const cfg = STAGE_CONFIG[stage]
                const items = board?.[stage] ?? []
                return (
                  <div key={stage} className={`flex w-72 flex-shrink-0 flex-col rounded-xl border-2 ${cfg.borderColor} ${cfg.color}`}>
                    {/* Column header */}
                    <div className="flex items-center justify-between px-3 py-2.5 border-b border-black/5">
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">{cfg.label}</span>
                      <span className="text-xs font-bold text-gray-500 bg-white/70 rounded-full px-2 py-0.5">{items.length}</span>
                    </div>

                    {/* Cards */}
                    <div className="flex-1 overflow-y-auto space-y-2 p-2">
                      {items.length === 0 && (
                        <div className="text-center py-8 text-gray-300 text-xs">No referrals</div>
                      )}
                      {items.map((ref) => {
                        const sla = getSLAStatus(ref.createdAt)
                        const contact = ref.contact
                        return (
                          <div key={ref.id} className="rounded-lg border border-white/80 bg-white shadow-sm p-3">
                            {/* Priority + SLA */}
                            <div className="flex items-center justify-between mb-2">
                              <span className={`text-[10px] font-semibold rounded px-1.5 py-0.5 ${PRIORITY_BADGE[ref.priority]}`}>
                                {ref.priority}
                              </span>
                              <div className={`h-2 w-2 rounded-full ${
                                sla === 'red' ? 'bg-red-500' : sla === 'amber' ? 'bg-amber-400' : 'bg-emerald-400'
                              }`} title={`Age: ${differenceInDays(new Date(), new Date(ref.createdAt))} days`} />
                            </div>

                            {/* Contact */}
                            {contact && (
                              <Link to={`/contacts/${contact.id}`} className="flex items-center gap-1.5 mb-1.5 group">
                                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${RISK_DOT[contact.riskLevel] ?? 'bg-gray-300'}`} />
                                <span className="text-xs font-semibold text-gray-800 group-hover:text-emerald-700 truncate">
                                  {contact.firstName} {contact.lastName}
                                </span>
                              </Link>
                            )}

                            {/* Reason */}
                            <p className="text-xs text-gray-600 truncate mb-2">{ref.reasonDisplay}</p>

                            {/* Metadata */}
                            <div className="text-[10px] text-gray-400 space-y-0.5">
                              <span className="font-mono">{ref.referralNumber}</span>
                              {ref.referringOrgName && (
                                <div className="flex items-center gap-1">
                                  <User className="h-2.5 w-2.5" />
                                  {ref.referringOrgName}
                                </div>
                              )}
                              {ref.dueDate && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-2.5 w-2.5" />
                                  Due {format(new Date(ref.dueDate), 'MMM d')}
                                </div>
                              )}
                            </div>

                            {/* Stage actions */}
                            <div className="mt-2 flex gap-1">
                              {STAGES.filter((s) => s !== stage).slice(0, 2).map((nextStage) => (
                                <button
                                  key={nextStage}
                                  onClick={() => stageMutation.mutate({ id: ref.id, stage: nextStage })}
                                  disabled={stageMutation.isPending}
                                  className="flex-1 rounded text-[10px] font-medium py-0.5 border border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
                                >
                                  → {STAGE_CONFIG[nextStage]?.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {/* Terminal stage info */}
              <div className="flex w-48 flex-shrink-0 flex-col rounded-xl border-2 border-dashed border-gray-200 items-center justify-center text-gray-300 text-xs text-center p-4">
                <AlertCircle className="h-6 w-6 mb-2" />
                Completed, Declined & Cancelled referrals are archived
              </div>
            </div>
          )}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="flex-1 overflow-auto">
          {listQuery.isLoading ? (
            <div className="p-6 space-y-2">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Referral #</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Stage</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {referrals.map((ref) => {
                  const age = differenceInDays(new Date(), new Date(ref.createdAt))
                  return (
                    <tr key={ref.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono text-xs text-gray-600">{ref.referralNumber}</td>
                      <td className="px-4 py-3">
                        {ref.contact ? (
                          <Link to={`/contacts/${ref.contact.id}`} className="text-sm font-medium text-emerald-700 hover:underline">
                            {ref.contact.firstName} {ref.contact.lastName}
                          </Link>
                        ) : <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{ref.reasonDisplay}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${PRIORITY_BADGE[ref.priority]}`}>
                          {ref.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium text-gray-600 capitalize">{ref.stage}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium ${age > 7 ? 'text-red-600' : age > 3 ? 'text-amber-600' : 'text-gray-500'}`}>
                          {age}d
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
