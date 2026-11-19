import { Link } from 'react-router'
import { useCurrentUser, useLogout } from '../../auth/hooks'
import { Button } from '../../components/ui/Button'

// Placeholder until the app layout and ProtectedRoute exist.
export function HomePage() {
  const { data: user } = useCurrentUser()
  const logout = useLogout()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50">
      <h1 className="text-3xl font-bold text-slate-900">Ticket Management System</h1>
      {user ? (
        <>
          <p className="text-slate-600">
            Signed in as {user.name} ({user.role})
          </p>
          <Button variant="secondary" isLoading={logout.isPending} onClick={() => logout.mutate()}>
            Log out
          </Button>
        </>
      ) : (
        <Link to="/login" className="text-indigo-600 hover:underline">
          Sign in
        </Link>
      )}
    </main>
  )
}
