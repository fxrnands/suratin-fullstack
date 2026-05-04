'use client'

import type { ReactNode } from 'react'

import { useRequireAuthGate } from '@/components/auth/use-require-auth-gate'

export function RequireAuthGate({ children }: { children: ReactNode }) {
  const { isReady } = useRequireAuthGate()

  if (!isReady) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4 text-sm text-muted-foreground">
        Memuat sesi…
      </div>
    )
  }

  return <>{children}</>
}
