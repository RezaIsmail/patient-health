import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, Plus, Filter, ChevronRight, AlertTriangle } from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'
import { format } from 'date-fns'

interface Contact {
  id: string
  firstName: string
  lastName: string
  preferredName?: string
  dateOfBirth?: string
  phone?: string
  email?: string
  status: string
  riskLevel: string
  assignedTo?: string
  sdohFlags: string[]
  account?: { id: string; name: string } | null
  _count?: { careGaps: number; tasks: number }
  createdAt: string
}

const RISK_BADGE: Record<string, string> = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
}

const STATUS_BADGE: Record<string, string> = {
  lead: 'bg-gray-100 text-gray-600',
  prospect: 'bg-blue-100 text-blue-700',
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-gray-100 text-gray-500',
  deceased: 'bg-gray-200 text-gray-500',
}

export default function ContactsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [riskFilter, setRiskFilter] = useState('')
  const [page, setPage] = useState(1)

  const query = useQuery<{ data: Contact[]; meta: { total: number; totalPages: number } }>({
    queryKey: ['contacts', search, statusFilter, riskFilter, page],
    queryFn: () => {
      const params = new URLSearchParams()
      if (search) params.set('q', search)
      if (statusFilter) params.set('status', statusFilter)
      if (riskFilter) params.set('riskLevel', riskFilter)
      params.set('page', String(page))
      params.set('pageSize', '25')
      return api.get(`/api/contacts?${params}`).then((r) => r.data)
    },
  })

  const contacts = query.data?.data ?? []
  const meta = query.data?.meta

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
        <h1 className="text-base font-semibold text-gray-900">Contacts</h1>
        <button className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
          <Plus className="h-3.5 w-3.5" />
          New Contact
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 border-b border-gray-100 bg-white px-6 py-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by name, phone, email…"
            className="w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-1.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Filter className="h-3.5 w-3.5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All statuses</option>
            <option value="lead">Lead</option>
            <option value="prospect">Prospect</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={riskFilter}
            onChange={(e) => { setRiskFilter(e.target.value); setPage(1) }}
            className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">All risk levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {query.isLoading ? (
          <div className="p-6 space-y-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Search className="h-12 w-12 mb-3" />
            <p className="text-base font-medium">No contacts found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Risk</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Organisation</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Alerts</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Added</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 bg-white">
                {contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {contact.firstName} {contact.lastName}
                          {contact.preferredName && (
                            <span className="ml-1 text-gray-400 font-normal">({contact.preferredName})</span>
                          )}
                        </p>
                        {contact.email && <p className="text-xs text-gray-500">{contact.email}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGE[contact.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${RISK_BADGE[contact.riskLevel] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {contact.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {contact.account?.name ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {(contact._count?.careGaps ?? 0) > 0 && (
                          <span className="flex items-center gap-1 text-xs text-amber-600">
                            <AlertTriangle className="h-3 w-3" />
                            {contact._count?.careGaps} gaps
                          </span>
                        )}
                        {(contact._count?.tasks ?? 0) > 0 && (
                          <span className="text-xs text-blue-600">
                            {contact._count?.tasks} tasks
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {format(new Date(contact.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/contacts/${contact.id}`}
                        className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
                      >
                        View
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 bg-white px-6 py-3">
                <p className="text-xs text-gray-500">
                  Showing {contacts.length} of {meta.total.toLocaleString()} contacts
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-gray-500">Page {page} of {meta.totalPages}</span>
                  <button
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                    disabled={page === meta.totalPages}
                    className="rounded-md px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
