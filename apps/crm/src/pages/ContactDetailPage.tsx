import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  GitBranch,
  ClipboardList,
  CheckSquare,
  AlertTriangle,
  MessageSquare,
  Clock,
  Shield,
  Users,
  Activity,
  ChevronRight,
} from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'
import { format, differenceInYears } from 'date-fns'
import CareTeamPanel from '../components/crm/CareTeamPanel'
import CommunicationLogPanel from '../components/crm/CommunicationLogPanel'
import EmrSummaryPanel from '../components/crm/EmrSummaryPanel'

type Tab = 'summary' | 'care-plans' | 'referrals' | 'tasks' | 'gaps' | 'timeline' | 'care-team' | 'communications' | 'emr'

const RISK_CONFIG: Record<string, { label: string; className: string }> = {
  critical: { label: 'Critical Risk', className: 'bg-red-100 text-red-700 border border-red-200' },
  high: { label: 'High Risk', className: 'bg-orange-100 text-orange-700 border border-orange-200' },
  medium: { label: 'Medium Risk', className: 'bg-yellow-100 text-yellow-700 border border-yellow-200' },
  low: { label: 'Low Risk', className: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
}

const SDOH_LABELS: Record<string, string> = {
  housing: 'Housing Instability',
  food: 'Food Insecurity',
  transportation: 'Transportation Barrier',
  social_isolation: 'Social Isolation',
  financial: 'Financial Hardship',
}

export default function ContactDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('summary')

  const { data, isLoading } = useQuery({
    queryKey: ['contact', id],
    queryFn: () => api.get(`/api/contacts/${id}`).then((r) => r.data.data),
    enabled: !!id,
  })

  const contact = data

  if (isLoading) {
    return (
      <div className="flex-1 p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <p className="text-lg font-medium">Contact not found</p>
          <Link to="/contacts" className="mt-2 text-sm text-emerald-600 hover:underline">← Back to Contacts</Link>
        </div>
      </div>
    )
  }

  const risk = RISK_CONFIG[contact.riskLevel] ?? RISK_CONFIG.low
  const age = contact.dateOfBirth
    ? differenceInYears(new Date(), new Date(contact.dateOfBirth))
    : null

  const tabs: Array<{ id: Tab; label: string; count?: number; icon?: React.ReactNode }> = [
    { id: 'summary', label: 'Summary' },
    { id: 'care-plans', label: 'Care Plans', count: contact.carePlans?.length },
    { id: 'referrals', label: 'Referrals', count: contact._count?.referrals },
    { id: 'tasks', label: 'Tasks', count: contact.tasks?.length },
    { id: 'gaps', label: 'Care Gaps', count: contact.careGaps?.length },
    { id: 'timeline', label: 'Timeline', count: contact._count?.communications },
    { id: 'care-team', label: 'Care Team', icon: <Users className="h-3.5 w-3.5" /> },
    { id: 'communications', label: 'Communications', icon: <MessageSquare className="h-3.5 w-3.5" /> },
    { id: 'emr', label: 'EMR', icon: <Activity className="h-3.5 w-3.5" />, count: contact.emrPatientId ? undefined : undefined },
  ]

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 bg-white">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-0">
          <Link to="/contacts" className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-3 w-3" />
            Contacts
          </Link>
          <span className="text-gray-300 text-xs">/</span>
          <span className="text-xs text-gray-700 font-medium">
            {contact.firstName} {contact.lastName}
          </span>
        </div>

        {/* Patient context bar — always visible */}
        <div className="flex items-start gap-6 px-6 py-4">
          {/* Avatar */}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
            {contact.firstName[0]}{contact.lastName[0]}
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-gray-900">
                {contact.firstName} {contact.lastName}
                {contact.preferredName && (
                  <span className="ml-2 text-sm font-normal text-gray-400">({contact.preferredName})</span>
                )}
              </h1>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${risk.className}`}>
                {risk.label}
              </span>
              <span className="rounded-full bg-gray-100 text-gray-600 px-2.5 py-0.5 text-xs font-medium capitalize">
                {contact.status}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-1.5 flex-wrap">
              {age !== null && (
                <span className="text-xs text-gray-500">
                  {contact.dateOfBirth ? format(new Date(contact.dateOfBirth), 'MMM d, yyyy') : ''} · {age} yrs
                </span>
              )}
              {contact.phone && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Phone className="h-3 w-3" />
                  {contact.phone}
                </span>
              )}
              {contact.email && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Mail className="h-3 w-3" />
                  {contact.email}
                </span>
              )}
              {contact.account && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Shield className="h-3 w-3" />
                  {contact.account.name}
                </span>
              )}
            </div>

            {/* SDoH flags */}
            {contact.sdohFlags?.length > 0 && (
              <div className="flex items-center gap-2 mt-2">
                {contact.sdohFlags.map((flag: string) => (
                  <span key={flag} className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                    <AlertTriangle className="h-2.5 w-2.5" />
                    {SDOH_LABELS[flag] ?? flag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{contact.careGaps?.length ?? 0}</p>
              <p className="text-[10px] text-gray-500">Care Gaps</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{contact.tasks?.length ?? 0}</p>
              <p className="text-[10px] text-gray-500">Open Tasks</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{contact._count?.referrals ?? 0}</p>
              <p className="text-[10px] text-gray-500">Referrals</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-100 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  activeTab === tab.id ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'summary' && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Demographics */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Demographics</h3>
              <dl className="space-y-2 text-sm">
                {[
                  ['Source', contact.source],
                  ['Language', contact.language],
                  ['Sex', contact.sex],
                  ['Gender Identity', contact.genderIdentity],
                  ['Pronouns', contact.pronouns],
                  ['Assigned To', contact.assignedTo],
                ].map(([label, value]) => value ? (
                  <div key={label as string} className="flex justify-between">
                    <dt className="text-gray-500">{label}</dt>
                    <dd className="font-medium text-gray-900 capitalize">{value}</dd>
                  </div>
                ) : null)}
              </dl>
            </div>

            {/* Address */}
            {(contact.addressLine1 || contact.city) && (
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  Address
                </h3>
                <p className="text-sm text-gray-700">
                  {contact.addressLine1}<br />
                  {contact.addressLine2 && <>{contact.addressLine2}<br /></>}
                  {contact.city}{contact.city && contact.state ? ', ' : ''}{contact.state} {contact.postalCode}
                </p>
              </div>
            )}

            {/* Care Team */}
            {contact.careTeam && (
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Care Team</h3>
                <p className="text-xs text-gray-500 mb-3 font-medium">{contact.careTeam.name}</p>
                {contact.careTeam.members?.length === 0 ? (
                  <p className="text-xs text-gray-400">No team members assigned</p>
                ) : (
                  <div className="space-y-2">
                    {contact.careTeam.members?.map((member: { id: string; memberName: string; role: string; isPrimary: boolean }) => (
                      <div key={member.id} className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-gray-800">{member.memberName}</span>
                          {member.isPrimary && (
                            <span className="ml-1.5 text-[10px] bg-emerald-100 text-emerald-700 rounded px-1">Primary</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 capitalize">{member.role.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {contact.notes && (
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Notes</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.notes}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'care-plans' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Care Plans</h2>
              <button className="flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                + New Care Plan
              </button>
            </div>
            {contact.carePlans?.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-12 text-gray-400">
                <ClipboardList className="h-10 w-10 mb-3" />
                <p className="font-medium">No care plans</p>
                <p className="text-sm mt-1">Create the first care plan for this contact</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contact.carePlans?.map((plan: { id: string; title: string; status: string; startDate?: string; assignedTo?: string; problems: unknown[]; goals: unknown[]; interventions: unknown[] }) => (
                  <Link key={plan.id} to={`/care-plans/${plan.id}`} className="block rounded-xl border border-gray-200 bg-white p-5 hover:bg-gray-50 hover:border-emerald-200 hover:shadow-sm transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{plan.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          plan.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                          plan.status === 'draft' ? 'bg-gray-100 text-gray-600' :
                          plan.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {plan.status}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>{plan.problems?.length ?? 0} problems</span>
                      <span>{plan.goals?.length ?? 0} goals</span>
                      <span>{plan.interventions?.length ?? 0} interventions</span>
                      {plan.startDate && <span>Started {format(new Date(plan.startDate), 'MMM d, yyyy')}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'referrals' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Referrals</h2>
              <button className="flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                + New Referral
              </button>
            </div>
            {contact.referrals?.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-12 text-gray-400">
                <GitBranch className="h-10 w-10 mb-3" />
                <p className="font-medium">No referrals</p>
              </div>
            ) : (
              <div className="space-y-2">
                {contact.referrals?.map((ref: { id: string; referralNumber: string; stage: string; priority: string; type: string; reasonDisplay: string; createdAt: string }) => (
                  <div key={ref.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-500">{ref.referralNumber}</span>
                        <span className={`text-[10px] font-semibold rounded px-1.5 py-0.5 ${
                          ref.priority === 'emergent' ? 'bg-red-100 text-red-700' :
                          ref.priority === 'urgent' ? 'bg-orange-100 text-orange-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{ref.priority}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-800 mt-0.5">{ref.reasonDisplay}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        {ref.stage}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">{format(new Date(ref.createdAt), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Open Tasks</h2>
              <button className="flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                + New Task
              </button>
            </div>
            {contact.tasks?.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-12 text-gray-400">
                <CheckSquare className="h-10 w-10 mb-3" />
                <p className="font-medium">No open tasks</p>
              </div>
            ) : (
              <div className="space-y-2">
                {contact.tasks?.map((task: { id: string; title: string; type: string; priority: string; status: string; dueDate?: string; assignedTo: string }) => (
                  <div key={task.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 flex items-center gap-4">
                    <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                      task.priority === 'critical' ? 'bg-red-500' :
                      task.priority === 'high' ? 'bg-orange-400' :
                      task.priority === 'normal' ? 'bg-blue-400' :
                      'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{task.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{task.type.replace('_', ' ')} · assigned to {task.assignedTo}</p>
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {format(new Date(task.dueDate), 'MMM d')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'gaps' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Care Gaps</h2>
              <button className="flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                + Flag Gap
              </button>
            </div>
            {contact.careGaps?.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-12 text-gray-400">
                <AlertTriangle className="h-10 w-10 mb-3" />
                <p className="font-medium">No open care gaps</p>
              </div>
            ) : (
              <div className="space-y-2">
                {contact.careGaps?.map((gap: { id: string; gapType: string; description: string; status: string; priority: string; identifiedAt: string }) => (
                  <div key={gap.id} className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-amber-800 capitalize">{gap.gapType.replace(/_/g, ' ')}</span>
                      <span className={`text-[10px] rounded px-1.5 py-0.5 font-semibold ${
                        gap.priority === 'critical' ? 'bg-red-100 text-red-700' :
                        gap.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>{gap.priority}</span>
                    </div>
                    <p className="text-sm text-amber-700 mt-0.5">{gap.description}</p>
                    <p className="text-[10px] text-amber-500 mt-1">Identified {format(new Date(gap.identifiedAt), 'MMM d, yyyy')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Activity Timeline</h2>
            <TimelineTab contactId={id!} />
          </div>
        )}

        {activeTab === 'care-team' && (
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Care Team</h2>
            <CareTeamPanel contactId={id!} />
          </div>
        )}

        {activeTab === 'communications' && (
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Communications</h2>
            <CommunicationLogPanel contactId={id!} />
          </div>
        )}

        {activeTab === 'emr' && (
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">
              Clinical Summary{' '}
              <span className="text-xs font-normal text-gray-400">(read-only, sourced from EMR)</span>
            </h2>
            <EmrSummaryPanel contactId={id!} />
          </div>
        )}
      </div>
    </div>
  )
}

function TimelineTab({ contactId }: { contactId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['contact-timeline', contactId],
    queryFn: () => api.get(`/api/contacts/${contactId}/timeline`).then((r) => r.data.data),
  })

  if (isLoading) return <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-12 text-gray-400">
        <MessageSquare className="h-10 w-10 mb-3" />
        <p className="font-medium">No activity yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {data.map((item: { id: string; _type: string; type?: string; subject?: string; content?: string; sentAt?: string; createdAt: string; _at: string }) => (
        <div key={item.id} className="flex gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
            {item._type === 'communication' ? (
              <MessageSquare className="h-3.5 w-3.5 text-gray-500" />
            ) : item._type === 'task_completed' ? (
              <CheckSquare className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <GitBranch className="h-3.5 w-3.5 text-blue-500" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {item.subject ?? (item._type === 'task_completed' ? 'Task completed' : 'Referral update')}
            </p>
            {item.content && <p className="text-xs text-gray-500 truncate">{item.content}</p>}
          </div>
          <time className="text-xs text-gray-400 flex-shrink-0">
            {format(new Date(item._at), 'MMM d, h:mm a')}
          </time>
        </div>
      ))}
    </div>
  )
}
