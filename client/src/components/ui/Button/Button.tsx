import type { ComponentProps } from 'react'
import { cn } from '../../../lib/cn'

type Variant = 'primary' | 'secondary'

interface ButtonProps extends ComponentProps<'button'> {
  variant?: Variant
  isLoading?: boolean
}

const variants: Record<Variant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-300',
  secondary:
    'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-200',
}

export function Button({
  variant = 'primary',
  isLoading = false,
  disabled,
  type = 'button',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium shadow-sm outline-none transition-colors focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      {...props}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  )
}
