import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { Button } from '@patient-health/ui'
import { api } from '../../lib/api'

// Common ICD-10 conditions for quick selection
const COMMON_CONDITIONS = [
  { code: 'I10', display: 'Essential Hypertension' },
  { code: 'E11.9', display: 'Type 2 Diabetes Mellitus' },
  { code: 'E78.5', display: 'Hyperlipidaemia' },
  { code: 'J44.1', display: 'COPD with Acute Exacerbation' },
  { code: 'J45.9', display: 'Asthma, unspecified' },
  { code: 'F32.9', display: 'Major Depressive Disorder' },
  { code: 'M54.5', display: 'Low Back Pain' },
  { code: 'K21.0', display: 'GORD with Oesophagitis' },
  { code: 'N18.3', display: 'Chronic Kidney Disease, stage 3' },
  { code: 'E66.9', display: 'Obesity, unspecified' },
  { code: 'I25.1', display: 'Atherosclerotic Heart Disease' },
  { code: 'J06.9', display: 'Acute Upper Respiratory Infection' },
  { code: 'A09', display: 'Gastroenteritis' },
  { code: 'Z71.1', display: 'Person Consulting for Explanation of Investigation Findings' },
] as const

interface ConditionModalProps {
  patientId: string
  condition?: {
    id: string
    display: string
    code?: string
    severity?: string
    onsetDate?: string
  }
  onClose: () => void
  onSaved: () => void
}

interface FormFields {
  icd10Code: string
  display: string
  severity: 'mild' | 'moderate' | 'severe' | ''
  onsetDate: string
  clinicalStatus: 'active' | 'resolved' | 'inactive'
}

export default function ConditionModal({ patientId, condition, onClose, onSaved }: ConditionModalProps) {
  const isEdit = !!condition
  const firstRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormFields>({
    icd10Code: condition?.code ?? '',
    display: condition?.display ?? '',
    severity: (condition?.severity as FormFields['severity']) ?? '',
    onsetDate: condition?.onsetDate ?? '',
    clinicalStatus: 'active',
  })

  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    firstRef.current?.focus()
  }, [])

  const set = (field: keyof FormFields, value: string) =>
    setForm((f) => ({ ...f, [field]: value }))

  const filtered = form.display.length >= 2
    ? COMMON_CONDITIONS.filter((c) =>
        c.display.toLowerCase().includes(form.display.toLowerCase()) ||
        c.code.toLowerCase().includes(form.display.toLowerCase())
      ).slice(0, 6)
    : []

  const saveMutation = useMutation({
    mutationFn: () => {
      const payload = {
        icd10Code: form.icd10Code || undefined,
        display: form.display,
        severity: form.severity || undefined,
        onsetDate: form.onsetDate || undefined,
        clinicalStatus: form.clinicalStatus,
      }
      if (isEdit) {
        return api.put(`/api/patients/${patientId}/conditions/${condition!.id}`, payload)
      }
      return api.post(`/api/patients/${patientId}/conditions`, payload)
    },
    onSuccess: () => {
      onSaved()
      onClose()
    },
  })

  const valid = form.display.trim().length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-gray-900">
            {isEdit ? 'Edit Condition' : 'Add Condition'}
          </h2>
          <button onClick={onClose} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-5 py-4">
          {/* Display name with autocomplete */}
          <div className="relative">
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Condition <span className="text-red-500">*</span>
            </label>
            <input
              ref={firstRef}
              type="text"
              value={form.display}
              onChange={(e) => {
                set('display', e.target.value)
                setShowSuggestions(true)
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              placeholder="Start typing a diagnosis…"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {showSuggestions && filtered.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                {filtered.map((c) => (
                  <li key={c.code}>
                    <button
                      type="button"
                      onMouseDown={() => {
                        set('display', c.display)
                        set('icd10Code', c.code)
                        setShowSuggestions(false)
                      }}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-blue-50"
                    >
                      <span className="font-mono text-xs text-gray-400 w-14 flex-shrink-0">{c.code}</span>
                      <span className="text-gray-800">{c.display}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ICD-10 code */}
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">ICD-10 Code</label>
            <input
              type="text"
              value={form.icd10Code}
              onChange={(e) => set('icd10Code', e.target.value.toUpperCase())}
              placeholder="e.g. I10"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Severity + Onset in a row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Severity</label>
              <select
                value={form.severity}
                onChange={(e) => set('severity', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">— unspecified —</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">Onset Date</label>
              <input
                type="date"
                value={form.onsetDate}
                onChange={(e) => set('onsetDate', e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {saveMutation.isError && (
            <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
              Could not save — please try again
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-200 px-5 py-4">
          <Button variant="outline" size="sm" onClick={onClose} disabled={saveMutation.isPending}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => saveMutation.mutate()}
            disabled={!valid || saveMutation.isPending}
          >
            {saveMutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Condition'}
          </Button>
        </div>
      </div>
    </div>
  )
}
