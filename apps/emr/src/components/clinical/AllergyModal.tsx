import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { Button } from '@patient-health/ui'
import { api } from '../../lib/api'
import { SA_ALLERGY_SUBSTANCES } from '../../data/saReferenceData'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AllergyModalProps {
  patientId: string
  allergy?: {
    id: string
    substance: string
    reaction?: string
    criticality?: string
  }
  onClose: () => void
  onSaved: () => void
}

interface FormFields {
  substance: string
  type: 'allergy' | 'intolerance'
  criticality: '' | 'low' | 'high' | 'unable-to-assess'
  reaction: string
  reactionSeverity: '' | 'mild' | 'moderate' | 'severe'
  onsetDate: string
}

type FormErrors = Partial<Record<keyof FormFields, string>>

// ─── Helpers ──────────────────────────────────────────────────────────────────

const inputClass =
  'w-full rounded-lg border border-gray-200 bg-white h-10 px-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'

const selectClass =
  'w-full rounded-lg border border-gray-200 bg-white h-10 px-3 text-sm text-gray-900 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'

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
  if (!fields.substance.trim()) errors.substance = 'Substance is required.'
  return errors
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export default function AllergyModal({
  patientId,
  allergy,
  onClose,
  onSaved,
}: AllergyModalProps) {
  const isEdit = allergy !== undefined
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const [fields, setFields] = useState<FormFields>({
    substance: allergy?.substance ?? '',
    type: 'allergy',
    criticality: (allergy?.criticality as FormFields['criticality']) ?? '',
    reaction: allergy?.reaction ?? '',
    reactionSeverity: '',
    onsetDate: '',
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
        substance: data.substance.trim(),
        type: data.type,
        criticality: data.criticality || undefined,
        reaction: data.reaction.trim() || undefined,
        reactionSeverity: data.reactionSeverity || undefined,
        onsetDate: data.onsetDate || undefined,
        clinicalStatus: 'active',
      }

      if (isEdit && allergy) {
        await api.put(`/api/patients/${patientId}/allergies/${allergy.id}`, payload)
      } else {
        await api.post(`/api/patients/${patientId}/allergies`, payload)
      }
    },
    onSuccess: () => {
      onSaved()
      onClose()
    },
    onError: (err: unknown) => {
      const message =
        err instanceof Error ? err.message : 'Failed to save allergy. Please try again.'
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
        aria-label={isEdit ? 'Edit Allergy' : 'Add Allergy'}
        className="fixed inset-y-0 right-0 z-50 flex w-[480px] flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            {isEdit ? 'Edit Allergy' : 'Add Allergy'}
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
            <Field id="allergySubstance" label="Substance" error={errors.substance} required>
              <input
                id="allergySubstance"
                type="text"
                list="allergy-substances-list"
                value={fields.substance}
                onChange={(e) => setFields((f) => ({ ...f, substance: e.target.value }))}
                className={inputClass}
                placeholder="Type or select a substance…"
                autoComplete="off"
                aria-describedby={errors.substance ? 'allergySubstance-error' : undefined}
                aria-invalid={!!errors.substance}
              />
              <datalist id="allergy-substances-list">
                {SA_ALLERGY_SUBSTANCES.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </Field>

            {/* Type — radio buttons */}
            <fieldset>
              <legend className="text-sm font-medium text-gray-700 mb-2">Type</legend>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="allergyType"
                    value="allergy"
                    checked={fields.type === 'allergy'}
                    onChange={() => setFields((f) => ({ ...f, type: 'allergy' }))}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Allergy
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="allergyType"
                    value="intolerance"
                    checked={fields.type === 'intolerance'}
                    onChange={() => setFields((f) => ({ ...f, type: 'intolerance' }))}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Intolerance
                </label>
              </div>
            </fieldset>

            <Field id="allergyCriticality" label="Criticality">
              <select
                id="allergyCriticality"
                value={fields.criticality}
                onChange={(e) =>
                  setFields((f) => ({
                    ...f,
                    criticality: e.target.value as FormFields['criticality'],
                  }))
                }
                className={selectClass}
              >
                <option value="">Select criticality… (optional)</option>
                <option value="low">Low</option>
                <option value="high">High</option>
                <option value="unable-to-assess">Unable to assess</option>
              </select>
            </Field>

            <Field id="allergyReaction" label="Reaction">
              <input
                id="allergyReaction"
                type="text"
                value={fields.reaction}
                onChange={(e) => setFields((f) => ({ ...f, reaction: e.target.value }))}
                className={inputClass}
                placeholder="e.g. Urticaria, angioedema (optional)"
              />
            </Field>

            <Field id="allergyReactionSeverity" label="Reaction Severity">
              <select
                id="allergyReactionSeverity"
                value={fields.reactionSeverity}
                onChange={(e) =>
                  setFields((f) => ({
                    ...f,
                    reactionSeverity: e.target.value as FormFields['reactionSeverity'],
                  }))
                }
                className={selectClass}
              >
                <option value="">Select severity… (optional)</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </Field>

            <Field id="allergyOnsetDate" label="Onset Date">
              <input
                id="allergyOnsetDate"
                type="date"
                value={fields.onsetDate}
                onChange={(e) => setFields((f) => ({ ...f, onsetDate: e.target.value }))}
                className={inputClass}
                max={new Date().toISOString().split('T')[0]}
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
            Save Allergy
          </Button>
        </div>
      </div>
    </>
  )
}
