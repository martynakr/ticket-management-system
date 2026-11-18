import type { ReactNode } from 'react'

type Variant = 'error' | 'info'

const variants: Record<Variant, string> = {
  error: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-indigo-200 bg-indigo-50 text-indigo-700',
}

export function Alert({ variant = 'error', children }: { variant?: Variant; children: ReactNode }) {
  return (
    <div role="alert" className={`rounded-md border px-3 py-2 text-sm ${variants[variant]}`}>
      {children}
    </div>
  )
}
