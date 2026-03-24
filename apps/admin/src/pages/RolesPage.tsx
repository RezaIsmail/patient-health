import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Lock, Plus, Shield, X } from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'

interface Permission {
  resource_type: string
  action: string
  scope: string
}

interface Role {
  id: string
  name: string
  description?: string
  productScope: string
  isBuiltIn: boolean
  organisationId?: string
  permissions: Permission[]
  _count: { userRoles: number }
  createdAt: string
}

const RESOURCE_TYPES = [
  'Member',
  'Programme',
  'User',
  'Organisation',
  'Role',
  'AuditLog',
  'Integration',
  'Configuration',
]

const PRODUCT_SCOPE_CONFIG: Record<string, string> = {
  emr: 'bg-blue-100 text-blue-700',
  crm: 'bg-emerald-100 text-emerald-700',
  admin: 'bg-indigo-100 text-indigo-700',
  platform: 'bg-gray-100 text-gray-700',
}

const ACTION_CONFIG: Record<string, string> = {
  read: 'bg-sky-50 text-sky-700',
  write: 'bg-amber-50 text-amber-700',
  delete: 'bg-red-50 text-red-700',
  admin: 'bg-purple-50 text-purple-700',
}

interface NewRoleForm {
  name: string
  description: string
  productScope: string
}

const INITIAL_FORM: NewRoleForm = {
  name: '',
  description: '',
  productScope: 'platform',
}

export default function RolesPage() {
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<NewRoleForm>(INITIAL_FORM)
  const [formError, setFormError] = useState('')

  const { data, isLoading } = useQuery<{ data: Role[]; meta: { total: number } }>({
    queryKey: ['admin-roles'],
    queryFn: () => api.get('/api/roles?pageSize=100').then((r) => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (payload: NewRoleForm) => api.post('/api/roles', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] })
      setShowModal(false)
      setForm(INITIAL_FORM)
      setFormError('')
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to create role'
      setFormError(msg)
    },
  })

  const roles = data?.data ?? []

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name) {
      setFormError('Role name is required')
      return
    }
    setFormError('')
    createMutation.mutate(form)
  }

  function getPermissionLevel(role: Role, resourceType: string): string | null {
    const perms = role.permissions.filter(
      (p) => p.resource_type.toLowerCase() === resourceType.toLowerCase()
    )
    if (!perms.length) return null
    // Return highest action level
    if (perms.some((p) => p.action === 'admin')) return 'admin'
    if (perms.some((p) => p.action === 'delete')) return 'delete'
    if (perms.some((p) => p.action === 'write')) return 'write'
    if (perms.some((p) => p.action === 'read')) return 'read'
    return null
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-indigo-600" />
          <h1 className="text-base font-semibold text-gray-900">Roles & RBAC</h1>
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
          New Role
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Role list */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : roles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Lock className="h-10 w-10 mb-3" />
            <p className="text-sm font-medium text-gray-600">No roles configured</p>
          </div>
        ) : (
          <>
            {/* Role Cards */}
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="rounded-xl border border-gray-200 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {role.isBuiltIn ? (
                        <Shield className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      )}
                      <p className="font-medium text-gray-900 text-sm">{role.name}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {role.isBuiltIn && (
                        <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700">
                          Built-in
                        </span>
                      )}
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${PRODUCT_SCOPE_CONFIG[role.productScope] ?? 'bg-gray-100 text-gray-600'}`}
                      >
                        {role.productScope}
                      </span>
                    </div>
                  </div>

                  {role.description && (
                    <p className="mt-1.5 text-xs text-gray-500">{role.description}</p>
                  )}

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                    <span>{role.permissions.length} permissions</span>
                    <span>{role._count.userRoles} users</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Permission Matrix */}
            <div>
              <h2 className="mb-3 text-sm font-semibold text-gray-900">Permission Matrix</h2>
              <div className="rounded-xl border border-gray-200 bg-white overflow-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 uppercase tracking-wide w-40">
                        Role
                      </th>
                      {RESOURCE_TYPES.map((rt) => (
                        <th
                          key={rt}
                          className="px-3 py-3 text-center font-semibold text-gray-500 uppercase tracking-wide"
                        >
                          {rt}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {roles.map((role) => (
                      <tr key={role.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {role.isBuiltIn && (
                              <Shield className="h-3 w-3 text-indigo-400 flex-shrink-0" />
                            )}
                            <span className="font-medium text-gray-800 truncate max-w-[120px]">
                              {role.name}
                            </span>
                          </div>
                        </td>
                        {RESOURCE_TYPES.map((rt) => {
                          const level = getPermissionLevel(role, rt)
                          return (
                            <td key={rt} className="px-3 py-3 text-center">
                              {level ? (
                                <span
                                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${ACTION_CONFIG[level] ?? 'bg-gray-100 text-gray-600'}`}
                                >
                                  {level}
                                </span>
                              ) : (
                                <span className="text-gray-200">—</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* New Role Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900">New Role</h2>
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
                  placeholder="clinical_supervisor"
                  autoFocus
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Clinical supervisors who manage care teams…"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Product Scope
                </label>
                <select
                  value={form.productScope}
                  onChange={(e) => setForm((f) => ({ ...f, productScope: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="platform">Platform (all products)</option>
                  <option value="emr">EMR only</option>
                  <option value="crm">CRM only</option>
                  <option value="admin">Admin only</option>
                </select>
              </div>

              <p className="text-xs text-gray-400">
                Permissions can be assigned after creating the role. Built-in roles cannot be
                modified.
              </p>

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
                  {createMutation.isPending ? 'Creating…' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
