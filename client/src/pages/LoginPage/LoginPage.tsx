import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Navigate, useNavigate } from 'react-router'
import { useCurrentUser, useLogin } from '../../auth/hooks'
import { Logo } from '../../components/Logo'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ApiError } from '../../lib/api'
import { applyFieldErrors } from '../../lib/form'
import { loginSchema, type LoginForm } from './loginSchema'

export function LoginPage() {
  const { data: user } = useCurrentUser()
  const login = useLogin()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  if (user) return <Navigate to="/" replace />

  async function onSubmit(values: LoginForm) {
    try {
      await login.mutateAsync(values)
      navigate('/', { replace: true })
    } catch (error) {
      if (error instanceof ApiError && error.status === 400 && applyFieldErrors(setError, error.fields)) {
        return
      }
      setError('root', {
        message: error instanceof ApiError ? error.message : 'Something went wrong',
      })
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-slate-50 px-4">
      <Logo />
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
        <p className="mt-1 text-sm text-slate-500">to the support desk</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-4">
          {errors.root && <Alert>{errors.root.message}</Alert>}

          <Input
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full">
            Sign in
          </Button>
        </form>
      </div>
    </main>
  )
}
