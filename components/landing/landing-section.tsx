import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface LandingSectionProps {
  children: ReactNode
  id?: string
  className?: string
  innerClassName?: string
}

export function LandingSection({ children, id, className, innerClassName }: LandingSectionProps) {
  return (
    <section id={id} className={cn('px-4 py-20 sm:px-6 lg:px-8', className)}>
      <div className={cn(innerClassName)}>{children}</div>
    </section>
  )
}
