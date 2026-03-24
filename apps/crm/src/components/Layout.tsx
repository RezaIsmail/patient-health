import { NavLink, Outlet } from 'react-router-dom'
import {
  Users,
  LayoutDashboard,
  GitBranch,
  ClipboardList,
  CheckSquare,
  Megaphone,
  BarChart2,
  LogOut,
  HeartHandshake,
  Building2,
  AlertTriangle,
  Webhook,
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { cn } from '@patient-health/ui'

interface NavItem {
  label: string
  to?: string
  icon: React.ReactNode
  disabled?: boolean
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Contacts', to: '/contacts', icon: <Users className="h-4 w-4" /> },
  { label: 'Accounts', to: '/accounts', icon: <Building2 className="h-4 w-4" /> },
  { label: 'Referrals', to: '/referrals', icon: <GitBranch className="h-4 w-4" /> },
  { label: 'Care Plans', to: '/care-plans', icon: <ClipboardList className="h-4 w-4" /> },
  { label: 'Care Gaps', to: '/care-gaps', icon: <AlertTriangle className="h-4 w-4" /> },
  { label: 'Tasks', to: '/tasks', icon: <CheckSquare className="h-4 w-4" /> },
  { label: 'Campaigns', to: '/campaigns', icon: <Megaphone className="h-4 w-4" /> },
  { label: 'Analytics', to: '/analytics', icon: <BarChart2 className="h-4 w-4" /> },
  { label: 'Webhooks', to: '/webhooks', icon: <Webhook className="h-4 w-4" /> },
]

const roleLabel: Record<string, string> = {
  physician: 'Physician',
  app: 'Advanced Practice Provider',
  nurse: 'Nurse',
  front_desk: 'Front Desk',
  billing: 'Billing',
  admin: 'Administrator',
  patient: 'Patient',
  care_coordinator: 'Care Coordinator',
  case_manager: 'Case Manager',
  network_relations: 'Network Relations',
}

export default function Layout() {
  const { user, logout } = useAuthStore()

  const userInitials = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : '??'

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* ── Left sidebar ──────────────────────────────────────────────────── */}
      <aside className="flex w-56 flex-shrink-0 flex-col border-r border-gray-200 bg-white">
        {/* Logo */}
        <div className="flex h-14 items-center gap-2.5 border-b border-gray-100 px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-600">
            <HeartHandshake className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-none">Patient Health</p>
            <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase mt-0.5">
              CRM
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2" aria-label="Main navigation">
          {navItems.map((item) => {
            if (item.disabled || !item.to) {
              return (
                <span
                  key={item.label}
                  className="flex cursor-not-allowed items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-400 select-none"
                  aria-disabled="true"
                >
                  {item.icon}
                  {item.label}
                  <span className="ml-auto text-[10px] font-medium text-gray-300 bg-gray-100 rounded px-1 py-0.5">
                    Soon
                  </span>
                </span>
              )
            }

            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-100',
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        {/* User */}
        <div className="border-t border-gray-100 p-2">
          <div className="flex items-center gap-2.5 rounded-md px-3 py-2">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-gray-900">
                {user ? `${user.firstName} ${user.lastName}` : 'Unknown User'}
              </p>
              <p className="truncate text-[10px] text-gray-500">
                {user ? (roleLabel[user.role] ?? user.role) : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────────────────── */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
