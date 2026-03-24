import { useState } from 'react'
import { UserCog, Plus, Search, Mail, X } from 'lucide-react'

// Note: Users are managed via auth-service. This page shows the structural UI
// with mock data. Production wires to GET /api/auth/users.

interface MockUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  products: string[]
  status: 'active' | 'inactive'
  lastLogin?: string
}

const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    firstName: 'Adriana',
    lastName: 'Reyes',
    email: 'adriana.reyes@example.com',
    role: 'admin',
    products: ['EMR', 'CRM', 'Admin'],
    status: 'active',
    lastLogin: '2026-03-20T08:30:00Z',
  },
  {
    id: '2',
    firstName: 'Marcus',
    lastName: 'Chen',
    email: 'm.chen@example.com',
    role: 'care_coordinator',
    products: ['CRM'],
    status: 'active',
    lastLogin: '2026-03-20T07:45:00Z',
  },
  {
    id: '3',
    firstName: 'Sophie',
    lastName: 'Okafor',
    email: 's.okafor@example.com',
    role: 'physician',
    products: ['EMR'],
    status: 'active',
    lastLogin: '2026-03-19T16:00:00Z',
  },
  {
    id: '4',
    firstName: 'Raj',
    lastName: 'Patel',
    email: 'raj.patel@example.com',
    role: 'nurse',
    products: ['EMR', 'CRM'],
    status: 'inactive',
    lastLogin: '2026-03-10T09:15:00Z',
  },
]

const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrator',
  physician: 'Physician',
  nurse: 'Nurse',
  care_coordinator: 'Care Coordinator',
  case_manager: 'Case Manager',
  front_desk: 'Front Desk',
  billing: 'Billing',
}

const PRODUCT_BADGE: Record<string, string> = {
  EMR: 'bg-blue-100 text-blue-700',
  CRM: 'bg-emerald-100 text-emerald-700',
  Admin: 'bg-indigo-100 text-indigo-700',
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function UsersPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('care_coordinator')
  const [inviteSent, setInviteSent] = useState(false)

  const filtered = MOCK_USERS.filter((u) => {
    const matchesSearch =
      !search ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || u.status === statusFilter
    return matchesSearch && matchesStatus
  })

  function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    // Mock: in production this would call POST /api/auth/users/invite
    setInviteSent(true)
    setTimeout(() => {
      setShowInviteModal(false)
      setInviteSent(false)
      setInviteEmail('')
      setInviteRole('care_coordinator')
    }, 2000)
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-2">
          <UserCog className="h-4 w-4 text-indigo-600" />
          <h1 className="text-base font-semibold text-gray-900">Users</h1>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
            {MOCK_USERS.length}
          </span>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Invite User
        </button>
      </div>

      {/* Note */}
      <div className="border-b border-amber-200 bg-amber-50 px-6 py-2">
        <p className="text-xs text-amber-700">
          Users are managed by the centralised auth-service. This view reflects the current user
          roster. Full user management (create, deactivate, password reset) connects to the auth API.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 py-1.5 pl-8 pr-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 py-1.5 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <UserCog className="h-12 w-12 mb-3" />
            <p className="text-base font-medium text-gray-600">No users found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  User
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Role
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Product Access
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Last Login
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 flex-shrink-0">
                        {u.firstName[0]}
                        {u.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {u.firstName} {u.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-xs text-gray-600">
                    {ROLE_LABELS[u.role] ?? u.role}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-1">
                      {u.products.map((p) => (
                        <span
                          key={p}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${PRODUCT_BADGE[p] ?? 'bg-gray-100 text-gray-600'}`}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        u.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs text-gray-500">
                    {u.lastLogin ? formatRelativeTime(u.lastLogin) : '—'}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800">
                        Edit
                      </button>
                      {u.status === 'active' && (
                        <button className="text-xs font-medium text-red-500 hover:text-red-700">
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900">Invite User</h2>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            {inviteSent ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Invitation sent!</p>
                <p className="text-xs text-gray-500">
                  An email has been sent to {inviteEmail} with setup instructions.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    Email address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="user@example.com"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {Object.entries(ROLE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Send Invite
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
