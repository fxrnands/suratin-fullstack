'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useMemo } from 'react'

import { useAuth } from '@/components/auth/auth-provider'

const DEFAULT_NEXT_PATH = '/buat-surat'

export function useRequireAuthGate() {
  const router = useRouter()
  const pathname = usePathname()
  const { hydrated, accessToken } = useAuth()

  useEffect(() => {
    if (!hydrated || accessToken) return

    const safeNext =
      pathname && pathname.startsWith('/') && !pathname.startsWith('//')
        ? pathname
        : DEFAULT_NEXT_PATH
    router.replace(`/login?next=${encodeURIComponent(safeNext)}`)
  }, [hydrated, accessToken, pathname, router])

  return useMemo(
    () => ({
      isReady: hydrated && Boolean(accessToken),
    }),
    [accessToken, hydrated],
  )
}
