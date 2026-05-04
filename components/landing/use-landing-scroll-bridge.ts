'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import {
  isLandingSectionId,
  scrollToLandingSection,
  takeLandingSectionScroll,
} from '@/lib/client/landing-section-scroll'

export function useLandingScrollBridge() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/') return

    const run = () => {
      const pending = takeLandingSectionScroll()
      if (pending) {
        scrollToLandingSection(pending)
        return
      }

      const hash =
        typeof window !== 'undefined'
          ? decodeURIComponent(window.location.hash.slice(1))
          : ''
      if (hash && isLandingSectionId(hash)) {
        window.history.replaceState(null, '', '/')
        scrollToLandingSection(hash)
      }
    }

    requestAnimationFrame(run)
  }, [pathname])
}
