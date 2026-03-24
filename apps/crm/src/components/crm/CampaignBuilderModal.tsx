import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Mail, MessageSquare, Phone, ChevronRight, ChevronLeft, Send } from 'lucide-react'
import { api } from '../../lib/api'

type CampaignType = 'email' | 'sms' | 'call' | 'multi_channel'
type SegmentType =
  | 'high_risk'
  | 'open_care_gap'
  | 'no_recent_contact'
  | 'assigned_to_me'
  | 'all_active'
type ScheduleType = 'immediate' | 'scheduled'

interface CampaignForm {
  name: string
  type: CampaignType
  segment: SegmentType
  subject: string
  content: string
  scheduleType: ScheduleType
  scheduledAt: string
}

const DEFAULT_FORM: CampaignForm = {
  name: '',
  type: 'email',
  segment: 'high_risk',
  subject: '',
  content: '',
  scheduleType: 'immediate',
  scheduledAt: '',
}

const TYPE_OPTIONS: Array<{ value: CampaignType; label: string; icon: React.ReactNode; desc: string }> = [
  { value: 'email', label: 'Email', icon: <Mail className="h-5 w-5" />, desc: 'Send a personalised email campaign' },
  { value: 'sms', label: 'SMS', icon: <MessageSquare className="h-5 w-5" />, desc: 'Send a short text message' },
  { value: 'call', label: 'Outreach Call', icon: <Phone className="h-5 w-5" />, desc: 'Create a call task for coordinators' },
  { value: 'multi_channel', label: 'Multi-channel', icon: <Send className="h-5 w-5" />, desc: 'Email + SMS combined' },
]

const SEGMENT_OPTIONS: Array<{ value: SegmentType; label: string; desc: string }> = [
  { value: 'high_risk', label: 'High & Critical Risk Contacts', desc: 'Contacts with riskLevel = high or critical' },
  { value: 'open_care_gap', label: 'Open Care Gaps', desc: 'Contacts with at least one open care gap' },
  { value: 'no_recent_contact', label: 'No Recent Contact (30+ days)', desc: 'Contacts not reached in the last 30 days' },
  { value: 'assigned_to_me', label: 'Assigned to Me', desc: 'Contacts assigned to your user account' },
  { value: 'all_active', label: 'All Active Contacts', desc: 'All contacts with status = active' },
]

const PERSONALISATION_TOKENS = [
  { token: '{{firstName}}', label: 'First Name' },
  { token: '{{lastName}}', label: 'Last Name' },
  { token: '{{assignedTo}}', label: 'Assigned Coordinator' },
  { token: '{{openGapCount}}', label: 'Open Care Gap Count' },
]

const STEPS = ['Campaign Details', 'Audience', 'Content', 'Schedule & Review']

export default function CampaignBuilderModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<CampaignForm>(DEFAULT_FORM)
  const [insertTarget, setInsertTarget] = useState<'subject' | 'content'>('content')

  const createMutation = useMutation({
    mutationFn: (data: {
      name: string
      type: string
      segment: string
      subject: string
      content: string
      scheduledAt?: string
    }) => api.post('/api/campaigns', data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['campaigns'] })
      onClose()
    },
  })

  function insertToken(token: string) {
    if (insertTarget === 'subject') {
      setForm((f) => ({ ...f, subject: f.subject + token }))
    } else {
      setForm((f) => ({ ...f, content: f.content + token }))
    }
  }

  function canProceed() {
    switch (step) {
      case 0:
        return form.name.trim().length > 0
      case 1:
        return !!form.segment
      case 2:
        return form.content.trim().length > 0
      case 3:
        return form.scheduleType === 'immediate' || !!form.scheduledAt
      default:
        return true
    }
  }

  function handleSubmit() {
    createMutation.mutate({
      name: form.name,
      type: form.type,
      segment: form.segment,
      subject: form.subject,
      content: form.content,
      ...(form.scheduleType === 'scheduled' && form.scheduledAt
        ? { scheduledAt: new Date(form.scheduledAt).toISOString() }
        : {}),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-base font-bold text-gray-900">Campaign Builder</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Step {step + 1} of {STEPS.length} — {STEPS[step]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-1 bg-emerald-500 transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Step 0: Campaign Details */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Q2 High-Risk Outreach"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, type: opt.value }))}
                      className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors ${
                        form.type === opt.value
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div
                        className={`mt-0.5 ${form.type === opt.value ? 'text-emerald-600' : 'text-gray-400'}`}
                      >
                        {opt.icon}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-semibold ${
                            form.type === opt.value ? 'text-emerald-800' : 'text-gray-800'
                          }`}
                        >
                          {opt.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Audience */}
          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Choose the audience segment for this campaign. Contacts will be resolved at launch time.
              </p>
              {SEGMENT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, segment: opt.value }))}
                  className={`w-full flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-colors ${
                    form.segment === opt.value
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div
                    className={`h-4 w-4 mt-0.5 rounded-full border-2 flex-shrink-0 ${
                      form.segment === opt.value
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-gray-300'
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        form.segment === opt.value ? 'text-emerald-800' : 'text-gray-800'
                      }`}
                    >
                      {opt.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Content */}
          {step === 2 && (
            <div className="space-y-4">
              {(form.type === 'email' || form.type === 'multi_channel') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject line</label>
                  <input
                    type="text"
                    value={form.subject}
                    onFocus={() => setInsertTarget('subject')}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    placeholder="e.g. Your care plan needs attention"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message content *
                </label>
                <textarea
                  value={form.content}
                  onFocus={() => setInsertTarget('content')}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={8}
                  placeholder={
                    form.type === 'sms'
                      ? 'Hi {{firstName}}, this is a message from your care coordinator…'
                      : 'Dear {{firstName}},\n\nWe noticed you have {{openGapCount}} open care gap(s)…'
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none font-mono"
                />
                {form.type === 'sms' && (
                  <p className={`text-xs mt-1 ${form.content.length > 160 ? 'text-amber-600' : 'text-gray-400'}`}>
                    {form.content.length} / 160 characters
                    {form.content.length > 160 && ' — will send as multi-part SMS'}
                  </p>
                )}
              </div>

              {/* Personalisation tokens */}
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">
                  Personalisation tokens (click to insert into{' '}
                  <span className="text-emerald-600">{insertTarget}</span>):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {PERSONALISATION_TOKENS.map((pt) => (
                    <button
                      key={pt.token}
                      type="button"
                      onClick={() => insertToken(pt.token)}
                      className="rounded-md bg-gray-100 px-2 py-1 text-xs font-mono text-gray-700 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                      title={pt.label}
                    >
                      {pt.token}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Schedule & Review */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, scheduleType: 'immediate' }))}
                    className={`flex-1 rounded-xl border-2 p-3 text-center text-sm font-medium transition-colors ${
                      form.scheduleType === 'immediate'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Launch Immediately
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, scheduleType: 'scheduled' }))}
                    className={`flex-1 rounded-xl border-2 p-3 text-center text-sm font-medium transition-colors ${
                      form.scheduleType === 'scheduled'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Schedule for Later
                  </button>
                </div>

                {form.scheduleType === 'scheduled' && (
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Launch date & time
                    </label>
                    <input
                      type="datetime-local"
                      value={form.scheduledAt}
                      min={new Date().toISOString().slice(0, 16)}
                      onChange={(e) => setForm((f) => ({ ...f, scheduledAt: e.target.value }))}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                <p className="text-sm font-semibold text-gray-800">Campaign Summary</p>
                <dl className="space-y-1.5 text-sm">
                  {[
                    ['Name', form.name],
                    ['Type', TYPE_OPTIONS.find((o) => o.value === form.type)?.label],
                    ['Audience', SEGMENT_OPTIONS.find((o) => o.value === form.segment)?.label],
                    ['Subject', form.subject || '—'],
                    [
                      'Schedule',
                      form.scheduleType === 'immediate'
                        ? 'Launch immediately'
                        : form.scheduledAt
                        ? new Date(form.scheduledAt).toLocaleString()
                        : 'Not set',
                    ],
                  ].map(([label, value]) => (
                    <div key={label as string} className="flex gap-3">
                      <dt className="text-gray-500 w-20 flex-shrink-0">{label}</dt>
                      <dd className="font-medium text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Content preview:</p>
                  <p className="text-xs text-gray-700 bg-white rounded border border-gray-200 px-3 py-2 whitespace-pre-wrap max-h-24 overflow-y-auto font-mono">
                    {form.content || '(empty)'}
                  </p>
                </div>
              </div>

              {createMutation.isError && (
                <p className="text-sm text-red-600">
                  Failed to create campaign. Please try again.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || createMutation.isPending}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              {createMutation.isPending
                ? 'Creating…'
                : form.scheduleType === 'immediate'
                ? 'Launch Campaign'
                : 'Save Campaign'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
