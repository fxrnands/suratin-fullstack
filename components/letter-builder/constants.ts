import type { LucideIcon } from 'lucide-react'
import { AlertTriangle, Briefcase, CalendarCheck, LogOut } from 'lucide-react'

import type { LetterKind } from '@/components/letter-builder/types'

export const STORAGE_KEY = 'suratin-letter-draft-v1'

/** `LETTER_TYPE_OPTIONS`: produk aktif (4 jenis). `permohonan` sementara tidak dijual — tetap ada di tipe `LetterKind` untuk draft/API lama. */

export interface LetterTypeOption {
  id: LetterKind
  title: string
  description: string
  icon: LucideIcon
}

export const LETTER_TYPE_OPTIONS: LetterTypeOption[] = [
  {
    id: 'lamaran',
    title: 'Surat Lamaran Kerja',
    description: 'Ambil kesempatan karier yang tepat dengan kesan pertama yang profesional.',
    icon: Briefcase,
  },
  {
    id: 'resign',
    title: 'Surat Resign',
    description: 'Tutup bab pekerjaan dengan sopan dan tetap menjaga relasi baik.',
    icon: LogOut,
  },
  {
    id: 'izin',
    title: 'Surat Izin / Dispensasi',
    description: 'Minta izin atau dispensasi tanpa menyalahi protokol institusi.',
    icon: CalendarCheck,
  },
  {
    id: 'pengaduan',
    title: 'Surat Pengaduan',
    description: 'Sampaikan masalah secara tertulis agar ditindak dengan serius.',
    icon: AlertTriangle,
  },
]
