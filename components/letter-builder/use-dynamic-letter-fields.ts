'use client'

import { useEffect, useState } from 'react'

import type { LetterKind } from '@/components/letter-builder/types'

export function useDynamicLetterFieldSteps(kind: LetterKind | null) {
  const [pengaduanStep, setPengaduanStep] = useState(1)
  const [izinStep, setIzinStep] = useState(1)

  useEffect(() => {
    if (kind !== 'pengaduan') setPengaduanStep(1)
  }, [kind])

  useEffect(() => {
    if (kind !== 'izin') setIzinStep(1)
  }, [kind])

  return {
    pengaduanStep,
    setPengaduanStep,
    izinStep,
    setIzinStep,
  }
}
