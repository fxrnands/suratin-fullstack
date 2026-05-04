'use client'

import { format } from 'date-fns'
import { ChevronDownIcon } from 'lucide-react'

import {
  useIzinDateFromPickerState,
  useIzinDateToPickerState,
} from '@/components/letter-builder/use-izin-date-picker'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { parseIzinIsoDate } from '@/lib/letter/izin-dates'
import { cn } from '@/lib/utils'

const DATE_TRIGGER_BASE =
  'border-input [&_svg]:text-muted-foreground dark:bg-input/30 flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-md border bg-transparent px-3 text-left text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 md:text-sm'

interface DatesChangePayload {
  dateFrom: string
  dateTo: string
}

interface IzinDatePickersSharedProps {
  dateFrom: string
  dateTo: string
  onDatesChange: (next: DatesChangePayload) => void
}

export function IzinDateFromPicker({ dateFrom, dateTo, onDatesChange }: IzinDatePickersSharedProps) {
  const { open, setOpen, fromDate, toDate, label } =
    useIzinDateFromPickerState(dateFrom, dateTo)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(DATE_TRIGGER_BASE, !fromDate && 'text-muted-foreground')}
          aria-label="Tanggal mulai izin"
        >
          <span className="min-w-0 flex-1 truncate">{label}</span>
          <ChevronDownIcon className="size-4 shrink-0 opacity-60" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          defaultMonth={fromDate ?? toDate ?? new Date()}
          selected={fromDate}
          onSelect={(date) => {
            if (!date) {
              onDatesChange({ dateFrom: '', dateTo: dateTo ?? '' })
              return
            }
            const nextFrom = format(date, 'yyyy-MM-dd')
            let nextTo = dateTo
            const end = parseIzinIsoDate(dateTo)
            if (end && end < date) {
              nextTo = nextFrom
            }
            onDatesChange({ dateFrom: nextFrom, dateTo: nextTo })
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

export function IzinDateToPicker({ dateFrom, dateTo, onDatesChange }: IzinDatePickersSharedProps) {
  const { open, setOpen, fromDate, toDate, label } =
    useIzinDateToPickerState(dateFrom, dateTo)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(DATE_TRIGGER_BASE, !toDate && 'text-muted-foreground')}
          aria-label="Tanggal selesai izin"
        >
          <span className="min-w-0 flex-1 truncate">{label}</span>
          <ChevronDownIcon className="size-4 shrink-0 opacity-60" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          defaultMonth={toDate ?? fromDate ?? new Date()}
          selected={toDate}
          disabled={fromDate ? { before: fromDate } : undefined}
          onSelect={(date) => {
            if (!date) {
              onDatesChange({ dateFrom: dateFrom ?? '', dateTo: '' })
              return
            }
            const nextTo = format(date, 'yyyy-MM-dd')
            onDatesChange({ dateFrom, dateTo: nextTo })
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
