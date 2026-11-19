import { Navigate, Outlet } from 'react-router'
import { useCurrentUser } from '../../auth/hooks'

export function ProtectedRoute() {
  const { data: user } = useCurrentUser()

  if (!user) return <Navigate to="/login" replace />

  return <Outlet />
}
