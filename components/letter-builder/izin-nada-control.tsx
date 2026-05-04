'use client'

import type { Tone } from '@/components/letter-builder/types'
import { cn } from '@/lib/utils'

const OPTIONS: { id: Tone; label: string; hint: string }[] = [
  { id: 'formal', label: 'Formal', hint: 'Baku & netral' },
  { id: 'persuasif', label: 'Sopan', hint: 'Lebih lembut' },
  { id: 'tegas', label: 'Tegas', hint: 'Langsung (kerja)' },
]

interface IzinNadaControlProps {
  value: Tone
  onChange: (tone: Tone) => void
}

export function IzinNadaControl({ value, onChange }: IzinNadaControlProps) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-medium capitalize tracking-wide text-muted-foreground">Nada surat</span>
      <div className="flex rounded-lg border border-border bg-muted/40 p-1">
        {OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            title={opt.hint}
            className={cn(
              'flex flex-1 flex-col gap-0.5 rounded-md px-2 py-2 text-center transition sm:px-3',
              value === opt.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground/90 dark:hover:bg-secondary/25',
            )}
          >
            <span className="text-sm font-medium">{opt.label}</span>
            <span className="hidden text-[10px] leading-tight text-muted-foreground sm:block">{opt.hint}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
