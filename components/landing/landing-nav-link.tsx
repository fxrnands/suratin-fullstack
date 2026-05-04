'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import type { LandingSectionId } from '@/lib/client/landing-section-scroll'
import { rememberLandingSectionScroll, scrollToLandingSection } from '@/lib/client/landing-section-scroll'

interface LandingNavLinkProps {
  sectionId: LandingSectionId
  className?: string
  children: React.ReactNode
}

export function LandingNavLink({ sectionId, className, children }: LandingNavLinkProps) {
  const pathname = usePathname() ?? ''
  const router = useRouter()

  return (
    <Link
      href="/"
      className={className}
      scroll={false}
      onClick={(event) => {
        const onHome = pathname === '/' || pathname === ''
        if (onHome) {
          event.preventDefault()
          scrollToLandingSection(sectionId)
          return
        }
        event.preventDefault()
        rememberLandingSectionScroll(sectionId)
        router.push('/', { scroll: false })
      }}
    >
      {children}
    </Link>
  )
}
