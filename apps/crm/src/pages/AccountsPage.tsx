import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Building2, Search, ChevronRight, Users } from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'

interface Account {
  id: string
  name: string
  type: string
  industry?: string
  city?: string
  state?: string
  _count?: { contacts: number }
  parentAccount?: { id: string; name: string }
}

const TYPE_COLORS: Record<string, string> = {
  health_system: 'bg-blue-100 text-blue-700',
  hospital: 'bg-indigo-100 text-indigo-700',
  clinic: 'bg-purple-100 text-purple-700',
  insurance_plan: 'bg-emerald-100 text-emerald-700',
  employer: 'bg-amber-100 text-amber-700',
  community_org: 'bg-orange-100 text-orange-700',
  pharmacy: 'bg-teal-100 text-teal-700',
  other: 'bg-gray-100 text-gray-600',
}

const TYPE_LABELS: Record<string, string> = {
  health_system: 'Health System',
  hospital: 'Hospital',
  clinic: 'Clinic',
  insurance_plan: 'Insurance Plan',
  employer: 'Employer',
  community_org: 'Community Org',
  pharmacy: 'Pharmacy',
  other: 'Other',
}

export default function AccountsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['accounts', search, typeFilter, page],
    queryFn: () =>
      api
        .get('/api/accounts', {
          params: {
            ...(search && { search }),
            ...(typeFilter && { type: typeFilter }),
            page,
            pageSize: 25,
          },
        })
        .then((r) => r.data),
    placeholderData: (prev) => prev,
  })

  const accounts: Account[] = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Accounts</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Organisations, health systems, and payers
            </p>
          </div>
          <button className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            <Building2 className="h-4 w-4" />
            New Account
          </button>
        </div>

        {/* Filters */}
        <div className="mt-4 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search accounts…"
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="">All Types</option>
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          {(search || typeFilter) && (
            <button
              onClick={() => { setSearch(''); setTypeFilter(''); setPage(1) }}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Building2 className="h-12 w-12 mb-3" />
            <p className="text-base font-medium">No accounts found</p>
            <p className="text-sm mt-1">
              {search || typeFilter ? 'Try adjusting your filters' : 'Create the first account to get started'}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3 text-xs text-gray-500">
              {meta?.total ?? 0} account{(meta?.total ?? 0) !== 1 ? 's' : ''} found
            </div>

            <div className="space-y-2">
              {accounts.map((account) => (
                <Link
                  key={account.id}
                  to={`/accounts/${account.id}`}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 hover:border-emerald-300 hover:shadow-sm transition-all"
                >
                  {/* Icon */}
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                    <Building2 className="h-5 w-5 text-emerald-600" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{account.name}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold flex-shrink-0 ${
                          TYPE_COLORS[account.type] ?? TYPE_COLORS.other
                        }`}
                      >
                        {TYPE_LABELS[account.type] ?? account.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      {(account.city || account.state) && (
                        <span className="text-xs text-gray-500">
                          {[account.city, account.state].filter(Boolean).join(', ')}
                        </span>
                      )}
                      {account.parentAccount && (
                        <span className="text-xs text-gray-400">
                          Parent: {account.parentAccount.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Contact count */}
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 flex-shrink-0">
                    <Users className="h-4 w-4" />
                    <span>{account._count?.contacts ?? 0}</span>
                  </div>

                  <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0" />
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {page} of {meta.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= meta.totalPages}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
