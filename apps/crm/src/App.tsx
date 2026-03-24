import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ContactsPage from './pages/ContactsPage'
import ContactDetailPage from './pages/ContactDetailPage'
import ReferralsPage from './pages/ReferralsPage'
import CarePlansPage from './pages/CarePlansPage'
import CarePlanDetailPage from './pages/CarePlanDetailPage'
import TasksPage from './pages/TasksPage'
import CampaignsPage from './pages/CampaignsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import AccountsPage from './pages/AccountsPage'
import AccountDetailPage from './pages/AccountDetailPage'
import CareGapsPage from './pages/CareGapsPage'
import WebhooksPage from './pages/WebhooksPage'
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
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="contacts/:id" element={<ContactDetailPage />} />
        <Route path="referrals" element={<ReferralsPage />} />
        <Route path="care-plans" element={<CarePlansPage />} />
        <Route path="care-plans/:id" element={<CarePlanDetailPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="campaigns" element={<CampaignsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="accounts" element={<AccountsPage />} />
        <Route path="accounts/:id" element={<AccountDetailPage />} />
        <Route path="care-gaps" element={<CareGapsPage />} />
        <Route path="webhooks" element={<WebhooksPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
