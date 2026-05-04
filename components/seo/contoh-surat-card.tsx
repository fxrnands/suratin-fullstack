import Link from 'next/link'

import { cn } from '@/lib/utils'

interface ContohSuratCardProps {
  href: string
  title: string
  description: string
  className?: string
}

export function ContohSuratCard({ href, title, description, className }: ContohSuratCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col rounded-xl border border-border/70 bg-card/50 p-5 shadow-sm transition hover:border-primary/40 hover:bg-card',
        className,
      )}
    >
      <span className="text-base font-semibold text-foreground group-hover:text-primary">{title}</span>
      <span className="mt-2 text-sm text-muted-foreground">{description}</span>
    </Link>
  )
}
