import { Link, NavLink } from 'react-router'
import { useCurrentUser, useLogout } from '../../auth/hooks'
import { cn } from '../../lib/cn'
import { Logo } from '../Logo'
import { Button } from '../ui/Button'

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  )
}

export function NavBar() {
  const { data: user } = useCurrentUser()
  const logout = useLogout()

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link to="/">
          <Logo size="sm" />
        </Link>

        {user && (
          <>
            <div className="flex items-center gap-1">
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>
              {user.role === 'admin' && (
                <NavLink to="/users" className={navLinkClass}>
                  Users
                </NavLink>
              )}
            </div>

            <div className="ml-auto flex items-center gap-4">
              <span className="text-sm text-slate-600">
                {user.name} <span className="text-slate-400">({user.role})</span>
              </span>
              <Button variant="secondary" isLoading={logout.isPending} onClick={() => logout.mutate()}>
                Log out
              </Button>
            </div>
          </>
        )}
      </nav>
    </header>
  )
}
