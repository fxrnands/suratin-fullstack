import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/landing/site-footer'

export default function ContohLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <SiteFooter />
    </>
  )
}
