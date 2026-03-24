import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckSquare, Clock, AlertCircle, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns'
import { useAuthStore } from '../stores/authStore'

interface Task {
  id: string
  title: string
  type: string
  status: string
  priority: string
  dueDate?: string
  assignedTo: string
  contactId?: string
  contact?: { id: string; firstName: string; lastName: string } | null
  referral?: { id: string; referralNumber: string } | null
  createdAt: string
}

const PRIORITY_CONFIG: Record<string, { dot: string; badge: string }> = {
  critical: { dot: 'bg-red-500', badge: 'bg-red-100 text-red-700' },
  high: { dot: 'bg-orange-400', badge: 'bg-orange-100 text-orange-700' },
  normal: { dot: 'bg-blue-400', badge: 'bg-blue-100 text-blue-700' },
  low: { dot: 'bg-gray-300', badge: 'bg-gray-100 text-gray-600' },
}

const TYPE_LABELS: Record<string, string> = {
  call: 'Call',
  email: 'Email',
  follow_up: 'Follow-up',
  assessment: 'Assessment',
  authorization: 'Authorization',
  scheduling: 'Scheduling',
  care_plan_review: 'Care Plan Review',
  other: 'Other',
}

function getDueDateLabel(dueDate: string | undefined): { label: string; className: string } {
  if (!dueDate) return { label: 'No due date', className: 'text-gray-400' }
  const date = new Date(dueDate)
  if (isPast(date) && !isToday(date)) {
    const days = differenceInDays(new Date(), date)
    return { label: `${days}d overdue`, className: 'text-red-600 font-semibold' }
  }
  if (isToday(date)) return { label: 'Today', className: 'text-amber-600 font-semibold' }
  if (isTomorrow(date)) return { label: 'Tomorrow', className: 'text-amber-500' }
  return { label: format(date, 'MMM d'), className: 'text-gray-500' }
}

export default function TasksPage() {
  const { user } = useAuthStore()
  const [filter, setFilter] = useState<'my' | 'all' | 'overdue'>('my')
  const queryClient = useQueryClient()

  const params = new URLSearchParams()
  if (filter === 'my' && user) params.set('assignedTo', user.id ?? user.email ?? '')
  if (filter === 'overdue') {
    params.set('status', 'pending')
  }
  params.set('pageSize', '100')

  const query = useQuery<{ data: Task[] }>({
    queryKey: ['tasks', filter],
    queryFn: () => api.get(`/api/tasks?${params}`).then((r) => r.data),
  })

  const completeMutation = useMutation({
    mutationFn: (taskId: string) =>
      api.patch(`/api/tasks/${taskId}`, { status: 'completed', completionNotes: 'Marked complete' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const tasks = query.data?.data ?? []

  // Group by due date category
  const overdue = tasks.filter((t) => t.dueDate && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate)))
  const today = tasks.filter((t) => t.dueDate && isToday(new Date(t.dueDate)))
  const upcoming = tasks.filter((t) => !t.dueDate || (!isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate))))

  const groups = [
    { label: 'Overdue', items: overdue, accent: 'text-red-600' },
    { label: 'Due Today', items: today, accent: 'text-amber-600' },
    { label: 'Upcoming', items: upcoming, accent: 'text-gray-700' },
  ]

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-4">
          <h1 className="text-base font-semibold text-gray-900">Tasks</h1>
          <div className="flex rounded-md border border-gray-200 p-0.5">
            {([
              { id: 'my', label: 'My Tasks' },
              { id: 'all', label: 'All Tasks' },
              { id: 'overdue', label: 'Overdue' },
            ] as const).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  filter === f.id ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">
          <Plus className="h-3.5 w-3.5" />
          New Task
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {query.isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <CheckSquare className="h-12 w-12 mb-3" />
            <p className="text-base font-medium">No tasks</p>
            <p className="text-sm mt-1">All caught up!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {groups.map(({ label, items, accent }) => {
              if (items.length === 0) return null
              return (
                <div key={label}>
                  <h2 className={`text-xs font-bold uppercase tracking-wide mb-2 ${accent}`}>
                    {label} · {items.length}
                  </h2>
                  <div className="space-y-1.5">
                    {items.map((task) => {
                      const pcfg = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG.normal
                      const due = getDueDateLabel(task.dueDate)
                      return (
                        <div key={task.id} className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 hover:bg-gray-50">
                          {/* Complete button */}
                          <button
                            onClick={() => completeMutation.mutate(task.id)}
                            disabled={completeMutation.isPending}
                            className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 hover:border-emerald-500 transition-colors"
                            aria-label="Mark complete"
                          />

                          {/* Priority dot */}
                          <div className={`h-2 w-2 flex-shrink-0 rounded-full ${pcfg.dot}`} />

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                            <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                              <span className="capitalize">{TYPE_LABELS[task.type] ?? task.type}</span>
                              {task.contact && (
                                <Link to={`/contacts/${task.contact.id}`} className="text-emerald-600 hover:underline">
                                  {task.contact.firstName} {task.contact.lastName}
                                </Link>
                              )}
                              {task.referral && (
                                <span className="font-mono">{task.referral.referralNumber}</span>
                              )}
                            </div>
                          </div>

                          {/* Due date */}
                          <div className={`flex items-center gap-1 text-xs flex-shrink-0 ${due.className}`}>
                            {task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)) ? (
                              <AlertCircle className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                            {due.label}
                          </div>

                          {/* Priority badge */}
                          <span className={`text-[10px] font-semibold rounded px-1.5 py-0.5 flex-shrink-0 ${pcfg.badge}`}>
                            {task.priority}
                          </span>
                        </div>
                      )
                    })}
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
