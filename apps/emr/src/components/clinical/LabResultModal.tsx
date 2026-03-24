import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { Button } from '@patient-health/ui'
import { api } from '../../lib/api'
import { SA_LAB_TESTS } from '../../data/saReferenceData'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LabResultModalProps {
  patientId: string
  result?: {
    id: string
    name: string
    value: string
    unit?: string
    referenceRange?: string
    isAbnormal: boolean
    resultDate: string
  }
  onClose: () => void
  onSaved: () => void
}

interface FormFields {
  display: string
  effectiveAt: string
  valueString: string
  valueQuantityRaw: string
  valueUnit: string
  referenceRangeLow: string
  referenceRangeHigh: string
  isAbnormal: boolean
  isQualitative: boolean
  notes: string
}

type FormErrors = Partial<Record<keyof FormFields | 'value', string>>

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

function parseReferenceRange(refRange?: string): { low: string; high: string } {
  if (!refRange) return { low: '', high: '' }
  // Format: "3.9 – 6.1" or "3.9–6.1"
  const match = refRange.match(/^([\d.]+)\s*[–\-]\s*([\d.]+)$/)
  if (match) return { low: match[1], high: match[2] }
  return { low: '', high: '' }
}

function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {}
  if (!fields.display.trim()) errors.display = 'Test name is required.'
  if (!fields.effectiveAt) {
    errors.effectiveAt = 'Date is required.'
  } else {
    const d = new Date(fields.effectiveAt)
    if (isNaN(d.getTime())) errors.effectiveAt = 'Enter a valid date.'
  }
  if (!fields.isQualitative) {
    if (!fields.valueQuantityRaw.trim()) {
      errors.value = 'Result value is required.'
    } else if (isNaN(Number(fields.valueQuantityRaw))) {
      errors.value = 'Enter a numeric value, or switch to text result.'
    }
  } else {
    if (!fields.valueString.trim()) errors.value = 'Result value is required.'
  }
  return errors
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function LabResultModal({
  patientId,
  result,
  onClose,
  onSaved,
}: LabResultModalProps) {
  const isEdit = result !== undefined
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const refRange = parseReferenceRange(result?.referenceRange)

  const [fields, setFields] = useState<FormFields>({
    display: result?.name ?? '',
    effectiveAt: result?.resultDate ? result.resultDate.slice(0, 10) : '',
    valueString: '',
    valueQuantityRaw: result?.value ?? '',
    valueUnit: result?.unit ?? '',
    referenceRangeLow: refRange.low,
    referenceRangeHigh: refRange.high,
    isAbnormal: result?.isAbnormal ?? false,
    isQualitative: false,
    notes: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  // ── Auto-check abnormal when numeric value changes ─────────────────────────

  useEffect(() => {
    if (fields.isQualitative) return
    const val = Number(fields.valueQuantityRaw)
    const low = Number(fields.referenceRangeLow)
    const high = Number(fields.referenceRangeHigh)
    if (
      !isNaN(val) &&
      fields.valueQuantityRaw !== '' &&
      fields.referenceRangeLow !== '' &&
      fields.referenceRangeHigh !== '' &&
      !isNaN(low) &&
      !isNaN(high)
    ) {
      setFields((f) => ({ ...f, isAbnormal: val < low || val > high }))
    }
  }, [fields.valueQuantityRaw, fields.referenceRangeLow, fields.referenceRangeHigh, fields.isQualitative])

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

  // ── Test name selection: auto-fill unit + ref range ────────────────────────

  function handleTestNameChange(value: string) {
    setFields((f) => ({ ...f, display: value }))

    const known = SA_LAB_TESTS.find((t) => t.name === value)
    if (known) {
      const isQualitative = known.refLow === null
      setFields((f) => ({
        ...f,
        display: value,
        valueUnit: known.unit ?? '',
        referenceRangeLow: known.refLow !== null ? String(known.refLow) : '',
        referenceRangeHigh: known.refHigh !== null ? String(known.refHigh) : '',
        isQualitative,
      }))
    }
  }

  // ── Mutation ───────────────────────────────────────────────────────────────

  const mutation = useMutation({
    mutationFn: async (data: FormFields) => {
      const payload: Record<string, unknown> = {
        display: data.display.trim(),
        effectiveAt: data.effectiveAt,
        isAbnormal: data.isAbnormal,
        notes: data.notes.trim() || undefined,
        status: 'final',
      }

      if (data.isQualitative) {
        payload.valueString = data.valueString.trim()
      } else {
        payload.valueQuantity = Number(data.valueQuantityRaw)
        if (data.valueUnit) payload.valueUnit = data.valueUnit.trim()
        if (data.referenceRangeLow !== '')
          payload.referenceRangeLow = Number(data.referenceRangeLow)
        if (data.referenceRangeHigh !== '')
          payload.referenceRangeHigh = Number(data.referenceRangeHigh)
      }

      if (isEdit && result) {
        await api.put(`/api/patients/${patientId}/observations/${result.id}`, payload)
      } else {
        await api.post(`/api/patients/${patientId}/observations`, payload)
      }
    },
    onSuccess: () => {
      onSaved()
      onClose()
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : 'Failed to save lab result. Please try again.'
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
        aria-label={isEdit ? 'Edit Lab Result' : 'Add Lab Result'}
        className="fixed inset-y-0 right-0 z-50 flex w-[480px] flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? 'Edit Lab Result' : 'Add Lab Result'}
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
            <Field id="labDisplay" label="Test Name" error={errors.display} required>
              <input
                id="labDisplay"
                type="text"
                list="lab-tests-list"
                value={fields.display}
                onChange={(e) => handleTestNameChange(e.target.value)}
                className={inputClass}
                placeholder="Type to search tests…"
                autoComplete="off"
                aria-describedby={errors.display ? 'labDisplay-error' : undefined}
                aria-invalid={!!errors.display}
              />
              <datalist id="lab-tests-list">
                {SA_LAB_TESTS.map((t) => (
                  <option key={t.name} value={t.name} />
                ))}
              </datalist>
            </Field>

            <Field id="labDate" label="Date" error={errors.effectiveAt} required>
              <input
                id="labDate"
                type="date"
                value={fields.effectiveAt}
                onChange={(e) => setFields((f) => ({ ...f, effectiveAt: e.target.value }))}
                className={inputClass}
                aria-describedby={errors.effectiveAt ? 'labDate-error' : undefined}
                aria-invalid={!!errors.effectiveAt}
              />
            </Field>

            {/* Text result toggle */}
            <div className="flex items-center gap-2">
              <input
                id="isQualitative"
                type="checkbox"
                checked={fields.isQualitative}
                onChange={(e) =>
                  setFields((f) => ({
                    ...f,
                    isQualitative: e.target.checked,
                    valueQuantityRaw: '',
                    valueString: '',
                    referenceRangeLow: '',
                    referenceRangeHigh: '',
                  }))
                }
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isQualitative" className="text-sm text-gray-700">
                Text result only (qualitative — e.g. Detected / Not detected)
              </label>
            </div>

            {fields.isQualitative ? (
              <Field id="valueString" label="Result" error={errors.value} required>
                <input
                  id="valueString"
                  type="text"
                  value={fields.valueString}
                  onChange={(e) => setFields((f) => ({ ...f, valueString: e.target.value }))}
                  className={inputClass}
                  placeholder="e.g. Not detected"
                  aria-describedby={errors.value ? 'valueString-error' : undefined}
                  aria-invalid={!!errors.value}
                />
              </Field>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field id="valueQuantity" label="Result Value" error={errors.value} required>
                    <input
                      id="valueQuantity"
                      type="number"
                      step="any"
                      value={fields.valueQuantityRaw}
                      onChange={(e) =>
                        setFields((f) => ({ ...f, valueQuantityRaw: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="0.0"
                      aria-describedby={errors.value ? 'valueQuantity-error' : undefined}
                      aria-invalid={!!errors.value}
                    />
                  </Field>

                  <Field id="valueUnit" label="Unit">
                    <input
                      id="valueUnit"
                      type="text"
                      value={fields.valueUnit}
                      onChange={(e) => setFields((f) => ({ ...f, valueUnit: e.target.value }))}
                      className={inputClass}
                      placeholder="e.g. mmol/L"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field id="refLow" label="Reference Low">
                    <input
                      id="refLow"
                      type="number"
                      step="any"
                      value={fields.referenceRangeLow}
                      onChange={(e) =>
                        setFields((f) => ({ ...f, referenceRangeLow: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="Lower bound"
                    />
                  </Field>

                  <Field id="refHigh" label="Reference High">
                    <input
                      id="refHigh"
                      type="number"
                      step="any"
                      value={fields.referenceRangeHigh}
                      onChange={(e) =>
                        setFields((f) => ({ ...f, referenceRangeHigh: e.target.value }))
                      }
                      className={inputClass}
                      placeholder="Upper bound"
                    />
                  </Field>
                </div>
              </>
            )}

            <div className="flex items-center gap-2">
              <input
                id="isAbnormal"
                type="checkbox"
                checked={fields.isAbnormal}
                onChange={(e) => setFields((f) => ({ ...f, isAbnormal: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <label htmlFor="isAbnormal" className="text-sm text-gray-700">
                Mark as abnormal
              </label>
            </div>

            <Field id="labNotes" label="Notes">
              <textarea
                id="labNotes"
                value={fields.notes}
                onChange={(e) => setFields((f) => ({ ...f, notes: e.target.value }))}
                className={textareaClass}
                rows={2}
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
            Save Result
          </Button>
        </div>
      </div>
    </>
  )
}
