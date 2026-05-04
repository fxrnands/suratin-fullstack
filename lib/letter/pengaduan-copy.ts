import type {
  PengaduanDesiredOutcomeId,
  PengaduanPriorContact,
  PengaduanProblemCategoryId,
  PengaduanUrgencyId,
} from '@/components/letter-builder/types'

export const PENGA_DUAN_PROBLEM_OPTIONS: { id: PengaduanProblemCategoryId; label: string }[] = [
  { id: 'layanan_buruk', label: 'Layanan buruk' },
  { id: 'tagihan_tidak_sesuai', label: 'Tagihan tidak sesuai' },
  { id: 'produk_bermasalah', label: 'Produk bermasalah' },
  { id: 'penipuan_fraud', label: 'Penipuan / fraud' },
  { id: 'keterlambatan_layanan', label: 'Keterlambatan layanan' },
  { id: 'lainnya_masalah', label: 'Lainnya' },
]

export const PENGA_DUAN_OUTCOME_OPTIONS: { id: PengaduanDesiredOutcomeId; label: string }[] = [
  { id: 'refund', label: 'Refund' },
  { id: 'perbaikan_layanan', label: 'Perbaikan layanan' },
  { id: 'klarifikasi', label: 'Klarifikasi' },
  { id: 'kompensasi', label: 'Kompensasi' },
  { id: 'tindakan_pihak_terkait', label: 'Tindakan terhadap pihak terkait' },
  { id: 'lainnya', label: 'Lainnya' },
]

export const PENGA_DUAN_URGENCY_OPTIONS: { id: PengaduanUrgencyId; label: string }[] = [
  { id: 'normal', label: 'Normal' },
  { id: 'mendesak', label: 'Mendesak' },
  { id: 'sangat_mendesak', label: 'Sangat mendesak' },
]

export const PENGA_DUAN_PRIOR_CONTACT_OPTIONS: { id: PengaduanPriorContact; label: string }[] = [
  { id: 'tidak', label: 'Tidak' },
  { id: 'ya', label: 'Ya' },
]

export function labelPengaduanProblem(id: PengaduanProblemCategoryId): string {
  return PENGA_DUAN_PROBLEM_OPTIONS.find((o) => o.id === id)?.label ?? id
}

export function labelPengaduanOutcome(id: PengaduanDesiredOutcomeId): string {
  return PENGA_DUAN_OUTCOME_OPTIONS.find((o) => o.id === id)?.label ?? id
}

export function labelPengaduanUrgency(id: PengaduanUrgencyId): string {
  return PENGA_DUAN_URGENCY_OPTIONS.find((o) => o.id === id)?.label ?? id
}
