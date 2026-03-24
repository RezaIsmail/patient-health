import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MessageSquare, Phone, Mail, FileText, Plus, X } from 'lucide-react'
import { api } from '../../lib/api'
import { Skeleton } from '@patient-health/ui'
import { format } from 'date-fns'

type CommType = 'email' | 'sms' | 'phone_call' | 'note' | 'portal_message'
type CommDirection = 'inbound' | 'outbound'
type CommStatus = 'sent' | 'delivered' | 'read' | 'failed' | 'received'

interface Communication {
  id: string
  type: CommType
  direction: CommDirection
  status: CommStatus
  subject?: string
  content?: string
  sentAt: string
  sentBy: string
}

const TYPE_ICONS: Record<CommType, React.ReactNode> = {
  email: <Mail className="h-3.5 w-3.5" />,
  sms: <MessageSquare className="h-3.5 w-3.5" />,
  phone_call: <Phone className="h-3.5 w-3.5" />,
  note: <FileText className="h-3.5 w-3.5" />,
  portal_message: <MessageSquare className="h-3.5 w-3.5" />,
}

const TYPE_LABELS: Record<CommType, string> = {
  email: 'Email',
  sms: 'SMS',
  phone_call: 'Phone Call',
  note: 'Note',
  portal_message: 'Portal Message',
}

const TYPE_COLORS: Record<CommType, string> = {
  email: 'bg-blue-100 text-blue-700',
  sms: 'bg-purple-100 text-purple-700',
  phone_call: 'bg-green-100 text-green-700',
  note: 'bg-gray-100 text-gray-600',
  portal_message: 'bg-indigo-100 text-indigo-700',
}

interface LogForm {
  type: CommType
  direction: CommDirection
  subject: string
  content: string
  status: CommStatus
}

const DEFAULT_FORM: LogForm = {
  type: 'phone_call',
  direction: 'outbound',
  subject: '',
  content: '',
  status: 'sent',
}

export default function CommunicationLogPanel({ contactId }: { contactId: string }) {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<LogForm>(DEFAULT_FORM)
  const [typeFilter, setTypeFilter] = useState<CommType | 'all'>('all')

  const { data, isLoading } = useQuery<{ data: Communication[]; meta: { total: number } }>({
    queryKey: ['communications', contactId, typeFilter],
    queryFn: () =>
      api
        .get('/api/communications', {
          params: {
            contactId,
            ...(typeFilter !== 'all' && { type: typeFilter }),
            pageSize: 50,
          },
        })
        .then((r) => r.data),
  })

  const logMutation = useMutation({
    mutationFn: (payload: LogForm & { contactId: string }) =>
      api.post('/api/communications', payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['communications', contactId] })
      qc.invalidateQueries({ queryKey: ['contact-timeline', contactId] })
      setShowForm(false)
      setForm(DEFAULT_FORM)
    },
  })

  const communications = data?.data ?? []

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 flex-wrap">
          {(['all', 'phone_call', 'email', 'sms', 'note', 'portal_message'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${
                typeFilter === t
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t === 'all' ? 'All' : TYPE_LABELS[t]}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 flex-shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          Log Communication
        </button>
      </div>

      {/* Log form */}
      {showForm && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-emerald-800">Log Communication</p>
            <button onClick={() => setShowForm(false)}>
              <X className="h-4 w-4 text-emerald-600 hover:text-emerald-800" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Type *</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as CommType }))}
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="phone_call">Phone Call</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="note">Note</option>
                <option value="portal_message">Portal Message</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Direction</label>
              <select
                value={form.direction}
                onChange={(e) => setForm((f) => ({ ...f, direction: e.target.value as CommDirection }))}
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="outbound">Outbound</option>
                <option value="inbound">Inbound</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                placeholder="Brief subject or title"
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Content / Notes</label>
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                rows={3}
                placeholder="Notes about the interaction…"
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as CommStatus }))}
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="sent">Sent</option>
                <option value="delivered">Delivered</option>
                <option value="read">Read</option>
                <option value="received">Received</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowForm(false)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => logMutation.mutate({ ...form, contactId })}
              disabled={logMutation.isPending}
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {logMutation.isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* Communications list */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : communications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-10 text-gray-400">
          <MessageSquare className="h-8 w-8 mb-2" />
          <p className="text-sm font-medium">No communications logged</p>
          <p className="text-xs mt-0.5">Log calls, emails, and notes to build the interaction history</p>
        </div>
      ) : (
        <div className="space-y-2">
          {communications.map((comm) => (
            <div key={comm.id} className="flex gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3">
              <div
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${TYPE_COLORS[comm.type]}`}
              >
                {TYPE_ICONS[comm.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {comm.subject || TYPE_LABELS[comm.type]}
                  </span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                      comm.direction === 'inbound'
                        ? 'bg-blue-50 text-blue-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {comm.direction}
                  </span>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                      comm.status === 'failed'
                        ? 'bg-red-50 text-red-500'
                        : comm.status === 'read'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    {comm.status}
                  </span>
                </div>
                {comm.content && (
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{comm.content}</p>
                )}
              </div>
              <time className="text-xs text-gray-400 flex-shrink-0">
                {format(new Date(comm.sentAt), 'MMM d, h:mm a')}
              </time>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
