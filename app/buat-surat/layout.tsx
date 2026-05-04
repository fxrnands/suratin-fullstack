'use client'

import type { ReactNode } from 'react'

import { RequireAuthGate } from '@/components/auth/require-auth-gate'

export default function BuatSuratLayout({ children }: { children: ReactNode }) {
  return <RequireAuthGate>{children}</RequireAuthGate>
}
