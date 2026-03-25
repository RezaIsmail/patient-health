import { useState, useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Users, Calendar, Inbox, LogOut, Activity, Menu, X } from 'lucide-react'
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
  { label: 'Patients', to: '/patients', icon: <Users className="h-5 w-5" /> },
  { label: 'Schedule', to: '/schedule', icon: <Calendar className="h-5 w-5" /> },
  { label: 'Inbox', to: '/inbox', icon: <Inbox className="h-5 w-5" /> },
]

// Bottom nav shows the top 4 primary items (icon + label, mobile only)
const bottomNavItems = navItems.slice(0, 4)

export default function Layout() {
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Real-time event subscription — keeps UI in sync across products
  useServerEvents()

  // Page view tracking — fires on every route change
  useEffect(() => {
    trackPageView(location.pathname)
  }, [location.pathname])

  // Close drawer on route change (mobile nav tap)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Close drawer on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  // Prevent body scroll when drawer is open on mobile
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  const userInitials = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
    : '??'

  const roleLabel: Record<string, string> = {
    physician: 'Physician',
    app: 'Advanced Practice Provider',
    nurse: 'Nurse',
    front_desk: 'Front Desk',
    billing: 'Billing',
    admin: 'Administrator',
    patient: 'Patient',
  }

  // ── Shared sidebar content ─────────────────────────────────────────────────
  const SidebarContent = () => (
    <>
      {/* Logo / wordmark */}
      <div className="flex h-14 items-center gap-2.5 border-b border-gray-100 px-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600">
          <Activity className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 leading-none">Patient Health</p>
          <p className="text-[10px] text-gray-400 font-medium tracking-wide uppercase mt-0.5">EMR</p>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-100',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User menu */}
      <div className="border-t border-gray-100 p-2">
        <div className="flex items-center gap-2.5 rounded-md px-3 py-2">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
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

      {/* ── Mobile backdrop ────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar (desktop: always visible | mobile: slide-in drawer) ────── */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white',
          'transform transition-transform duration-200 ease-in-out',
          // Desktop: always shown, no transform
          'lg:relative lg:z-auto lg:w-56 lg:translate-x-0',
          // Mobile: slide in/out
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>

      {/* ── Right-hand content column ──────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* ── Mobile top bar ──────────────────────────────────────────────── */}
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
            <div className="flex h-6 w-6 items-center justify-center rounded bg-blue-600">
              <Activity className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">Patient Health</span>
            <span className="text-[10px] font-medium text-gray-400 tracking-wide uppercase">EMR</span>
          </div>
          <div className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
            {userInitials}
          </div>
        </header>

        {/* ── Main content ────────────────────────────────────────────────── */}
        {/* pb-16 on mobile to clear the fixed bottom nav bar */}
        <main className="flex flex-1 flex-col overflow-hidden pb-16 lg:pb-0">
          <Outlet />
        </main>

        {/* ── Mobile bottom navigation ────────────────────────────────────── */}
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
                  isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
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
