import { useId, type ComponentProps } from 'react'
import { cn } from '../../../lib/cn'

interface InputProps extends ComponentProps<'input'> {
  label: string
  error?: string
}

export function Input({ label, error, id, className, ...props }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          'rounded-md border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-100',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
