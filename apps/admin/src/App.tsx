import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MembersPage from './pages/MembersPage'
import MemberDetailPage from './pages/MemberDetailPage'
import UsersPage from './pages/UsersPage'
import OrganisationsPage from './pages/OrganisationsPage'
import ProgrammesPage from './pages/ProgrammesPage'
import RolesPage from './pages/RolesPage'
import AuditLogPage from './pages/AuditLogPage'
import IntegrationsPage from './pages/IntegrationsPage'
import ReferenceDataPage from './pages/ReferenceDataPage'
import TemplatesPage from './pages/TemplatesPage'
import AnalyticsPage from './pages/AnalyticsPage'
import Layout from './components/Layout'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="members/:id" element={<MemberDetailPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="organisations" element={<OrganisationsPage />} />
        <Route path="programmes" element={<ProgrammesPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="audit" element={<AuditLogPage />} />
        <Route path="integrations" element={<IntegrationsPage />} />
        <Route path="reference-data" element={<ReferenceDataPage />} />
        <Route path="templates" element={<TemplatesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
