import { ArrowUpRight } from 'lucide-react'

import type { LetterTypeItem } from '@/components/landing/data'
import { cn } from '@/lib/utils'

interface LetterCatalogSectionProps {
  eyebrow?: string
  title?: string
  subtitle?: string
  items: LetterTypeItem[]
  className?: string
}

export function LetterCatalogSection({
  eyebrow = 'Katalog surat',
  title = '4 Jenis Surat Formal',
  subtitle = 'Semua kebutuhan formal Anda dalam satu platform',
  items,
  className,
}: LetterCatalogSectionProps) {
  return (
    <section className={cn('relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8', className)}>
      <div className="absolute inset-0 bg-secondary/20" aria-hidden />
      <div
        className="pointer-events-none absolute -top-28 left-1/2 h-52 w-[min(100%,36rem)] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-border to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h2>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">{subtitle}</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {items.map((item) => (
            <button
              key={item.title}
              type="button"
              className="group relative flex h-full flex-col rounded-2xl border border-border/60 bg-card/90 p-6 text-left shadow-sm ring-1 ring-transparent backdrop-blur-[2px] transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:bg-card hover:shadow-lg hover:shadow-primary/[0.07] hover:ring-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ArrowUpRight
                className="absolute right-4 top-4 h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary group-hover:opacity-100"
                aria-hidden
              />
              <div className="mb-5 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 via-primary/12 to-primary/5 shadow-inner ring-1 ring-primary/15 transition-transform duration-300 group-hover:scale-[1.04]">
                <item.icon className="h-7 w-7 text-primary" strokeWidth={2} aria-hidden />
              </div>
              <h3 className="mb-2 pr-6 text-[0.9375rem] font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                {item.title}
              </h3>
              <p className="text-sm leading-tight text-muted-foreground">{item.description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
