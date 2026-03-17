import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Search, UserPlus, ChevronLeft, ChevronRight, Users } from 'lucide-react'
import { Button, Skeleton } from '@patient-health/ui'
import { usePatients } from '../hooks/usePatients'
import { format } from 'date-fns'
import type { PatientSummary } from '@patient-health/types'
import NewPatientModal from '../components/NewPatientModal'

// ─── Debounce hook ────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}

// ─── Age formatter ────────────────────────────────────────────────────────────

function formatDob(dob: string): string {
  try {
    return format(new Date(dob), 'MM/dd/yyyy')
  } catch {
    return dob
  }
}

// ─── Skeleton rows ────────────────────────────────────────────────────────────

function TableSkeletonRows({ count = 10 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} aria-hidden="true">
          <td className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </td>
          <td className="px-4 py-3"><Skeleton className="h-3.5 w-24" /></td>
          <td className="px-4 py-3"><Skeleton className="h-3.5 w-20" /></td>
          <td className="px-4 py-3"><Skeleton className="h-3.5 w-8" /></td>
          <td className="px-4 py-3"><Skeleton className="h-3.5 w-28" /></td>
          <td className="px-4 py-3"><Skeleton className="h-3.5 w-32" /></td>
        </tr>
      ))}
    </>
  )
}

// ─── Patient row ─────────────────────────────────────────────────────────────

function PatientRow({ patient, onClick }: { patient: PatientSummary; onClick: () => void }) {
  const initials = `${patient.firstName[0] ?? ''}${patient.lastName[0] ?? ''}`.toUpperCase()

  return (
    <tr
      className="cursor-pointer border-b border-gray-100 transition-colors hover:bg-blue-50/60 focus-within:bg-blue-50/60"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
      tabIndex={0}
      role="row"
      aria-label={`View chart for ${patient.firstName} ${patient.lastName}`}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
            {initials}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {patient.lastName}, {patient.firstName}
              {patient.preferredName && (
                <span className="ml-1 text-gray-400 font-normal">"{patient.preferredName}"</span>
              )}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 font-mono">{patient.mrn}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{formatDob(patient.dateOfBirth)}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{patient.age}</td>
      <td className="px-4 py-3 text-sm text-gray-600">{patient.phone ?? '—'}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{patient.primaryInsurance ?? '—'}</td>
    </tr>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ search }: { search: string }) {
  return (
    <tr>
      <td colSpan={6}>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Users className="h-6 w-6 text-gray-400" />
          </div>
          {search ? (
            <>
              <p className="text-sm font-medium text-gray-900">No patients found</p>
              <p className="mt-1 text-sm text-gray-500">
                No results for <span className="font-medium">"{search}"</span>. Try searching by
                MRN, full name, or date of birth.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-gray-900">No patients yet</p>
              <p className="mt-1 text-sm text-gray-500">
                Patients will appear here once they are registered.
              </p>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}

// ─── Success toast ────────────────────────────────────────────────────────────

function SuccessToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-lg"
    >
      <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      {message}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PatientsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [rawSearch, setRawSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Debounce search input 300ms — avoids an API call on every keystroke
  const debouncedSearch = useDebounce(rawSearch, 300)

  // Reset to page 1 whenever the search term changes
  const prevSearch = useRef(debouncedSearch)
  useEffect(() => {
    if (prevSearch.current !== debouncedSearch) {
      setPage(1)
      prevSearch.current = debouncedSearch
    }
  }, [debouncedSearch])

  const { data, isLoading, isError, isFetching } = usePatients({
    search: debouncedSearch,
    page,
    pageSize: 20,
  })

  const patients = data?.data ?? []
  const total = data?.meta?.total ?? 0
  const pageSize = data?.meta?.pageSize ?? 20
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* ── Page header ────────────────────────────────────────────────────── */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Patients</h1>
          {!isLoading && (
            <p className="text-xs text-gray-500 mt-0.5">
              {total.toLocaleString()} {total === 1 ? 'patient' : 'patients'}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search name, MRN, or DOB…"
              value={rawSearch}
              onChange={(e) => setRawSearch(e.target.value)}
              className="w-72 rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-400"
              aria-label="Search patients"
            />
          </div>

          <Button variant="default" size="sm" onClick={() => setModalOpen(true)}>
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            New Patient
          </Button>
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-auto">
        <table
          className="w-full border-collapse text-left"
          role="grid"
          aria-label="Patient list"
          aria-busy={isLoading || isFetching}
        >
          <thead className="sticky top-0 z-10 bg-gray-50 shadow-[0_1px_0_0_rgba(0,0,0,0.08)]">
            <tr>
              {[
                { label: 'Patient', width: 'w-56' },
                { label: 'MRN', width: 'w-32' },
                { label: 'Date of Birth', width: 'w-28' },
                { label: 'Age', width: 'w-16' },
                { label: 'Phone', width: 'w-36' },
                { label: 'Insurance', width: '' },
              ].map((col) => (
                <th
                  key={col.label}
                  className={`${col.width} px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500`}
                  scope="col"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={isFetching && !isLoading ? 'opacity-60 transition-opacity' : ''}>
            {isLoading ? (
              <TableSkeletonRows count={10} />
            ) : isError ? (
              <tr>
                <td colSpan={6} className="px-4 py-16 text-center">
                  <p className="text-sm font-medium text-gray-900">Failed to load patients</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Please refresh the page. If the problem persists, contact support.
                  </p>
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <EmptyState search={debouncedSearch} />
            ) : (
              patients.map((patient) => (
                <PatientRow
                  key={patient.id}
                  patient={patient}
                  onClick={() => navigate(`/patients/${patient.id}`)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ─────────────────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
          <p className="text-xs text-gray-500">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of{' '}
            {total.toLocaleString()} patients
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isFetching}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-gray-600">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isFetching}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ── New Patient modal ───────────────────────────────────────────────── */}
      <NewPatientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={(patient) => {
          queryClient.invalidateQueries({ queryKey: ['patients'] })
          setToast(`Patient registered — ${patient.mrn}`)
        }}
      />

      {/* ── Success toast ───────────────────────────────────────────────────── */}
      {toast && <SuccessToast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  )
}
