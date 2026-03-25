import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Users, Plus, Search, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'
import { trackEvent } from '@patient-health/analytics'
import { format } from 'date-fns'

interface Member {
  id: string
  memberNumber: string
  firstName: string
  lastName: string
  dateOfBirth?: string
  status: string
  riskLevel: string
  organisation?: { id: string; name: string }
  _count?: { enrollments: number }
}

interface Meta {
  page: number
  pageSize: number
  total: number
  totalPages: number
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

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, className: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

function RiskBadge({ level }: { level: string }) {
  const cfg = RISK_CONFIG[level] ?? { label: level, className: 'bg-gray-100 text-gray-600' }
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${cfg.className}`}>
      {cfg.label}
    </span>
  )
}

interface NewMemberForm {
  firstName: string
  lastName: string
  dateOfBirth: string
  sex: string
  phone: string
  email: string
  status: string
  riskLevel: string
  organisationId: string
}

const INITIAL_FORM: NewMemberForm = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  sex: '',
  phone: '',
  email: '',
  status: 'active',
  riskLevel: 'low',
  organisationId: '',
}

export default function MembersPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [riskFilter, setRiskFilter] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<NewMemberForm>(INITIAL_FORM)
  const [formError, setFormError] = useState('')

  const queryKey = ['admin-members', search, statusFilter, riskFilter, page]

  const { data, isLoading } = useQuery<{ data: Member[]; meta: Meta }>({
    queryKey,
    queryFn: () =>
      api
        .get('/api/members', {
          params: {
            q: search || undefined,
            status: statusFilter || undefined,
            riskLevel: riskFilter || undefined,
            page,
            pageSize: 20,
          },
        })
        .then((r) => r.data),
  })

  const { data: orgsData } = useQuery<{ data: Array<{ id: string; name: string }> }>({
    queryKey: ['admin-orgs-list'],
    queryFn: () => api.get('/api/organisations?pageSize=100').then((r) => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (payload: NewMemberForm) => api.post('/api/members', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-members'] })
      setShowModal(false)
      trackEvent({ event: 'admin_member_created' })
      setForm(INITIAL_FORM)
      setFormError('')
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to create member'
      setFormError(msg)
    },
  })

  const members = data?.data ?? []
  const meta = data?.meta

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.firstName || !form.lastName) {
      setFormError('First name and last name are required')
      return
    }
    if (!form.organisationId) {
      setFormError('Organisation is required')
      return
    }
    setFormError('')
    createMutation.mutate(form)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-indigo-600" />
          <h1 className="text-base font-semibold text-gray-900">Members</h1>
          {meta && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
              {meta.total.toLocaleString()}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Member
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, member #, EMR ID…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full rounded-md border border-gray-300 py-1.5 pl-8 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="rounded-md border border-gray-300 py-1.5 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
          <option value="pending_verification">Pending</option>
          <option value="deceased">Deceased</option>
        </select>
        <select
          value={riskFilter}
          onChange={(e) => {
            setRiskFilter(e.target.value)
            setPage(1)
          }}
          className="rounded-md border border-gray-300 py-1.5 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All risk levels</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Users className="h-12 w-12 mb-3" />
            <p className="text-base font-medium text-gray-600">No members found</p>
            <p className="text-sm mt-1">
              {search || statusFilter || riskFilter
                ? 'Try adjusting your filters'
                : 'Create the first member to get started'}
            </p>
            {!search && !statusFilter && !riskFilter && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                New Member
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Member #
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Name
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  DOB
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Risk
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Organisation
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Programmes
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {members.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/members/${m.id}`)}
                >
                  <td className="px-6 py-3 font-mono text-xs text-gray-500">{m.memberNumber}</td>
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {m.firstName} {m.lastName}
                  </td>
                  <td className="px-6 py-3 text-gray-500">
                    {m.dateOfBirth ? format(new Date(m.dateOfBirth), 'MMM d, yyyy') : '—'}
                  </td>
                  <td className="px-6 py-3">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="px-6 py-3">
                    <RiskBadge level={m.riskLevel} />
                  </td>
                  <td className="px-6 py-3 text-gray-600 text-xs">{m.organisation?.name ?? '—'}</td>
                  <td className="px-6 py-3 text-center text-xs text-gray-500">
                    {m._count?.enrollments ?? 0}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/members/${m.id}`)
                      }}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
          <p className="text-xs text-gray-500">
            Page {meta.page} of {meta.totalPages} — {meta.total} members
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-md border border-gray-300 p-1 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border border-gray-300 p-1 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* New Member Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900">New Member</h2>
              <button
                onClick={() => {
                  setShowModal(false)
                  setForm(INITIAL_FORM)
                  setFormError('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Sex</label>
                  <select
                    value={form.sex}
                    onChange={(e) => setForm((f) => ({ ...f, sex: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select…</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="+1 555 000 0000"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="active">Active</option>
                    <option value="pending_verification">Pending Verification</option>
                    <option value="suspended">Suspended</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Risk Level
                  </label>
                  <select
                    value={form.riskLevel}
                    onChange={(e) => setForm((f) => ({ ...f, riskLevel: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Organisation <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.organisationId}
                  onChange={(e) => setForm((f) => ({ ...f, organisationId: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select organisation…</option>
                  {orgsData?.data.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setForm(INITIAL_FORM)
                    setFormError('')
                  }}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {createMutation.isPending ? 'Creating…' : 'Create Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
