import { Link } from 'react-router'
import { useCurrentUser } from '../../auth/hooks'

export function HomePage() {
  const { data: user } = useCurrentUser()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Home</h1>
      {user ? (
        <p className="mt-1 text-sm text-slate-500">Welcome back, {user.name}.</p>
      ) : (
        // Placeholder until ProtectedRoute redirects logged-out users to /login.
        <Link to="/login" className="mt-2 inline-block text-indigo-600 hover:underline">
          Sign in
        </Link>
      )}
    </div>
  )
}
