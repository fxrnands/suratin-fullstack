'use client'

import { cn } from '@/lib/utils'

import { LETTER_TYPE_OPTIONS } from '@/components/letter-builder/constants'
import type { LetterKind } from '@/components/letter-builder/types'

interface LetterTypePickerProps {
  value: LetterKind | null
  onChange: (kind: LetterKind) => void
}

export function LetterTypePicker({ value, onChange }: LetterTypePickerProps) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-base font-semibold capitalize text-foreground">1. pilih jenis surat</h2>
        <p className="mt-1 text-sm capitalize text-muted-foreground">
          Tentukan konteks surat untuk menyusun struktur yang tepat.
        </p>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:grid lg:grid-cols-2 lg:gap-4 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
        {LETTER_TYPE_OPTIONS.map((option) => {
          const selected = value === option.id
          const Icon = option.icon
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={cn(
                'flex min-h-[112px] w-[min(85vw,280px)] shrink-0 snap-start flex-col rounded-xl border bg-card p-4 text-left shadow-sm transition lg:h-auto lg:w-auto lg:snap-none',
                selected
                  ? 'border-primary bg-primary/[0.06] ring-1 ring-primary/20'
                  : 'border-border/70 hover:border-primary/35 hover:bg-secondary/70 dark:hover:bg-secondary/25',
              )}
            >
              <Icon className="mb-3 h-7 w-7 text-primary" aria-hidden strokeWidth={2} />
              <span className="text-sm font-semibold leading-snug text-foreground">{option.title}</span>
              <span className="mt-2 text-xs leading-tight text-muted-foreground">{option.description}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
