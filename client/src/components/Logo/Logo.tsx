import { cn } from '../../lib/cn'

type Size = 'sm' | 'md' | 'lg'

const sizes: Record<Size, { wordmark: string; badge: string }> = {
  sm: { wordmark: 'text-xl', badge: 'px-1.5 text-[0.625rem]' },
  md: { wordmark: 'text-3xl', badge: 'px-2 py-0.5 text-xs' },
  lg: { wordmark: 'text-5xl', badge: 'px-2.5 py-1 text-sm' },
}

interface LogoProps {
  size?: Size
  className?: string
}

export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <div className={cn('flex items-baseline gap-2 font-display select-none', className)}>
      <span className={cn('font-extrabold tracking-tight text-slate-900', sizes[size].wordmark)}>
        code<span className="text-indigo-600">loom</span>
      </span>
      <span
        className={cn(
          'rounded-full bg-indigo-100 font-semibold uppercase tracking-wider text-indigo-700',
          sizes[size].badge,
        )}
      >
        Support
      </span>
    </div>
  )
}
