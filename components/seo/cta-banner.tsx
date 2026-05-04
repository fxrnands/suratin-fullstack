import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface CtaBannerProps {
  title: string
  description: string
  ctaText: string
  ctaUrl: string
  variant?: 'default' | 'dark'
}

export function CtaBanner({
  title,
  description,
  ctaText,
  ctaUrl,
  variant = 'default',
}: CtaBannerProps) {
  return (
    <aside
      className={cn(
        'my-10 rounded-2xl border px-6 py-8 sm:px-10',
        variant === 'dark'
          ? 'border-primary/30 bg-primary text-primary-foreground'
          : 'border-border/70 bg-secondary/40 text-foreground',
      )}
    >
      <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
      <p className={cn('mt-2 max-w-2xl text-sm sm:text-base', variant === 'dark' ? 'text-primary-foreground/90' : 'text-muted-foreground')}>
        {description}
      </p>
      <div className="mt-6">
        <Button asChild size="lg" variant={variant === 'dark' ? 'secondary' : 'default'}>
          <Link href={ctaUrl}>{ctaText}</Link>
        </Button>
      </div>
    </aside>
  )
}
