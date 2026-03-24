import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { ClipboardList, Plus, ChevronRight } from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'
import { format } from 'date-fns'

interface CarePlan {
  id: string
  contactId: string
  title: string
  status: string
  templateKey?: string
  startDate?: string
  endDate?: string
  assignedTo?: string
  createdAt: string
  contact?: {
    id: string
    firstName: string
    lastName: string
    riskLevel: string
  }
  _count?: {
    problems: number
    goals: number
    interventions: number
  }
}

const STATUS_CONFIG: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-gray-100 text-gray-600',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-600',
}

const RISK_DOT: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-400',
  medium: 'bg-yellow-400',
  low: 'bg-emerald-400',
}

export default function CarePlansPage() {
  const navigate = useNavigate()
  const query = useQuery<{ data: CarePlan[] }>({
    queryKey: ['care-plans'],
    queryFn: () => api.get('/api/care-plans?pageSize=100').then((r) => r.data),
  })

  const plans = query.data?.data ?? []
  const active = plans.filter((p) => p.status === 'active')
  const draft = plans.filter((p) => p.status === 'draft')
  const other = plans.filter((p) => p.status !== 'active' && p.status !== 'draft')

  const groups = [
    { label: 'Active', plans: active },
    { label: 'Draft', plans: draft },
    { label: 'Completed / Cancelled', plans: other },
  ]

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
        <h1 className="text-base font-semibold text-gray-900">Care Plans</h1>
        <button className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">
          <Plus className="h-3.5 w-3.5" />
          New Care Plan
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {query.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}
          </div>
        ) : plans.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ClipboardList className="h-12 w-12 mb-3" />
            <p className="text-base font-medium">No care plans</p>
            <p className="text-sm mt-1">Create care plans from a contact's profile</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map(({ label, plans: groupPlans }) => {
              if (groupPlans.length === 0) return null
              return (
                <div key={label}>
                  <h2 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-3">
                    {label} · {groupPlans.length}
                  </h2>
                  <div className="space-y-2">
                    {groupPlans.map((plan) => (
                      <Link key={plan.id} to={`/care-plans/${plan.id}`} className="rounded-xl border border-gray-200 bg-white p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors hover:border-emerald-200 hover:shadow-sm block">
                        {/* Risk indicator */}
                        {plan.contact && (
                          <div className={`h-3 w-3 rounded-full flex-shrink-0 ${RISK_DOT[plan.contact.riskLevel] ?? 'bg-gray-300'}`} />
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${STATUS_CONFIG[plan.status]}`}>
                              {plan.status}
                            </span>
                            {plan.templateKey && (
                              <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5">
                                {plan.templateKey} template
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-semibold text-gray-900 mt-1">{plan.title}</h3>
                          {plan.contact && (
                            <span
                              role="link"
                              tabIndex={0}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/contacts/${plan.contact!.id}`) }}
                              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); navigate(`/contacts/${plan.contact!.id}`) } }}
                              className="text-xs text-emerald-600 hover:underline cursor-pointer"
                            >
                              {plan.contact.firstName} {plan.contact.lastName}
                            </span>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 flex-shrink-0">
                          <div className="text-center">
                            <p className="font-bold text-gray-700">{plan._count?.problems ?? 0}</p>
                            <p>Problems</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-gray-700">{plan._count?.goals ?? 0}</p>
                            <p>Goals</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-gray-700">{plan._count?.interventions ?? 0}</p>
                            <p>Interventions</p>
                          </div>
                          {plan.startDate && (
                            <div className="text-center">
                              <p className="font-medium text-gray-600">{format(new Date(plan.startDate), 'MMM d')}</p>
                              <p>Started</p>
                            </div>
                          )}
                        </div>

                        <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      </Link>
                    ))}
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
