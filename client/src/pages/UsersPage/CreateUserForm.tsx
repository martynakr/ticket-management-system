import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Alert } from '../../components/ui/Alert'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ApiError } from '../../lib/api'
import { applyFieldErrors } from '../../lib/form'
import { generatePassword } from '../../lib/password'
import { useCreateUser } from '../../users/hooks'
import { createUserSchema, type CreateUserForm as FormValues } from './createUserSchema'

export function CreateUserForm() {
  const createUser = useCreateUser()
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(createUserSchema) })
  const created = createUser.data?.user

  function fillGeneratedPassword() {
    setValue('password', generatePassword(), { shouldDirty: true, shouldValidate: true })
  }

  async function onSubmit(values: FormValues) {
    try {
      await createUser.mutateAsync(values)
      reset()
    } catch (error) {
      if (error instanceof ApiError && error.status === 400 && applyFieldErrors(setError, error.fields)) {
        return
      }
      if (error instanceof ApiError && error.status === 409) {
        setError('email', { message: error.message })
        return
      }
      setError('root', {
        message: error instanceof ApiError ? error.message : 'Something went wrong',
      })
    }
  }

  return (
    <div className="max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">New agent</h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-4 flex flex-col gap-4">
        {errors.root && <Alert>{errors.root.message}</Alert>}
        {created && (
          <Alert variant="info">
            {created.name} ({created.email}) was created. Share their password with them now: it
            can't be shown again.
            <p className="mt-1">
              Password: <code className="font-mono select-all">{createUser.variables?.password}</code>
            </p>
          </Alert>
        )}

        <Input label="Name" autoComplete="off" error={errors.name?.message} {...register('name')} />
        <Input
          label="Email"
          type="email"
          autoComplete="off"
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="relative">
          {/* Plain text: the admin has to read the password to share it. */}
          <Input
            label="Password"
            type="text"
            autoComplete="off"
            spellCheck={false}
            className="font-mono"
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={fillGeneratedPassword}
            className="absolute top-0 right-0 text-sm font-medium text-indigo-600 hover:underline"
          >
            Generate
          </button>
        </div>

        <Button type="submit" isLoading={isSubmitting} className="mt-2 self-start">
          Create agent
        </Button>
      </form>
    </div>
  )
}
