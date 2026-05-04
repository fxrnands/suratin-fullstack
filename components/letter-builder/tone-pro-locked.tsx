'use client'

import type { ReactNode } from 'react'
import { Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { rememberLandingSectionScroll } from '@/lib/client/landing-section-scroll'

interface ToneProLockedProps {
  children: ReactNode
}

export function ToneProLocked({ children }: ToneProLockedProps) {
  const router = useRouter()

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="pointer-events-none select-none blur-sm opacity-60">{children}</div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/45 p-3 backdrop-blur-[1px]">
        <Button
          type="button"
          className="shadow-md"
          onClick={() => {
            rememberLandingSectionScroll('harga')
            router.push('/', { scroll: false })
          }}
        >
          Upgrade to Pro
          <Lock aria-hidden className="size-4 shrink-0" />
        </Button>
      </div>
    </div>
  )
}
