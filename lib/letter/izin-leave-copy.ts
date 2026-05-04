import type { IzinLeaveTypeId } from '@/components/letter-builder/types'
import { IZIN_LEAVE_TYPE_IDS } from '@/components/letter-builder/types'

const LABELS: Record<IzinLeaveTypeId, string> = {
  sakit: 'Sakit',
  keluarga: 'Keperluan keluarga',
  acara: 'Acara penting',
  administrasi: 'Urusan administrasi',
  lainnya: 'Lainnya',
}

export const IZIN_LEAVE_OPTIONS: { id: IzinLeaveTypeId; label: string }[] = IZIN_LEAVE_TYPE_IDS.map((id) => ({
  id,
  label: LABELS[id],
}))

export function labelIzinLeaveType(id: IzinLeaveTypeId | ''): string {
  if (id === '') return ''
  return LABELS[id] ?? id
}
