import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Database, Plus, ChevronRight, X, ToggleLeft, ToggleRight } from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReferenceTable {
  id: string
  name: string
  description?: string
  isBuiltIn: boolean
  _count: { entries: number }
}

interface ReferenceEntry {
  id: string
  tableId: string
  code: string
  label: string
  description?: string
  isActive: boolean
  sortOrder: number
  effectiveFrom: string
  effectiveTo?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReferenceDataPage() {
  const qc = useQueryClient()
  const [selectedTable, setSelectedTable] = useState<ReferenceTable | null>(null)
  const [showAddTable, setShowAddTable] = useState(false)
  const [showAddEntry, setShowAddEntry] = useState(false)
  const [newTableName, setNewTableName] = useState('')
  const [newTableDesc, setNewTableDesc] = useState('')
  const [newEntryCode, setNewEntryCode] = useState('')
  const [newEntryLabel, setNewEntryLabel] = useState('')
  const [newEntryDesc, setNewEntryDesc] = useState('')

  const { data: tablesData, isLoading: tablesLoading } = useQuery({
    queryKey: ['reference-tables'],
    queryFn: () => api.get<{ data: ReferenceTable[] }>('/api/reference-tables').then((r) => r.data),
  })

  const { data: entriesData, isLoading: entriesLoading } = useQuery({
    queryKey: ['reference-entries', selectedTable?.id],
    queryFn: () =>
      api
        .get<{ data: ReferenceEntry[] }>(`/api/reference-tables/${selectedTable!.id}/entries`)
        .then((r) => r.data),
    enabled: !!selectedTable,
  })

  const createTable = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      api.post('/api/reference-tables', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reference-tables'] })
      setShowAddTable(false)
      setNewTableName('')
      setNewTableDesc('')
    },
  })

  const createEntry = useMutation({
    mutationFn: (data: { code: string; label: string; description?: string }) =>
      api.post(`/api/reference-tables/${selectedTable!.id}/entries`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reference-entries', selectedTable?.id] })
      setShowAddEntry(false)
      setNewEntryCode('')
      setNewEntryLabel('')
      setNewEntryDesc('')
    },
  })

  const toggleEntry = useMutation({
    mutationFn: ({ entryId, isActive }: { entryId: string; isActive: boolean }) =>
      isActive
        ? api.delete(`/api/reference-tables/${selectedTable!.id}/entries/${entryId}`)
        : api.patch(`/api/reference-tables/${selectedTable!.id}/entries/${entryId}`, { isActive: true, effectiveTo: null }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reference-entries', selectedTable?.id] }),
  })

  const tables = tablesData?.data ?? []
  const entries = entriesData?.data ?? []

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-gray-400" />
          <div>
            <h1 className="text-base font-semibold text-gray-900">Reference Data</h1>
            <p className="text-xs text-gray-500">Manage lookup tables used across all products</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddTable(true)}
          className="flex items-center gap-1.5 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          New Table
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Table list */}
        <div className="w-64 flex-shrink-0 overflow-y-auto border-r border-gray-200 bg-white">
          {tablesLoading ? (
            <div className="space-y-1 p-3">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 rounded" />)}
            </div>
          ) : tables.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">No tables yet</div>
          ) : (
            <ul className="p-2">
              {tables.map((t) => (
                <li key={t.id}>
                  <button
                    onClick={() => setSelectedTable(t)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left transition-colors ${
                      selectedTable?.id === t.id
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium leading-none">{t.name}</p>
                      <p className="mt-0.5 text-xs text-gray-400">{t._count.entries} entries</p>
                    </div>
                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-300" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Entries panel */}
        <div className="flex flex-1 flex-col overflow-hidden bg-gray-50">
          {!selectedTable ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <Database className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                <p className="text-sm text-gray-500">Select a table to view its entries</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">{selectedTable.name}</h2>
                  {selectedTable.description && (
                    <p className="text-xs text-gray-500">{selectedTable.description}</p>
                  )}
                </div>
                {!selectedTable.isBuiltIn && (
                  <button
                    onClick={() => setShowAddEntry(true)}
                    className="flex items-center gap-1.5 rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Entry
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {entriesLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
                  </div>
                ) : entries.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center">
                    <p className="text-sm text-gray-500">No entries. Add one to get started.</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <table className="min-w-full divide-y divide-gray-100">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Code</th>
                          <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Label</th>
                          <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Description</th>
                          <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Status</th>
                          {!selectedTable.isBuiltIn && (
                            <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500">Actions</th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {entries.map((e) => (
                          <tr key={e.id} className={!e.isActive ? 'opacity-50' : ''}>
                            <td className="px-4 py-2.5 font-mono text-xs text-gray-900">{e.code}</td>
                            <td className="px-4 py-2.5 text-sm text-gray-900">{e.label}</td>
                            <td className="px-4 py-2.5 text-xs text-gray-500">{e.description ?? '—'}</td>
                            <td className="px-4 py-2.5">
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                  e.isActive
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-500'
                                }`}
                              >
                                {e.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            {!selectedTable.isBuiltIn && (
                              <td className="px-4 py-2.5 text-right">
                                <button
                                  onClick={() => toggleEntry.mutate({ entryId: e.id, isActive: e.isActive })}
                                  className="text-gray-400 hover:text-gray-700"
                                  title={e.isActive ? 'Deactivate' : 'Reactivate'}
                                >
                                  {e.isActive ? (
                                    <ToggleRight className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <ToggleLeft className="h-4 w-4" />
                                  )}
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add table modal */}
      {showAddTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">New Reference Table</h2>
              <button onClick={() => setShowAddTable(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Table name *</label>
                <input
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="e.g. contact_types"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Description</label>
                <input
                  value={newTableDesc}
                  onChange={(e) => setNewTableDesc(e.target.value)}
                  placeholder="What is this table used for?"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowAddTable(false)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  createTable.mutate({ name: newTableName, description: newTableDesc || undefined })
                }
                disabled={!newTableName.trim() || createTable.isPending}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {createTable.isPending ? 'Creating…' : 'Create Table'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add entry modal */}
      {showAddEntry && selectedTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">
                Add Entry — {selectedTable.name}
              </h2>
              <button onClick={() => setShowAddEntry(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Code *</label>
                <input
                  value={newEntryCode}
                  onChange={(e) => setNewEntryCode(e.target.value)}
                  placeholder="e.g. HIGH_RISK"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Label *</label>
                <input
                  value={newEntryLabel}
                  onChange={(e) => setNewEntryLabel(e.target.value)}
                  placeholder="e.g. High Risk"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Description</label>
                <input
                  value={newEntryDesc}
                  onChange={(e) => setNewEntryDesc(e.target.value)}
                  placeholder="Optional description"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowAddEntry(false)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  createEntry.mutate({
                    code: newEntryCode,
                    label: newEntryLabel,
                    description: newEntryDesc || undefined,
                  })
                }
                disabled={!newEntryCode.trim() || !newEntryLabel.trim() || createEntry.isPending}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {createEntry.isPending ? 'Adding…' : 'Add Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
