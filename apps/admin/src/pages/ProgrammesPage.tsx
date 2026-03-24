import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ClipboardList, Plus, X, Users } from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'

interface Programme {
  id: string
  name: string
  description?: string
  programmeType: string
  status: string
  organisation: { id: string; name: string }
  _count: { enrollments: number }
}

interface ProgrammeDetail {
  id: string
  name: string
  description?: string
  programmeType: string
  status: string
  enrollmentsByState: Array<{ state: string; count: number }>
  enrollmentCapacity?: number
  _count: { enrollments: number }
}

const TYPE_CONFIG: Record<string, { label: string; className: string }> = {
  chronic_disease: { label: 'Chronic Disease', className: 'bg-red-50 text-red-700' },
  preventive: { label: 'Preventive', className: 'bg-green-50 text-green-700' },
  behavioural_health: { label: 'Behavioural Health', className: 'bg-purple-50 text-purple-700' },
  post_discharge: { label: 'Post-Discharge', className: 'bg-orange-50 text-orange-700' },
  complex_care: { label: 'Complex Care', className: 'bg-rose-50 text-rose-700' },
  other: { label: 'Other', className: 'bg-gray-50 text-gray-600' },
}

const STATUS_CONFIG: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-red-100 text-red-700',
}

const FUNNEL_STATES = ['referred', 'screened', 'eligible', 'consented', 'enrolled', 'active', 'graduated']

interface NewProgrammeForm {
  name: string
  description: string
  programmeType: string
  status: string
  organisationId: string
  eligibilityCriteria: string
}

const INITIAL_FORM: NewProgrammeForm = {
  name: '',
  description: '',
  programmeType: 'chronic_disease',
  status: 'draft',
  organisationId: '',
  eligibilityCriteria: '',
}

export default function ProgrammesPage() {
  const queryClient = useQueryClient()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<NewProgrammeForm>(INITIAL_FORM)
  const [formError, setFormError] = useState('')

  const { data, isLoading } = useQuery<{ data: Programme[]; meta: { total: number } }>({
    queryKey: ['admin-programmes'],
    queryFn: () => api.get('/api/programmes?pageSize=100').then((r) => r.data),
  })

  const { data: detailData } = useQuery<{ data: ProgrammeDetail }>({
    queryKey: ['admin-programme-detail', selectedId],
    queryFn: () => api.get(`/api/programmes/${selectedId}`).then((r) => r.data),
    enabled: !!selectedId,
  })

  const { data: orgsData } = useQuery<{ data: Array<{ id: string; name: string }> }>({
    queryKey: ['admin-orgs-list'],
    queryFn: () => api.get('/api/organisations?pageSize=100').then((r) => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.post('/api/programmes', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-programmes'] })
      setShowModal(false)
      setForm(INITIAL_FORM)
      setFormError('')
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to create programme'
      setFormError(msg)
    },
  })

  const programmes = data?.data ?? []
  const detail = detailData?.data

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name) {
      setFormError('Programme name is required')
      return
    }
    if (!form.organisationId) {
      setFormError('Organisation is required')
      return
    }

    let eligibilityCriteria: Record<string, unknown> | undefined
    if (form.eligibilityCriteria.trim()) {
      try {
        eligibilityCriteria = JSON.parse(form.eligibilityCriteria)
      } catch {
        setFormError('Eligibility criteria must be valid JSON')
        return
      }
    }

    setFormError('')
    createMutation.mutate({
      name: form.name,
      description: form.description || undefined,
      programmeType: form.programmeType,
      status: form.status,
      organisationId: form.organisationId,
      eligibilityCriteria,
    })
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left: Programme Cards */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-indigo-600" />
            <h1 className="text-base font-semibold text-gray-900">Programmes</h1>
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
            New Programme
          </button>
        </div>

        {/* Cards */}
        <div className="flex-1 overflow-auto p-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          ) : programmes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <ClipboardList className="h-12 w-12 mb-3" />
              <p className="text-base font-medium text-gray-600">No programmes yet</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 flex items-center gap-1.5 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                New Programme
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              {programmes.map((prog) => {
                const typeCfg = TYPE_CONFIG[prog.programmeType] ?? TYPE_CONFIG.other
                const statusCls = STATUS_CONFIG[prog.status] ?? STATUS_CONFIG.draft
                const isSelected = selectedId === prog.id

                return (
                  <div
                    key={prog.id}
                    onClick={() => setSelectedId(isSelected ? null : prog.id)}
                    className={`rounded-xl border p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-300 bg-indigo-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-indigo-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-medium text-gray-900 leading-tight">{prog.name}</h3>
                      <span
                        className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusCls}`}
                      >
                        {prog.status}
                      </span>
                    </div>

                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold ${typeCfg.className}`}
                    >
                      {typeCfg.label}
                    </span>

                    {prog.description && (
                      <p className="mt-2 text-xs text-gray-500 line-clamp-2">{prog.description}</p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        <span>{prog._count.enrollments} enrolled</span>
                      </div>
                      <p className="text-[10px] text-gray-400">{prog.organisation.name}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right: Detail Slide-over */}
      {selectedId && detail && (
        <div className="w-80 flex-shrink-0 overflow-auto border-l border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-900">Enrollment Funnel</h2>
            <button
              onClick={() => setSelectedId(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-4">
            <p className="text-sm font-medium text-gray-900 mb-1">{detail.name}</p>
            <p className="text-xs text-gray-500 mb-4">
              {detail._count.enrollments} total enrollments
              {detail.enrollmentCapacity && ` · ${detail.enrollmentCapacity} capacity`}
            </p>

            <div className="space-y-2">
              {FUNNEL_STATES.map((state) => {
                const found = detail.enrollmentsByState.find((e) => e.state === state)
                const count = found?.count ?? 0
                const total = detail._count.enrollments
                const pct = total > 0 ? Math.round((count / total) * 100) : 0

                return (
                  <div key={state}>
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-medium text-gray-700 capitalize">
                        {state.replace('_', ' ')}
                      </span>
                      <span className="text-gray-500">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div
                        className="h-2 rounded-full bg-indigo-500 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Non-funnel states */}
            {detail.enrollmentsByState
              .filter((e) => !FUNNEL_STATES.includes(e.state))
              .map(({ state, count }) => (
                <div key={state} className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-gray-500 capitalize">{state.replace('_', ' ')}</span>
                  <span className="font-medium text-gray-700">{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* New Programme Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900">New Programme</h2>
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
                  placeholder="Diabetes Management Programme"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Brief description of the programme goals and scope…"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Type</label>
                  <select
                    value={form.programmeType}
                    onChange={(e) => setForm((f) => ({ ...f, programmeType: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {Object.entries(TYPE_CONFIG).map(([v, { label }]) => (
                      <option key={v} value={v}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
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
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Eligibility Criteria{' '}
                  <span className="text-gray-400 font-normal">(JSON, optional)</span>
                </label>
                <textarea
                  value={form.eligibilityCriteria}
                  onChange={(e) => setForm((f) => ({ ...f, eligibilityCriteria: e.target.value }))}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder='{"age_min": 18, "diagnoses": ["E11"]}'
                />
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
                  {createMutation.isPending ? 'Creating…' : 'Create Programme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
