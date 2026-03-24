import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  Target,
  Zap,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  ChevronRight,
  User,
  CalendarDays,
} from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'
import { format } from 'date-fns'

// ─── Types ─────────────────────────────────────────────────────────────────

interface Problem {
  id: string
  description: string
  icd10Code?: string
  snomedCode?: string
  status: string
  onsetDate?: string
}

interface Goal {
  id: string
  problemId?: string
  description: string
  targetDate?: string
  status: string
  achievedDate?: string
  problem?: { id: string; description: string }
}

interface Intervention {
  id: string
  goalId?: string
  description: string
  type: string
  frequency?: string
  assignedTo?: string
  status: string
}

interface ProgressNote {
  id: string
  content: string
  authorId: string
  authorName: string
  createdAt: string
}

interface CarePlanDetail {
  id: string
  contactId: string
  title: string
  description?: string
  status: string
  templateKey?: string
  startDate?: string
  endDate?: string
  assignedTo?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  contact: { id: string; firstName: string; lastName: string; riskLevel: string }
  problems: Problem[]
  goals: Goal[]
  interventions: Intervention[]
  progressNotes: ProgressNote[]
}

// ─── Config ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
  draft: { label: 'Draft', className: 'bg-gray-100 text-gray-600 border border-gray-200' },
  completed: { label: 'Completed', className: 'bg-blue-100 text-blue-700 border border-blue-200' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-600 border border-red-200' },
}

const GOAL_STATUS_CONFIG: Record<string, { icon: React.ReactNode; className: string }> = {
  in_progress: {
    icon: <Clock className="h-3.5 w-3.5" />,
    className: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  },
  achieved: {
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    className: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  not_achieved: {
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    className: 'text-red-700 bg-red-50 border-red-200',
  },
  cancelled: {
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    className: 'text-gray-500 bg-gray-50 border-gray-200',
  },
}

const INTERVENTION_TYPE_COLORS: Record<string, string> = {
  education: 'bg-purple-50 text-purple-700 border-purple-200',
  referral: 'bg-blue-50 text-blue-700 border-blue-200',
  medication_adjustment: 'bg-orange-50 text-orange-700 border-orange-200',
  behavioural: 'bg-pink-50 text-pink-700 border-pink-200',
  monitoring: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  other: 'bg-gray-50 text-gray-600 border-gray-200',
}

const RISK_DOT: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-400',
  medium: 'bg-yellow-400',
  low: 'bg-emerald-400',
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function CarePlanDetailPage() {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading } = useQuery<{ data: CarePlanDetail }>({
    queryKey: ['care-plan', id],
    queryFn: () => api.get(`/api/care-plans/${id}`).then((r) => r.data),
    enabled: !!id,
  })

  const plan = data?.data

  if (isLoading) {
    return (
      <div className="flex-1 p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
          <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <p className="text-lg font-medium">Care plan not found</p>
          <Link to="/care-plans" className="mt-2 text-sm text-emerald-600 hover:underline">
            ← Back to Care Plans
          </Link>
        </div>
      </div>
    )
  }

  const statusCfg = STATUS_CONFIG[plan.status] ?? STATUS_CONFIG.draft

  // Group goals by problemId, orphan goals go in "unlinked"
  const goalsByProblem = plan.goals.reduce<Record<string, Goal[]>>((acc, goal) => {
    const key = goal.problemId ?? '__unlinked__'
    if (!acc[key]) acc[key] = []
    acc[key].push(goal)
    return acc
  }, {})

  // Map interventions by goalId
  const interventionsByGoal = plan.interventions.reduce<Record<string, Intervention[]>>((acc, int) => {
    const key = int.goalId ?? '__unlinked__'
    if (!acc[key]) acc[key] = []
    acc[key].push(int)
    return acc
  }, {})

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
          <Link to="/care-plans" className="hover:text-gray-700 flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            Care Plans
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link
            to={`/contacts/${plan.contact.id}`}
            className="hover:text-emerald-600"
          >
            {plan.contact.firstName} {plan.contact.lastName}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-gray-700 font-medium truncate max-w-xs">{plan.title}</span>
        </div>

        {/* Title row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {/* Risk dot */}
            <div
              className={`mt-1.5 h-3 w-3 rounded-full flex-shrink-0 ${RISK_DOT[plan.contact.riskLevel] ?? 'bg-gray-300'}`}
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">{plan.title}</h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusCfg.className}`}>
                  {statusCfg.label}
                </span>
                {plan.templateKey && (
                  <span className="text-[10px] text-gray-500 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5">
                    {plan.templateKey} template
                  </span>
                )}
                <Link
                  to={`/contacts/${plan.contact.id}`}
                  className="text-xs text-emerald-600 hover:underline font-medium"
                >
                  {plan.contact.firstName} {plan.contact.lastName}
                </Link>
              </div>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-5 text-xs text-gray-500 flex-shrink-0">
            {plan.startDate && (
              <div className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>
                  {format(new Date(plan.startDate), 'MMM d, yyyy')}
                  {plan.endDate && ` → ${format(new Date(plan.endDate), 'MMM d, yyyy')}`}
                </span>
              </div>
            )}
            {plan.assignedTo && (
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span className="font-mono text-[10px]">{plan.assignedTo}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {plan.description && (
          <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-3xl">{plan.description}</p>
        )}

        {/* Quick stats */}
        <div className="flex items-center gap-5 mt-4">
          {[
            { label: 'Problems', count: plan.problems.length, color: 'text-red-600' },
            { label: 'Goals', count: plan.goals.length, color: 'text-blue-600' },
            { label: 'Interventions', count: plan.interventions.length, color: 'text-purple-600' },
            { label: 'Progress Notes', count: plan.progressNotes.length, color: 'text-gray-600' },
          ].map(({ label, count, color }) => (
            <div key={label} className="flex items-baseline gap-1">
              <span className={`text-lg font-bold ${color}`}>{count}</span>
              <span className="text-xs text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* ── Left: Clinical content ───────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Problems → Goals → Interventions hierarchy */}
            {plan.problems.length === 0 && plan.goals.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-12 text-gray-400">
                <AlertCircle className="h-10 w-10 mb-3" />
                <p className="font-medium">No problems or goals defined</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Linked problems */}
                {plan.problems.map((problem) => {
                  const problemGoals = goalsByProblem[problem.id] ?? []
                  return (
                    <div
                      key={problem.id}
                      className="rounded-xl border border-gray-200 bg-white overflow-hidden"
                    >
                      {/* Problem header */}
                      <div className="flex items-start gap-3 px-5 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-red-100 mt-0.5">
                          <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-gray-900">{problem.description}</p>
                            <span className={`text-[10px] font-medium rounded px-1.5 py-0.5 border ${
                              problem.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-gray-50 text-gray-500 border-gray-200'
                            }`}>
                              {problem.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500">
                            {problem.icd10Code && <span className="font-mono">ICD-10: {problem.icd10Code}</span>}
                            {problem.snomedCode && <span className="font-mono">SNOMED: {problem.snomedCode}</span>}
                            {problem.onsetDate && (
                              <span>Onset {format(new Date(problem.onsetDate), 'MMM d, yyyy')}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Goals for this problem */}
                      {problemGoals.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {problemGoals.map((goal) => {
                            const goalInterventions = interventionsByGoal[goal.id] ?? []
                            const goalCfg = GOAL_STATUS_CONFIG[goal.status] ?? GOAL_STATUS_CONFIG.in_progress
                            return (
                              <div key={goal.id} className="px-5 py-4">
                                {/* Goal row */}
                                <div className="flex items-start gap-3">
                                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 mt-0.5">
                                    <Target className="h-3.5 w-3.5 text-blue-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <p className="text-sm font-medium text-gray-800">{goal.description}</p>
                                      <span className={`flex items-center gap-1 text-[10px] font-medium rounded-full px-2 py-0.5 border ${goalCfg.className}`}>
                                        {goalCfg.icon}
                                        {goal.status.replace(/_/g, ' ')}
                                      </span>
                                    </div>
                                    {goal.targetDate && (
                                      <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                                        <CalendarDays className="h-3 w-3" />
                                        Target {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                                        {goal.achievedDate && (
                                          <> · Achieved {format(new Date(goal.achievedDate), 'MMM d, yyyy')}</>
                                        )}
                                      </p>
                                    )}

                                    {/* Interventions under this goal */}
                                    {goalInterventions.length > 0 && (
                                      <div className="mt-3 space-y-2">
                                        {goalInterventions.map((int) => (
                                          <div
                                            key={int.id}
                                            className="flex items-start gap-2.5 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5"
                                          >
                                            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white border border-gray-200 mt-0.5">
                                              <Zap className="h-3 w-3 text-purple-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-xs font-medium text-gray-700">{int.description}</p>
                                                <span className={`text-[10px] rounded px-1.5 py-0.5 border font-medium ${INTERVENTION_TYPE_COLORS[int.type] ?? INTERVENTION_TYPE_COLORS.other}`}>
                                                  {int.type.replace(/_/g, ' ')}
                                                </span>
                                                {int.status !== 'active' && (
                                                  <span className={`text-[10px] rounded px-1.5 py-0.5 border ${
                                                    int.status === 'completed'
                                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                      : 'bg-gray-50 text-gray-500 border-gray-200'
                                                  }`}>
                                                    {int.status}
                                                  </span>
                                                )}
                                              </div>
                                              {(int.frequency || int.assignedTo) && (
                                                <div className="flex items-center gap-3 mt-0.5 text-[10px] text-gray-500">
                                                  {int.frequency && <span>{int.frequency}</span>}
                                                  {int.assignedTo && (
                                                    <span className="flex items-center gap-0.5">
                                                      <User className="h-2.5 w-2.5" />
                                                      <span className="font-mono">{int.assignedTo}</span>
                                                    </span>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="px-5 py-3 text-xs text-gray-400 italic">No goals defined for this problem</div>
                      )}
                    </div>
                  )
                })}

                {/* Orphan goals (not linked to a problem) */}
                {(goalsByProblem['__unlinked__'] ?? []).length > 0 && (
                  <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                    <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Additional Goals
                      </p>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {(goalsByProblem['__unlinked__'] ?? []).map((goal) => {
                        const goalInterventions = interventionsByGoal[goal.id] ?? []
                        const goalCfg = GOAL_STATUS_CONFIG[goal.status] ?? GOAL_STATUS_CONFIG.in_progress
                        return (
                          <div key={goal.id} className="px-5 py-4">
                            <div className="flex items-start gap-3">
                              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 mt-0.5">
                                <Target className="h-3.5 w-3.5 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-sm font-medium text-gray-800">{goal.description}</p>
                                  <span className={`flex items-center gap-1 text-[10px] font-medium rounded-full px-2 py-0.5 border ${goalCfg.className}`}>
                                    {goalCfg.icon}
                                    {goal.status.replace(/_/g, ' ')}
                                  </span>
                                </div>
                                {goal.targetDate && (
                                  <p className="text-[11px] text-gray-500 mt-0.5">
                                    Target {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                                  </p>
                                )}
                                {goalInterventions.length > 0 && (
                                  <div className="mt-3 space-y-2">
                                    {goalInterventions.map((int) => (
                                      <div key={int.id} className="flex items-start gap-2.5 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5">
                                        <Zap className="h-3.5 w-3.5 text-purple-500 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-xs font-medium text-gray-700">{int.description}</p>
                                            <span className={`text-[10px] rounded px-1.5 py-0.5 border font-medium ${INTERVENTION_TYPE_COLORS[int.type] ?? INTERVENTION_TYPE_COLORS.other}`}>
                                              {int.type.replace(/_/g, ' ')}
                                            </span>
                                          </div>
                                          {int.frequency && <p className="text-[10px] text-gray-500 mt-0.5">{int.frequency}</p>}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Orphan interventions (not linked to any goal) */}
                {(interventionsByGoal['__unlinked__'] ?? []).length > 0 && (
                  <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                    <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Additional Interventions
                      </p>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {(interventionsByGoal['__unlinked__'] ?? []).map((int) => (
                        <div key={int.id} className="flex items-start gap-3 px-5 py-4">
                          <Zap className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-medium text-gray-800">{int.description}</p>
                              <span className={`text-[10px] rounded px-1.5 py-0.5 border font-medium ${INTERVENTION_TYPE_COLORS[int.type] ?? INTERVENTION_TYPE_COLORS.other}`}>
                                {int.type.replace(/_/g, ' ')}
                              </span>
                            </div>
                            {int.frequency && <p className="text-xs text-gray-500 mt-0.5">{int.frequency}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Right: Progress notes ─────────────────────────────────────── */}
          <div className="space-y-5">
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-400" />
                  Progress Notes
                </h3>
                <span className="text-[10px] text-gray-400">{plan.progressNotes.length} notes</span>
              </div>

              {plan.progressNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <FileText className="h-8 w-8 mb-2" />
                  <p className="text-sm font-medium">No notes yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {plan.progressNotes.map((note) => (
                    <div key={note.id} className="px-5 py-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-700">{note.authorName}</span>
                        <time className="text-[10px] text-gray-400">
                          {format(new Date(note.createdAt), 'MMM d, yyyy · h:mm a')}
                        </time>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Plan metadata */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Plan Details</h3>
              <dl className="space-y-2 text-xs">
                {[
                  ['Created', format(new Date(plan.createdAt), 'MMM d, yyyy')],
                  ['Last Updated', format(new Date(plan.updatedAt), 'MMM d, yyyy')],
                  ['Start Date', plan.startDate ? format(new Date(plan.startDate), 'MMM d, yyyy') : null],
                  ['End Date', plan.endDate ? format(new Date(plan.endDate), 'MMM d, yyyy') : null],
                  ['Template', plan.templateKey ?? null],
                ].map(([label, value]) =>
                  value ? (
                    <div key={label as string} className="flex justify-between">
                      <dt className="text-gray-500">{label}</dt>
                      <dd className="font-medium text-gray-800 capitalize">{value}</dd>
                    </div>
                  ) : null
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
