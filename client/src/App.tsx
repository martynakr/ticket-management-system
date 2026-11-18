import { Navigate, Route, Routes } from 'react-router'
import { useAuth } from './auth/AuthContext'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'

function App() {
  const { isLoading } = useAuth()

  // Wait for /api/auth/me, so a logged-in user doesn't see the login page flash.
  if (isLoading) return null

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
