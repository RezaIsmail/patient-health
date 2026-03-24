import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FileCode, Plus, X, ChevronRight, ArrowRight } from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'
import { useAuthStore } from '../stores/authStore'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Template {
  id: string
  name: string
  description?: string
  templateType: 'communication' | 'care_plan' | 'document'
  status: string
  versionNumber: number
  createdBy: string
  approvedBy?: string
  approvedAt?: string
  createdAt: string
  updatedAt: string
}

interface TemplateDetail extends Template {
  contentBody: string
  variableTokens: Array<{ token: string; description: string; required: boolean }>
  programmeIds: string[]
}

const TYPE_CONFIG: Record<string, { label: string; className: string }> = {
  communication: { label: 'Communication', className: 'bg-blue-50 text-blue-700' },
  care_plan: { label: 'Care Plan', className: 'bg-green-50 text-green-700' },
  document: { label: 'Document', className: 'bg-amber-50 text-amber-700' },
}

const STATUS_CONFIG: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  submitted: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  archived: 'bg-red-100 text-red-600',
}

const STATUS_TRANSITIONS: Record<string, Array<{ to: string; label: string }>> = {
  draft: [{ to: 'submitted', label: 'Submit for Approval' }, { to: 'archived', label: 'Archive' }],
  submitted: [{ to: 'approved', label: 'Approve' }, { to: 'draft', label: 'Return to Draft' }],
  approved: [{ to: 'active', label: 'Activate' }, { to: 'archived', label: 'Archive' }],
  active: [{ to: 'archived', label: 'Archive' }],
  archived: [],
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TemplatesPage() {
  const qc = useQueryClient()
  const { user } = useAuthStore()
  const [filterType, setFilterType] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDetail | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({
    name: '',
    description: '',
    templateType: 'communication' as const,
    contentBody: '',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['templates', filterType, filterStatus],
    queryFn: () => {
      const params = new URLSearchParams()
      if (filterType) params.set('templateType', filterType)
      if (filterStatus) params.set('status', filterStatus)
      return api
        .get<{ data: Template[]; meta: { total: number } }>(`/api/templates?${params}`)
        .then((r) => r.data)
    },
  })

  const fetchDetail = useMutation({
    mutationFn: (id: string) =>
      api.get<{ data: TemplateDetail }>(`/api/templates/${id}`).then((r) => r.data.data),
    onSuccess: (t) => setSelectedTemplate(t),
  })

  const createTemplate = useMutation({
    mutationFn: (data: typeof form & { createdBy: string }) =>
      api.post('/api/templates', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['templates'] })
      setShowCreate(false)
      setForm({ name: '', description: '', templateType: 'communication', contentBody: '' })
    },
  })

  const transitionStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/api/templates/${id}/status`, { status, actorId: user?.id ?? 'unknown' }),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['templates'] })
      fetchDetail.mutate(id)
    },
  })

  const templates = data?.data ?? []

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <FileCode className="h-5 w-5 text-gray-400" />
          <div>
            <h1 className="text-base font-semibold text-gray-900">Templates</h1>
            <p className="text-xs text-gray-500">
              {data?.meta.total ?? 0} template{data?.meta.total !== 1 ? 's' : ''} — communication, care plan, and document
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          New Template
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 border-b border-gray-200 bg-white px-6 py-2">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-md border border-gray-300 py-1 pl-2 pr-7 text-xs text-gray-700 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All types</option>
          <option value="communication">Communication</option>
          <option value="care_plan">Care Plan</option>
          <option value="document">Document</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-md border border-gray-300 py-1 pl-2 pr-7 text-xs text-gray-700 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="approved">Approved</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* List */}
        <div className="flex w-80 flex-shrink-0 flex-col overflow-hidden border-r border-gray-200 bg-white">
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="space-y-1 p-3">
                {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded" />)}
              </div>
            ) : templates.length === 0 ? (
              <div className="p-8 text-center">
                <FileCode className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                <p className="text-sm text-gray-500">No templates found</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {templates.map((t) => (
                  <li key={t.id}>
                    <button
                      onClick={() => fetchDetail.mutate(t.id)}
                      className={`flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 ${
                        selectedTemplate?.id === t.id ? 'bg-indigo-50' : ''
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">{t.name}</p>
                        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                              TYPE_CONFIG[t.templateType]?.className ?? 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {TYPE_CONFIG[t.templateType]?.label ?? t.templateType}
                          </span>
                          <span
                            className={`inline-flex rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                              STATUS_CONFIG[t.status] ?? 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {t.status}
                          </span>
                          <span className="text-[10px] text-gray-400">v{t.versionNumber}</span>
                        </div>
                      </div>
                      <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-gray-300" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Detail */}
        <div className="flex flex-1 flex-col overflow-hidden bg-gray-50">
          {!selectedTemplate ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <FileCode className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                <p className="text-sm text-gray-500">Select a template to view details</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-6">
              {/* Title row */}
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">{selectedTemplate.name}</h2>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_CONFIG[selectedTemplate.templateType]?.className}`}>
                      {TYPE_CONFIG[selectedTemplate.templateType]?.label}
                    </span>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CONFIG[selectedTemplate.status]}`}>
                      {selectedTemplate.status}
                    </span>
                    <span className="text-xs text-gray-400">v{selectedTemplate.versionNumber}</span>
                  </div>
                </div>

                {/* Workflow transitions */}
                {STATUS_TRANSITIONS[selectedTemplate.status]?.length > 0 && (
                  <div className="flex gap-2">
                    {STATUS_TRANSITIONS[selectedTemplate.status].map(({ to, label }) => (
                      <button
                        key={to}
                        onClick={() => transitionStatus.mutate({ id: selectedTemplate.id, status: to })}
                        disabled={transitionStatus.isPending}
                        className="flex items-center gap-1.5 rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-white disabled:opacity-50"
                      >
                        {label}
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {selectedTemplate.description && (
                <p className="mb-4 text-sm text-gray-600">{selectedTemplate.description}</p>
              )}

              {/* Content */}
              <div className="mb-4 rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-100 px-4 py-2.5">
                  <p className="text-xs font-medium text-gray-700">Template content</p>
                </div>
                <div className="p-4">
                  <pre className="whitespace-pre-wrap font-mono text-xs text-gray-800 leading-relaxed">
                    {selectedTemplate.contentBody}
                  </pre>
                </div>
              </div>

              {/* Tokens */}
              {selectedTemplate.variableTokens.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-white">
                  <div className="border-b border-gray-100 px-4 py-2.5">
                    <p className="text-xs font-medium text-gray-700">Variable tokens</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {selectedTemplate.variableTokens.map((tok) => (
                      <div key={tok.token} className="flex items-center gap-3 px-4 py-2.5">
                        <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-gray-800">
                          {tok.token}
                        </code>
                        <span className="flex-1 text-xs text-gray-600">{tok.description}</span>
                        {tok.required && (
                          <span className="text-xs font-medium text-red-600">Required</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-500">
                <div>Created by: <span className="font-medium text-gray-700">{selectedTemplate.createdBy}</span></div>
                {selectedTemplate.approvedBy && (
                  <div>Approved by: <span className="font-medium text-gray-700">{selectedTemplate.approvedBy}</span></div>
                )}
                <div>Created: {new Date(selectedTemplate.createdAt).toLocaleDateString()}</div>
                <div>Updated: {new Date(selectedTemplate.updatedAt).toLocaleDateString()}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">New Template</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Template name"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Type *</label>
                <select
                  value={form.templateType}
                  onChange={(e) => setForm({ ...form, templateType: e.target.value as typeof form.templateType })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="communication">Communication (email/SMS)</option>
                  <option value="care_plan">Care Plan</option>
                  <option value="document">Document (consent, intake)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What is this template for?"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Content *</label>
                <textarea
                  value={form.contentBody}
                  onChange={(e) => setForm({ ...form, contentBody: e.target.value })}
                  rows={6}
                  placeholder="Template content. Use {{variable}} syntax for dynamic tokens."
                  className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  createTemplate.mutate({ ...form, createdBy: user?.id ?? 'unknown' })
                }
                disabled={!form.name.trim() || !form.contentBody.trim() || createTemplate.isPending}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {createTemplate.isPending ? 'Creating…' : 'Create Template'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
