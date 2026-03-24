import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Building2, Plus, ChevronDown, ChevronRight, X } from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'

interface Site {
  id: string
  name: string
  siteType: string
  status: string
  _count: { departments: number; members: number }
}

interface Organisation {
  id: string
  name: string
  type: string
  status: string
  phone?: string
  email?: string
  city?: string
  state?: string
  _count: { sites: number; members: number; programmes: number }
}

const TYPE_LABELS: Record<string, string> = {
  health_system: 'Health System',
  clinic: 'Clinic',
  payer: 'Payer',
  employer: 'Employer',
  community_org: 'Community Org',
}

interface NewOrgForm {
  name: string
  type: string
  phone: string
  email: string
  addressLine1: string
  city: string
  state: string
  postalCode: string
}

const INITIAL_FORM: NewOrgForm = {
  name: '',
  type: 'clinic',
  phone: '',
  email: '',
  addressLine1: '',
  city: '',
  state: '',
  postalCode: '',
}

export default function OrganisationsPage() {
  const queryClient = useQueryClient()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<NewOrgForm>(INITIAL_FORM)
  const [formError, setFormError] = useState('')

  const { data, isLoading } = useQuery<{ data: Organisation[]; meta: { total: number } }>({
    queryKey: ['admin-organisations'],
    queryFn: () => api.get('/api/organisations?pageSize=100').then((r) => r.data),
  })

  const { data: sitesData } = useQuery<{ data: Site[] }>({
    queryKey: ['admin-org-sites', expandedId],
    queryFn: () => api.get(`/api/organisations/${expandedId}/sites`).then((r) => r.data),
    enabled: !!expandedId,
  })

  const createMutation = useMutation({
    mutationFn: (payload: NewOrgForm) => api.post('/api/organisations', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-organisations'] })
      setShowModal(false)
      setForm(INITIAL_FORM)
      setFormError('')
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to create organisation'
      setFormError(msg)
    },
  })

  const orgs = data?.data ?? []

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name) {
      setFormError('Organisation name is required')
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
          <Building2 className="h-4 w-4 text-indigo-600" />
          <h1 className="text-base font-semibold text-gray-900">Organisations</h1>
          {data?.meta && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
              {data.meta.total}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Organisation
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : orgs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Building2 className="h-12 w-12 mb-3" />
            <p className="text-base font-medium text-gray-600">No organisations yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              New Organisation
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-8" />
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Name
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Type
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">
                  Sites
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-center">
                  Members
                </th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orgs.map((org) => (
                <>
                  <tr
                    key={org.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === org.id ? null : org.id)}
                  >
                    <td className="px-6 py-3">
                      {expandedId === org.id ? (
                        <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <p className="font-medium text-gray-900">{org.name}</p>
                      {(org.city || org.state) && (
                        <p className="text-xs text-gray-400">
                          {[org.city, org.state].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-600">
                      {TYPE_LABELS[org.type] ?? org.type}
                    </td>
                    <td className="px-6 py-3 text-center text-gray-600">{org._count.sites}</td>
                    <td className="px-6 py-3 text-center text-gray-600">{org._count.members}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          org.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {org.status}
                      </span>
                    </td>
                  </tr>

                  {expandedId === org.id && (
                    <tr key={`${org.id}-expand`}>
                      <td colSpan={6} className="bg-indigo-50 px-12 py-4">
                        <p className="mb-2 text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                          Sites
                        </p>
                        {!sitesData ? (
                          <div className="space-y-1">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                          </div>
                        ) : sitesData.data.length === 0 ? (
                          <p className="text-xs text-indigo-500">No sites configured</p>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                            {sitesData.data.map((site) => (
                              <div
                                key={site.id}
                                className="rounded-lg border border-indigo-100 bg-white px-3 py-2"
                              >
                                <p className="text-xs font-medium text-gray-900">{site.name}</p>
                                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-500">
                                  <span className="capitalize">{site.siteType}</span>
                                  <span>·</span>
                                  <span>{site._count.departments} depts</span>
                                  <span>·</span>
                                  <span>{site._count.members} members</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* New Org Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900">New Organisation</h2>
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
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Community Health Partners"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {Object.entries(TYPE_LABELS).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
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
                    placeholder="admin@org.com"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Address</label>
                <input
                  value={form.addressLine1}
                  onChange={(e) => setForm((f) => ({ ...f, addressLine1: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">City</label>
                  <input
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Austin"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">State</label>
                  <input
                    value={form.state}
                    onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="TX"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Zip</label>
                  <input
                    value={form.postalCode}
                    onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="78701"
                  />
                </div>
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
                  {createMutation.isPending ? 'Creating…' : 'Create Organisation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
