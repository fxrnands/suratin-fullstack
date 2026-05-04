'use client'

import { cn } from '@/lib/utils'

import type { LetterOutputLanguage } from '@/components/letter-builder/types'

const OPTIONS: { id: LetterOutputLanguage; label: string }[] = [
  { id: 'id', label: 'Indonesia' },
  { id: 'en', label: 'Inggris' },
]

interface OutputLanguageControlProps {
  value: LetterOutputLanguage
  onChange: (language: LetterOutputLanguage) => void
  showLabel?: boolean
}

export function OutputLanguageControl({ value, onChange, showLabel = true }: OutputLanguageControlProps) {
  const segment = (
    <div className="flex rounded-lg border border-border bg-muted/40 p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={cn(
            'flex-1 rounded-md px-3 py-2 text-sm font-medium transition',
            value === opt.id
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground/90 dark:hover:bg-secondary/25',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )

  if (!showLabel) return segment

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium capitalize tracking-wide text-muted-foreground">Bahasa surat</span>
      {segment}
    </div>
  )
}
