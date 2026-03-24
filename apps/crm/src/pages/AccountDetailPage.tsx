import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowLeft,
  Building2,
  Globe,
  Phone,
  Mail,
  MapPin,
  Users,
  Network,
  ChevronRight,
} from 'lucide-react'
import { api } from '../lib/api'
import { Skeleton } from '@patient-health/ui'
import { format } from 'date-fns'

type Tab = 'overview' | 'contacts' | 'hierarchy'

const RISK_COLORS: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-emerald-100 text-emerald-700',
}

const TYPE_LABELS: Record<string, string> = {
  health_system: 'Health System',
  hospital: 'Hospital',
  clinic: 'Clinic',
  insurance_plan: 'Insurance Plan',
  employer: 'Employer',
  community_org: 'Community Org',
  pharmacy: 'Pharmacy',
  other: 'Other',
}

export default function AccountDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<Tab>('overview')

  const { data, isLoading } = useQuery({
    queryKey: ['account', id],
    queryFn: () => api.get(`/api/accounts/${id}`).then((r) => r.data.data),
    enabled: !!id,
  })

  const account = data

  if (isLoading) {
    return (
      <div className="flex-1 p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!account) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <p className="text-lg font-medium">Account not found</p>
          <Link to="/accounts" className="mt-2 text-sm text-emerald-600 hover:underline">
            ← Back to Accounts
          </Link>
        </div>
      </div>
    )
  }

  const tabs: Array<{ id: Tab; label: string; count?: number }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'contacts', label: 'Contacts', count: account.contacts?.length },
    { id: 'hierarchy', label: 'Hierarchy', count: account.childAccounts?.length },
  ]

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2 px-6 pt-4 pb-0">
          <Link
            to="/accounts"
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-3 w-3" />
            Accounts
          </Link>
          <span className="text-gray-300 text-xs">/</span>
          <span className="text-xs text-gray-700 font-medium">{account.name}</span>
        </div>

        <div className="flex items-start gap-5 px-6 py-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100">
            <Building2 className="h-6 w-6 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-gray-900">{account.name}</h1>
              <span className="rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-0.5 text-xs font-semibold">
                {TYPE_LABELS[account.type] ?? account.type}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-1.5 flex-wrap">
              {account.industry && (
                <span className="text-xs text-gray-500">{account.industry}</span>
              )}
              {(account.city || account.state) && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  {[account.city, account.state].filter(Boolean).join(', ')}
                </span>
              )}
              {account.website && (
                <a
                  href={account.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-emerald-600 hover:underline"
                >
                  <Globe className="h-3 w-3" />
                  Website
                </a>
              )}
            </div>
            {account.parentAccount && (
              <p className="text-xs text-gray-400 mt-1">
                Part of{' '}
                <Link
                  to={`/accounts/${account.parentAccount.id}`}
                  className="text-emerald-600 hover:underline"
                >
                  {account.parentAccount.name}
                </Link>
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-5 flex-shrink-0">
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{account.contacts?.length ?? 0}</p>
              <p className="text-[10px] text-gray-500">Contacts</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-gray-900">{account.childAccounts?.length ?? 0}</p>
              <p className="text-[10px] text-gray-500">Sub-accounts</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-100 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    activeTab === tab.id
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Contact info */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact Information</h3>
              <dl className="space-y-2 text-sm">
                {[
                  [<Phone className="h-3.5 w-3.5" />, 'Phone', account.phone],
                  [<Mail className="h-3.5 w-3.5" />, 'Email', account.email],
                  [<Globe className="h-3.5 w-3.5" />, 'Website', account.website],
                ]
                  .filter(([, , val]) => val)
                  .map(([icon, label, value]) => (
                    <div key={label as string} className="flex items-center gap-2">
                      <span className="text-gray-400">{icon}</span>
                      <dt className="text-gray-500 w-16 flex-shrink-0">{label}</dt>
                      <dd className="text-gray-900 font-medium">{value}</dd>
                    </div>
                  ))}
              </dl>
            </div>

            {/* Address */}
            {(account.addressLine1 || account.city) && (
              <div className="rounded-xl border border-gray-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  Address
                </h3>
                <p className="text-sm text-gray-700">
                  {account.addressLine1}
                  {account.addressLine2 && (
                    <>
                      <br />
                      {account.addressLine2}
                    </>
                  )}
                  <br />
                  {account.city}
                  {account.city && account.state ? ', ' : ''}
                  {account.state} {account.postalCode}
                  {account.country && account.country !== 'US' && (
                    <>
                      <br />
                      {account.country}
                    </>
                  )}
                </p>
              </div>
            )}

            {/* Notes */}
            {account.notes && (
              <div className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Notes</h3>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{account.notes}</p>
              </div>
            )}

            {/* Meta */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Record Info
              </h3>
              <dl className="space-y-1.5 text-xs text-gray-500">
                <div className="flex justify-between">
                  <dt>Created</dt>
                  <dd>{format(new Date(account.createdAt), 'MMM d, yyyy')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Last updated</dt>
                  <dd>{format(new Date(account.updatedAt), 'MMM d, yyyy')}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">
                Contacts ({account.contacts?.length ?? 0})
              </h2>
            </div>
            {!account.contacts?.length ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-12 text-gray-400">
                <Users className="h-10 w-10 mb-3" />
                <p className="font-medium">No contacts linked to this account</p>
              </div>
            ) : (
              <div className="space-y-2">
                {account.contacts.map(
                  (contact: {
                    id: string
                    firstName: string
                    lastName: string
                    riskLevel: string
                    status: string
                    phone?: string
                    email?: string
                  }) => (
                    <Link
                      key={contact.id}
                      to={`/contacts/${contact.id}`}
                      className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white px-5 py-3 hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                        {contact.firstName[0]}
                        {contact.lastName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {contact.firstName} {contact.lastName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`text-[10px] rounded-full px-1.5 py-0.5 font-semibold ${
                              RISK_COLORS[contact.riskLevel] ?? RISK_COLORS.low
                            }`}
                          >
                            {contact.riskLevel} risk
                          </span>
                          <span className="text-xs text-gray-400 capitalize">{contact.status}</span>
                        </div>
                      </div>
                      {contact.phone && (
                        <span className="text-xs text-gray-400 flex-shrink-0">{contact.phone}</span>
                      )}
                      <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0" />
                    </Link>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'hierarchy' && (
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Account Hierarchy</h2>
            {account.parentAccount && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Parent Account
                </p>
                <Link
                  to={`/accounts/${account.parentAccount.id}`}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 hover:border-emerald-300 transition-colors"
                >
                  <Building2 className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-900">{account.parentAccount.name}</span>
                  <ChevronRight className="h-4 w-4 text-gray-300 ml-auto" />
                </Link>
              </div>
            )}

            {account.childAccounts?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Sub-accounts ({account.childAccounts.length})
                </p>
                <div className="space-y-2">
                  {account.childAccounts.map(
                    (child: { id: string; name: string; type: string }) => (
                      <Link
                        key={child.id}
                        to={`/accounts/${child.id}`}
                        className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 hover:border-emerald-300 transition-colors"
                      >
                        <Network className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{child.name}</span>
                        <span className="text-xs text-gray-500 capitalize">
                          {TYPE_LABELS[child.type] ?? child.type}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-300 ml-auto" />
                      </Link>
                    )
                  )}
                </div>
              </div>
            )}

            {!account.parentAccount && !account.childAccounts?.length && (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-12 text-gray-400">
                <Network className="h-10 w-10 mb-3" />
                <p className="font-medium">No hierarchy configured</p>
                <p className="text-sm mt-1">This is a standalone account with no parent or sub-accounts</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
