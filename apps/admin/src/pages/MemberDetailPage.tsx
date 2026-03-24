import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  User,
  ClipboardList,
  FileText,
  ExternalLink,
  Building2,
} from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'
import { format } from 'date-fns'

interface Enrollment {
  id: string
  state: string
  assignedTo?: string
  enrolledAt?: string
  graduatedAt?: string
  disenrolledAt?: string
  createdAt: string
  programme: { id: string; name: string; programmeType: string }
  _count: { transitions: number }
  transitions: Array<{
    id: string
    fromState: string
    toState: string
    actorId: string
    timestamp: string
    reasonCode?: string
  }>
}

interface Member {
  id: string
  memberNumber: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  sex?: string
  phone?: string
  email?: string
  status: string
  riskLevel: string
  emrPatientId?: string
  crmContactId?: string
  organisation: { id: string; name: string; type: string }
  site?: { id: string; name: string }
  enrollments: Enrollment[]
  _count: { enrollments: number; auditEvents: number }
  createdAt: string
  updatedAt: string
}

interface AuditEvent {
  id: string
  timestamp: string
  service: string
  entityType: string
  action: string
  actorId: string
  entityId?: string
  correlationId?: string
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-green-100 text-green-700' },
  inactive: { label: 'Inactive', className: 'bg-gray-100 text-gray-600' },
  suspended: { label: 'Suspended', className: 'bg-red-100 text-red-700' },
  pending_verification: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
  deceased: { label: 'Deceased', className: 'bg-gray-200 text-gray-500' },
}

const RISK_CONFIG: Record<string, { label: string; className: string }> = {
  low: { label: 'Low', className: 'bg-indigo-50 text-indigo-700' },
  medium: { label: 'Medium', className: 'bg-yellow-50 text-yellow-700' },
  high: { label: 'High', className: 'bg-orange-50 text-orange-700' },
  critical: { label: 'Critical', className: 'bg-red-50 text-red-700' },
}

const ENROLLMENT_STATE_CONFIG: Record<string, string> = {
  referred: 'bg-blue-100 text-blue-700',
  screened: 'bg-purple-100 text-purple-700',
  eligible: 'bg-indigo-100 text-indigo-700',
  consented: 'bg-cyan-100 text-cyan-700',
  enrolled: 'bg-teal-100 text-teal-700',
  active: 'bg-green-100 text-green-700',
  graduated: 'bg-emerald-100 text-emerald-700',
  disenrolled: 'bg-gray-100 text-gray-600',
  transferred: 'bg-amber-100 text-amber-700',
  declined: 'bg-red-100 text-red-700',
}

type Tab = 'overview' | 'enrollments' | 'audit'

export default function MemberDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const { data: memberData, isLoading } = useQuery<{ data: Member }>({
    queryKey: ['admin-member', id],
    queryFn: () => api.get(`/api/members/${id}`).then((r) => r.data),
    enabled: !!id,
  })

  const { data: auditData, isLoading: auditLoading } = useQuery<{
    data: AuditEvent[]
    meta: { total: number }
  }>({
    queryKey: ['admin-member-audit', id],
    queryFn: () => api.get(`/api/audit/member/${id}?limit=50`).then((r) => r.data),
    enabled: !!id && activeTab === 'audit',
  })

  const member = memberData?.data

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex h-14 items-center border-b border-gray-200 bg-white px-6">
          <Skeleton className="h-6 w-64" />
        </div>
        <div className="flex-1 overflow-auto p-6 space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-gray-400">
        <User className="h-12 w-12" />
        <p className="text-base font-medium text-gray-600">Member not found</p>
        <button
          onClick={() => navigate('/members')}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          Back to Members
        </button>
      </div>
    )
  }

  const statusCfg =
    STATUS_CONFIG[member.status] ?? { label: member.status, className: 'bg-gray-100 text-gray-600' }
  const riskCfg =
    RISK_CONFIG[member.riskLevel] ?? { label: member.riskLevel, className: 'bg-gray-100 text-gray-600' }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-6">
        <button
          onClick={() => navigate('/members')}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Back to members"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
            {member.firstName[0]}
            {member.lastName[0]}
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900">
              {member.firstName} {member.lastName}
            </h1>
            <p className="text-xs text-gray-400 font-mono">{member.memberNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusCfg.className}`}
          >
            {statusCfg.label}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${riskCfg.className}`}
          >
            {riskCfg.label} Risk
          </span>
          {member.emrPatientId && (
            <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
              <ExternalLink className="h-2.5 w-2.5" />
              EMR linked
            </span>
          )}
          {member.crmContactId && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
              <ExternalLink className="h-2.5 w-2.5" />
              CRM linked
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white px-6">
        {(
          [
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'enrollments', label: 'Enrollments', icon: ClipboardList },
            { id: 'audit', label: 'Audit History', icon: FileText },
          ] as const
        ).map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            onClick={() => setActiveTab(tabId)}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tabId
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* ── Overview ───────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Demographics */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="mb-4 text-sm font-semibold text-gray-900">Demographics</h2>
              <dl className="space-y-3 text-sm">
                {[
                  ['Member Number', <span className="font-mono text-xs">{member.memberNumber}</span>],
                  ['Full Name', `${member.firstName} ${member.lastName}`],
                  [
                    'Date of Birth',
                    member.dateOfBirth
                      ? format(new Date(member.dateOfBirth), 'MMMM d, yyyy')
                      : '—',
                  ],
                  ['Sex', member.sex ?? '—'],
                  ['Phone', member.phone ?? '—'],
                  ['Email', member.email ?? '—'],
                  [
                    'Registered',
                    format(new Date(member.createdAt), 'MMM d, yyyy'),
                  ],
                  ['Last Updated', format(new Date(member.updatedAt), 'MMM d, yyyy')],
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex items-start justify-between gap-4">
                    <dt className="flex-shrink-0 text-xs font-medium text-gray-500">{label}</dt>
                    <dd className="text-right text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Identity Links & Org */}
            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="mb-4 text-sm font-semibold text-gray-900">Identity Links</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                    <div>
                      <p className="text-xs font-semibold text-blue-700">EMR Patient ID</p>
                      <p className="mt-0.5 font-mono text-xs text-blue-600">
                        {member.emrPatientId ?? 'Not linked'}
                      </p>
                    </div>
                    {member.emrPatientId && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                        Linked
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
                    <div>
                      <p className="text-xs font-semibold text-emerald-700">CRM Contact ID</p>
                      <p className="mt-0.5 font-mono text-xs text-emerald-600">
                        {member.crmContactId ?? 'Not linked'}
                      </p>
                    </div>
                    {member.crmContactId && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        Linked
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h2 className="mb-4 text-sm font-semibold text-gray-900">Organisation</h2>
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 mt-0.5 text-indigo-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{member.organisation.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{member.organisation.type}</p>
                    {member.site && (
                      <p className="mt-1 text-xs text-gray-500">Site: {member.site.name}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Enrollments ─────────────────────────────────────────────────── */}
        {activeTab === 'enrollments' && (
          <div className="space-y-4">
            {member.enrollments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <ClipboardList className="h-10 w-10 mb-3" />
                <p className="text-sm font-medium text-gray-600">No programme enrollments</p>
                <p className="text-xs mt-1">Enroll this member in a programme to get started</p>
              </div>
            ) : (
              member.enrollments.map((enrollment) => {
                const stateCls =
                  ENROLLMENT_STATE_CONFIG[enrollment.state] ?? 'bg-gray-100 text-gray-600'
                return (
                  <div key={enrollment.id} className="rounded-xl border border-gray-200 bg-white p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{enrollment.programme.name}</p>
                        <p className="text-xs text-gray-500 capitalize mt-0.5">
                          {enrollment.programme.programmeType.replace('_', ' ')}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ${stateCls}`}
                      >
                        {enrollment.state.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      {enrollment.enrolledAt && (
                        <span>Enrolled: {format(new Date(enrollment.enrolledAt), 'MMM d, yyyy')}</span>
                      )}
                      {enrollment.graduatedAt && (
                        <span>
                          Graduated: {format(new Date(enrollment.graduatedAt), 'MMM d, yyyy')}
                        </span>
                      )}
                      <span>{enrollment._count.transitions} transitions</span>
                    </div>

                    {enrollment.transitions.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Recent transitions
                        </p>
                        {enrollment.transitions.slice(0, 4).map((t) => (
                          <div
                            key={t.id}
                            className="flex items-center gap-2 text-xs text-gray-500"
                          >
                            <span className="capitalize">{t.fromState.replace('_', ' ')}</span>
                            <span className="text-gray-300">→</span>
                            <span className="font-medium text-gray-700 capitalize">
                              {t.toState.replace('_', ' ')}
                            </span>
                            {t.reasonCode && (
                              <span className="text-gray-400">({t.reasonCode})</span>
                            )}
                            <span className="ml-auto">
                              {format(new Date(t.timestamp), 'MMM d, yyyy')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ── Audit History ──────────────────────────────────────────────── */}
        {activeTab === 'audit' && (
          <div>
            {auditLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : (auditData?.data ?? []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <FileText className="h-10 w-10 mb-3" />
                <p className="text-sm font-medium text-gray-600">No audit events</p>
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-white">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-left">
                      <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide">
                        Timestamp
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide">
                        Service
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide">
                        Entity
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide">
                        Action
                      </th>
                      <th className="px-4 py-3 font-semibold text-gray-500 uppercase tracking-wide">
                        Actor
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {auditData?.data.map((event) => (
                      <tr key={event.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2.5 text-gray-500">
                          {format(new Date(event.timestamp), 'MMM d, yyyy HH:mm')}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase ${
                              event.service === 'emr'
                                ? 'bg-blue-100 text-blue-700'
                                : event.service === 'crm'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : event.service === 'admin'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {event.service}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-gray-700">{event.entityType}</td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                              event.action === 'create'
                                ? 'bg-green-100 text-green-700'
                                : event.action === 'delete'
                                  ? 'bg-red-100 text-red-700'
                                  : event.action === 'update'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {event.action}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-gray-400">
                          {event.actorId.slice(0, 8)}…
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
