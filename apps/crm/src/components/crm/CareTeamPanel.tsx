import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, UserPlus, Crown, Trash2, Pencil, X, Check } from 'lucide-react'
import { api } from '../../lib/api'
import { Skeleton } from '@patient-health/ui'

type MemberRole =
  | 'care_coordinator'
  | 'physician'
  | 'nurse'
  | 'social_worker'
  | 'pharmacist'
  | 'behavioural_health'
  | 'other'

interface CareTeamMember {
  id: string
  userId: string
  memberName: string
  role: MemberRole
  isPrimary: boolean
  joinedAt: string
}

interface CareTeam {
  id: string
  name: string
  members: CareTeamMember[]
}

const ROLE_LABELS: Record<MemberRole, string> = {
  care_coordinator: 'Care Coordinator',
  physician: 'Physician',
  nurse: 'Nurse',
  social_worker: 'Social Worker',
  pharmacist: 'Pharmacist',
  behavioural_health: 'Behavioural Health',
  other: 'Other',
}

const ROLE_OPTIONS: MemberRole[] = [
  'care_coordinator',
  'physician',
  'nurse',
  'social_worker',
  'pharmacist',
  'behavioural_health',
  'other',
]

interface AddMemberForm {
  userId: string
  memberName: string
  role: MemberRole
  isPrimary: boolean
}

export default function CareTeamPanel({ contactId }: { contactId: string }) {
  const qc = useQueryClient()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)
  const [addForm, setAddForm] = useState<AddMemberForm>({
    userId: '',
    memberName: '',
    role: 'care_coordinator',
    isPrimary: false,
  })
  const [editRole, setEditRole] = useState<MemberRole>('care_coordinator')
  const [editIsPrimary, setEditIsPrimary] = useState(false)

  const { data, isLoading } = useQuery<{ data: CareTeam | null }>({
    queryKey: ['care-team', contactId],
    queryFn: () => api.get(`/api/contacts/${contactId}/care-team`).then((r) => r.data),
  })

  const careTeam = data?.data

  const createTeamMutation = useMutation({
    mutationFn: () =>
      api.post(`/api/contacts/${contactId}/care-team`, { name: 'Care Team' }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['care-team', contactId] }),
  })

  const addMemberMutation = useMutation({
    mutationFn: (form: AddMemberForm) =>
      api.post(`/api/care-teams/${careTeam!.id}/members`, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['care-team', contactId] })
      setShowAddForm(false)
      setAddForm({ userId: '', memberName: '', role: 'care_coordinator', isPrimary: false })
    },
  })

  const updateMemberMutation = useMutation({
    mutationFn: ({ memberId, data }: { memberId: string; data: { role?: MemberRole; isPrimary?: boolean } }) =>
      api.patch(`/api/care-teams/${careTeam!.id}/members/${memberId}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['care-team', contactId] })
      setEditingMemberId(null)
    },
  })

  const removeMemberMutation = useMutation({
    mutationFn: (memberId: string) =>
      api.delete(`/api/care-teams/${careTeam!.id}/members/${memberId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['care-team', contactId] }),
  })

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (!careTeam) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-10 text-gray-400">
        <Users className="h-10 w-10 mb-3" />
        <p className="font-medium text-sm">No care team yet</p>
        <p className="text-xs mt-1 mb-4">Create a care team to assign coordinators and clinicians</p>
        <button
          onClick={() => createTeamMutation.mutate()}
          disabled={createTeamMutation.isPending}
          className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {createTeamMutation.isPending ? 'Creating…' : 'Create Care Team'}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Team header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{careTeam.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{careTeam.members.length} member{careTeam.members.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
        >
          <UserPlus className="h-3.5 w-3.5" />
          Add Member
        </button>
      </div>

      {/* Add member form */}
      {showAddForm && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-emerald-800">Add Team Member</p>
            <button onClick={() => setShowAddForm(false)}>
              <X className="h-4 w-4 text-emerald-600 hover:text-emerald-800" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={addForm.memberName}
                onChange={(e) => setAddForm((f) => ({ ...f, memberName: e.target.value }))}
                placeholder="e.g. Dr. Jane Smith"
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">User ID (system)</label>
              <input
                type="text"
                value={addForm.userId}
                onChange={(e) => setAddForm((f) => ({ ...f, userId: e.target.value }))}
                placeholder="user-uuid"
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
              <select
                value={addForm.role}
                onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value as MemberRole }))}
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={addForm.isPrimary}
                onChange={(e) => setAddForm((f) => ({ ...f, isPrimary: e.target.checked }))}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs text-gray-700">Set as primary care coordinator</span>
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => addMemberMutation.mutate(addForm)}
              disabled={!addForm.memberName || !addForm.userId || addMemberMutation.isPending}
              className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {addMemberMutation.isPending ? 'Adding…' : 'Add Member'}
            </button>
          </div>
        </div>
      )}

      {/* Member list */}
      {careTeam.members.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-8 text-gray-400">
          <Users className="h-8 w-8 mb-2" />
          <p className="text-sm font-medium">No members yet</p>
          <p className="text-xs mt-0.5">Add clinicians and coordinators to this care team</p>
        </div>
      ) : (
        <div className="space-y-2">
          {careTeam.members.map((member) => (
            <div
              key={member.id}
              className={`rounded-lg border bg-white p-3 ${member.isPrimary ? 'border-emerald-200' : 'border-gray-200'}`}
            >
              {editingMemberId === member.id ? (
                /* Edit mode */
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as MemberRole)}
                      className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                      ))}
                    </select>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsPrimary}
                      onChange={(e) => setEditIsPrimary(e.target.checked)}
                      className="rounded border-gray-300 text-emerald-600"
                    />
                    <span className="text-xs text-gray-700">Primary coordinator</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        updateMemberMutation.mutate({
                          memberId: member.id,
                          data: { role: editRole, isPrimary: editIsPrimary },
                        })
                      }
                      disabled={updateMemberMutation.isPending}
                      className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-1 text-xs text-white"
                    >
                      <Check className="h-3 w-3" /> Save
                    </button>
                    <button
                      onClick={() => setEditingMemberId(null)}
                      className="flex items-center gap-1 rounded border border-gray-300 px-2 py-1 text-xs text-gray-600"
                    >
                      <X className="h-3 w-3" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                    {member.memberName
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium text-gray-900">{member.memberName}</span>
                      {member.isPrimary && (
                        <span title="Primary coordinator"><Crown className="h-3 w-3 text-amber-500" /></span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{ROLE_LABELS[member.role]}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingMemberId(member.id)
                        setEditRole(member.role)
                        setEditIsPrimary(member.isPrimary)
                      }}
                      className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                      title="Edit member"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${member.memberName} from the care team?`)) {
                          removeMemberMutation.mutate(member.id)
                        }
                      }}
                      className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                      title="Remove member"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
