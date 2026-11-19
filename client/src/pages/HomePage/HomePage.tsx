import { useCurrentUser } from '../../auth/hooks'

export function HomePage() {
  const { data: user } = useCurrentUser()

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Home</h1>
      <p className="mt-1 text-sm text-slate-500">Welcome back, {user?.name}.</p>
    </div>
  )
}
