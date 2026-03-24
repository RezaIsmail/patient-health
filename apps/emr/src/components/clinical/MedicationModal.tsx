import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { Button } from '@patient-health/ui'
import { api } from '../../lib/api'
import { SA_MEDICATIONS, MEDICATION_FREQUENCIES, MEDICATION_ROUTES } from '../../data/saReferenceData'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MedicationModalProps {
  patientId: string
  medication?: {
    id: string
    name: string
    dose?: string
    frequency?: string
    status: string
  }
  onClose: () => void
  onSaved: () => void
}

interface FormFields {
  medicationName: string
  dose: string
  frequency: string
  route: string
  notes: string
  status: 'active' | 'on-hold' | 'stopped' | 'completed'
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

// Flat list of all SA medication names for datalist
const allMedications: string[] = Object.values(SA_MEDICATIONS).flat()

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {}
  if (!fields.medicationName.trim()) errors.medicationName = 'Medication name is required.'
  return errors
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function MedicationModal({
  patientId,
  medication,
  onClose,
  onSaved,
}: MedicationModalProps) {
  const isEdit = medication !== undefined
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const [fields, setFields] = useState<FormFields>({
    medicationName: medication?.name ?? '',
    dose: medication?.dose ?? '',
    frequency: medication?.frequency ?? '',
    route: '',
    notes: '',
    status: (medication?.status as FormFields['status']) ?? 'active',
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

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // ── Mutation ───────────────────────────────────────────────────────────────

  const mutation = useMutation({
    mutationFn: async (data: FormFields) => {
      const payload: Record<string, unknown> = {
        medicationName: data.medicationName.trim(),
        dose: data.dose.trim() || undefined,
        frequency: data.frequency || undefined,
        route: data.route || undefined,
        notes: data.notes.trim() || undefined,
      }

      if (isEdit) {
        payload.status = data.status
        await api.put(`/api/patients/${patientId}/medications/${medication!.id}`, payload)
      } else {
        await api.post(`/api/patients/${patientId}/medications`, payload)
      }
    },
    onSuccess: () => {
      onSaved()
      onClose()
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : 'Failed to save medication. Please try again.'
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
        aria-label={isEdit ? 'Edit Medication' : 'Add Medication'}
        className="fixed inset-y-0 right-0 z-50 flex w-[480px] flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? 'Edit Medication' : 'Add Medication'}
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
            <Field
              id="medicationName"
              label="Medication Name"
              error={errors.medicationName}
              required
            >
              <input
                id="medicationName"
                type="text"
                list="medications-list"
                value={fields.medicationName}
                onChange={(e) => setFields((f) => ({ ...f, medicationName: e.target.value }))}
                className={inputClass}
                placeholder="Type to search medications…"
                autoComplete="off"
                aria-describedby={errors.medicationName ? 'medicationName-error' : undefined}
                aria-invalid={!!errors.medicationName}
              />
              <datalist id="medications-list">
                {allMedications.map((m) => (
                  <option key={m} value={m} />
                ))}
              </datalist>
            </Field>

            <Field id="medDose" label="Dose">
              <input
                id="medDose"
                type="text"
                value={fields.dose}
                onChange={(e) => setFields((f) => ({ ...f, dose: e.target.value }))}
                className={inputClass}
                placeholder="e.g. 500mg, 10mg, 2 puffs (optional)"
              />
            </Field>

            <Field id="medFrequency" label="Frequency">
              <select
                id="medFrequency"
                value={fields.frequency}
                onChange={(e) => setFields((f) => ({ ...f, frequency: e.target.value }))}
                className={selectClass}
              >
                <option value="">Select frequency… (optional)</option>
                {MEDICATION_FREQUENCIES.map((freq) => (
                  <option key={freq} value={freq}>
                    {freq}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="medRoute" label="Route">
              <select
                id="medRoute"
                value={fields.route}
                onChange={(e) => setFields((f) => ({ ...f, route: e.target.value }))}
                className={selectClass}
              >
                <option value="">Select route… (optional)</option>
                {MEDICATION_ROUTES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="medNotes" label="Notes / Instructions">
              <textarea
                id="medNotes"
                value={fields.notes}
                onChange={(e) => setFields((f) => ({ ...f, notes: e.target.value }))}
                className={textareaClass}
                rows={2}
                placeholder="Optional instructions or clinical notes…"
              />
            </Field>

            {isEdit && (
              <Field id="medStatus" label="Status">
                <select
                  id="medStatus"
                  value={fields.status}
                  onChange={(e) =>
                    setFields((f) => ({
                      ...f,
                      status: e.target.value as FormFields['status'],
                    }))
                  }
                  className={selectClass}
                >
                  <option value="active">Active</option>
                  <option value="on-hold">On hold</option>
                  <option value="stopped">Stopped</option>
                  <option value="completed">Completed</option>
                </select>
              </Field>
            )}

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
            Save Medication
          </Button>
        </div>
      </div>
    </>
  )
}
