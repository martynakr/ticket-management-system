import { Navigate, Route, Routes } from 'react-router'
import { useCurrentUser } from './auth/hooks'
import { AppLayout } from './components/AppLayout'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { UsersPage } from './pages/UsersPage'

function App() {
  const { isPending } = useCurrentUser()

  // Wait for /api/auth/me, so a logged-in user doesn't see the login page flash.
  if (isPending) return null

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/users" element={<UsersPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
