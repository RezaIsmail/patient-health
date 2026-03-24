import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { Button } from '@patient-health/ui'
import { api } from '../../lib/api'
import { SA_VACCINES, VACCINE_SITES, VACCINE_ROUTES } from '../../data/saReferenceData'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ImmunisationModalProps {
  patientId: string
  immunisation?: {
    id: string
    vaccine: string
    dateGiven: string
    lotNumber?: string
  }
  onClose: () => void
  onSaved: () => void
}

interface FormFields {
  vaccineName: string
  occurrenceDate: string
  lotNumber: string
  site: string
  route: string
  notes: string
}

type FormErrors = Partial<Record<keyof FormFields, string>>

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputClass =
  'w-full rounded-lg border border-gray-200 bg-white h-10 px-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'

const selectClass =
  'w-full rounded-lg border border-gray-200 bg-white h-10 px-3 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'

const textareaClass =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'

interface FieldProps {
  id: string
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

function Field({ id, label, error, required = false, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {}
  if (!fields.vaccineName.trim()) errors.vaccineName = 'Vaccine name is required.'
  if (!fields.occurrenceDate) {
    errors.occurrenceDate = 'Date given is required.'
  } else {
    const date = new Date(fields.occurrenceDate)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    if (isNaN(date.getTime())) {
      errors.occurrenceDate = 'Enter a valid date.'
    } else if (date > today) {
      errors.occurrenceDate = 'Date given must not be in the future.'
    }
  }
  return errors
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function ImmunisationModal({
  patientId,
  immunisation,
  onClose,
  onSaved,
}: ImmunisationModalProps) {
  const isEdit = immunisation !== undefined
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const [fields, setFields] = useState<FormFields>({
    vaccineName: immunisation?.vaccine ?? '',
    occurrenceDate: immunisation?.dateGiven
      ? immunisation.dateGiven.slice(0, 10)
      : '',
    lotNumber: immunisation?.lotNumber ?? '',
    site: '',
    route: '',
    notes: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  // ── Focus trap ─────────────────────────────────────────────────────────────

  useEffect(() => {
    closeButtonRef.current?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return

      const focusable = panel.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // ── Prevent body scroll ────────────────────────────────────────────────────

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // ── Mutation ───────────────────────────────────────────────────────────────

  const mutation = useMutation({
    mutationFn: async (data: FormFields) => {
      const payload = {
        vaccineName: data.vaccineName.trim(),
        occurrenceDate: data.occurrenceDate,
        lotNumber: data.lotNumber.trim() || undefined,
        site: data.site || undefined,
        route: data.route || undefined,
        notes: data.notes.trim() || undefined,
        primarySource: true,
      }

      if (isEdit && immunisation) {
        await api.put(`/api/patients/${patientId}/immunisations/${immunisation.id}`, payload)
      } else {
        await api.post(`/api/patients/${patientId}/immunisations`, payload)
      }
    },
    onSuccess: () => {
      onSaved()
      onClose()
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : 'Failed to save immunisation. Please try again.'
      setSubmitError(message)
    },
  })

  function handleSubmit() {
    const validationErrors = validate(fields)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setSubmitError(null)
    mutation.mutate(fields)
  }

  const todayIso = new Date().toISOString().split('T')[0]

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? 'Edit Immunisation' : 'Add Immunisation'}
        className="fixed inset-y-0 right-0 z-50 flex w-[480px] flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? 'Edit Immunisation' : 'Add Immunisation'}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">
            <Field id="vaccineName" label="Vaccine Name" error={errors.vaccineName} required>
              <input
                id="vaccineName"
                type="text"
                list="vaccines-list"
                value={fields.vaccineName}
                onChange={(e) => setFields((f) => ({ ...f, vaccineName: e.target.value }))}
                className={inputClass}
                placeholder="Type to search vaccines…"
                autoComplete="off"
                aria-describedby={errors.vaccineName ? 'vaccineName-error' : undefined}
                aria-invalid={!!errors.vaccineName}
              />
              <datalist id="vaccines-list">
                {SA_VACCINES.map((v) => (
                  <option key={v} value={v} />
                ))}
              </datalist>
            </Field>

            <Field id="occurrenceDate" label="Date Given" error={errors.occurrenceDate} required>
              <input
                id="occurrenceDate"
                type="date"
                value={fields.occurrenceDate}
                onChange={(e) => setFields((f) => ({ ...f, occurrenceDate: e.target.value }))}
                className={inputClass}
                max={todayIso}
                aria-describedby={errors.occurrenceDate ? 'occurrenceDate-error' : undefined}
                aria-invalid={!!errors.occurrenceDate}
              />
            </Field>

            <Field id="lotNumber" label="Lot Number">
              <input
                id="lotNumber"
                type="text"
                value={fields.lotNumber}
                onChange={(e) => setFields((f) => ({ ...f, lotNumber: e.target.value }))}
                className={inputClass}
                placeholder="Optional"
              />
            </Field>

            <Field id="site" label="Administration Site">
              <select
                id="site"
                value={fields.site}
                onChange={(e) => setFields((f) => ({ ...f, site: e.target.value }))}
                className={selectClass}
              >
                <option value="">Select site… (optional)</option>
                {VACCINE_SITES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="route" label="Route">
              <select
                id="route"
                value={fields.route}
                onChange={(e) => setFields((f) => ({ ...f, route: e.target.value }))}
                className={selectClass}
              >
                <option value="">Select route… (optional)</option>
                {VACCINE_ROUTES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="immNotes" label="Notes">
              <textarea
                id="immNotes"
                value={fields.notes}
                onChange={(e) => setFields((f) => ({ ...f, notes: e.target.value }))}
                className={textareaClass}
                rows={3}
                placeholder="Optional clinical notes…"
              />
            </Field>

            {submitError && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {submitError}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-between border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 transition-colors hover:text-gray-700"
          >
            Cancel
          </button>
          <Button
            variant="default"
            size="default"
            onClick={handleSubmit}
            isLoading={mutation.isPending}
            disabled={mutation.isPending}
          >
            Save Immunisation
          </Button>
        </div>
      </div>
    </>
  )
}
