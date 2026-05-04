'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'

const APP_ROUTE_PREFIXES = ['/buat-surat', '/surat-saya'] as const
const DEFAULT_PATHNAME = ''
const SCROLL_THRESHOLD_PX = 8

function isAppShellPath(pathname: string) {
  return APP_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

function isSuratSayaPath(pathname: string) {
  return pathname === '/surat-saya' || pathname.startsWith('/surat-saya/')
}

export function useSiteHeaderState() {
  const pathname = usePathname() ?? DEFAULT_PATHNAME
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD_PX)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return useMemo(
    () => ({
      pathname,
      appShell: isAppShellPath(pathname),
      onSuratSaya: isSuratSayaPath(pathname),
      isScrolled,
    }),
    [isScrolled, pathname],
  )
}
