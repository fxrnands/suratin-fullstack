'use client'

import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { useMemo, useState } from 'react'

import { parseIzinIsoDate } from '@/lib/letter/izin-dates'

function triggerLabel(iso: unknown): string {
  const date = parseIzinIsoDate(iso)
  if (!date) return 'Pilih tanggal'
  return format(date, 'd MMM yyyy', { locale: localeId })
}

export function useIzinDateFromPickerState(dateFrom: string, dateTo: string) {
  const [open, setOpen] = useState(false)
  const fromDate = useMemo(() => parseIzinIsoDate(dateFrom), [dateFrom])
  const toDate = useMemo(() => parseIzinIsoDate(dateTo), [dateTo])

  return {
    open,
    setOpen,
    fromDate,
    toDate,
    label: triggerLabel(dateFrom),
  }
}

export function useIzinDateToPickerState(dateFrom: string, dateTo: string) {
  const [open, setOpen] = useState(false)
  const fromDate = useMemo(() => parseIzinIsoDate(dateFrom), [dateFrom])
  const toDate = useMemo(() => parseIzinIsoDate(dateTo), [dateTo])

  return {
    open,
    setOpen,
    fromDate,
    toDate,
    label: triggerLabel(dateTo),
  }
}
