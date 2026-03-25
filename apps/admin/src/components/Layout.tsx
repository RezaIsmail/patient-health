import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Building2,
  UserCog,
  Lock,
  FileText,
  Plug,
  LogOut,
  Shield,
  Database,
  FileCode,
  BarChart2,
  Menu,
  X,
} from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { cn } from '@patient-health/ui'
import { useServerEvents } from '../hooks/useServerEvents'
import { trackPageView } from '@patient-health/analytics'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Members', to: '/members', icon: <Users className="h-5 w-5" /> },
  { label: 'Programmes', to: '/programmes', icon: <ClipboardList className="h-5 w-5" /> },
  { label: 'Organisations', to: '/organisations', icon: <Building2 className="h-5 w-5" /> },
  { label: 'Users', to: '/users', icon: <UserCog className="h-5 w-5" /> },
  { label: 'Roles & RBAC', to: '/roles', icon: <Lock className="h-5 w-5" /> },
  { label: 'Audit Log', to: '/audit', icon: <FileText className="h-5 w-5" /> },
  { label: 'Integrations', to: '/integrations', icon: <Plug className="h-5 w-5" /> },
  { label: 'Reference Data', to: '/reference-data', icon: <Database className="h-5 w-5" /> },
  { label: 'Templates', to: '/templates', icon: <FileCode className="h-5 w-5" /> },
  { label: 'Analytics', to: '/analytics', icon: <BarChart2 className="h-5 w-5" /> },
]

const bottomNavItems = navItems.slice(0, 4)

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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Real-time bridge: EMR/CRM events → Redis → this hook → TanStack Query invalidation
  useServerEvents()

  useEffect(() => { trackPageView(location.pathname) }, [location.pathname])
  useEffect(() => { setSidebarOpen(false) }, [location.pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSidebarOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  const userInitials = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : '??'

  const SidebarContent = () => (
    <>
      <div className="flex h-14 items-center gap-2.5 border-b border-gray-100 px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600">
          <Shield className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 leading-none">Patient Health</p>
          <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase mt-0.5">ADMIN</p>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-100',
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 p-2">
        <div className="flex items-center gap-2.5 rounded-md px-3 py-2">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
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
          onClick={() => void logout()}
          className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white',
          'transform transition-transform duration-200 ease-in-out',
          'lg:relative lg:z-auto lg:w-56 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Content column */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Mobile top bar */}
        <header className="flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            aria-label="Open navigation"
            aria-expanded={sidebarOpen}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600">
              <Shield className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Patient Health</span>
            <span className="text-[10px] font-medium text-gray-400 tracking-wide uppercase">Admin</span>
          </div>
          <div className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
            {userInitials}
          </div>
        </header>

        <main className="flex flex-1 flex-col overflow-hidden pb-16 lg:pb-0">
          <Outlet />
        </main>

        {/* Mobile bottom navigation */}
        <nav
          className="fixed bottom-0 inset-x-0 z-30 flex h-16 items-center justify-around border-t border-gray-200 bg-white lg:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          aria-label="Bottom navigation"
        >
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors',
                  isActive ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                )
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
