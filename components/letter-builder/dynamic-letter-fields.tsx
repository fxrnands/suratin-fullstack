'use client'

import type { Dispatch, ReactNode, SetStateAction } from 'react'

import { IzinDateFromPicker, IzinDateToPicker } from '@/components/letter-builder/izin-date-pickers'
import { IzinNadaControl } from '@/components/letter-builder/izin-nada-control'
import { OutputLanguageControl } from '@/components/letter-builder/output-language-control'
import { ToneProLocked } from '@/components/letter-builder/tone-pro-locked'
import { ToneControl } from '@/components/letter-builder/tone-control'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import type { LetterDraft, LetterKind } from '@/components/letter-builder/types'
import { useDynamicLetterFieldSteps } from '@/components/letter-builder/use-dynamic-letter-fields'
import {
  PENGA_DUAN_OUTCOME_OPTIONS,
  PENGA_DUAN_PRIOR_CONTACT_OPTIONS,
  PENGA_DUAN_PROBLEM_OPTIONS,
  PENGA_DUAN_URGENCY_OPTIONS,
} from '@/lib/letter/pengaduan-copy'
import { areIzinDatesComplete } from '@/lib/letter/izin-dates'
import { IZIN_LEAVE_OPTIONS } from '@/lib/letter/izin-leave-copy'

interface DynamicLetterFieldsProps {
  kind: LetterKind | null
  draft: LetterDraft
  setDraft: Dispatch<SetStateAction<LetterDraft>>
  toneProUnlocked: boolean
}

export function DynamicLetterFields({ kind, draft, setDraft, toneProUnlocked }: DynamicLetterFieldsProps) {
  const { pengaduanStep, setPengaduanStep, izinStep, setIzinStep } =
    useDynamicLetterFieldSteps(kind)

  if (!kind) {
    return (
      <div className="rounded-xl border border-dashed border-border/80 bg-secondary/20 px-4 py-10 text-center text-sm capitalize text-muted-foreground">
        Pilih jenis surat untuk melanjutkan pengisian formulir.
      </div>
    )
  }

  return (
    <div className="space-y-6 transition-opacity duration-200">
      <div className="space-y-4">
        <Field label="Nama lengkap">
          <Input
            autoComplete="name"
            placeholder="Sesuai identitas resmi"
            value={draft.fullName}
            onChange={(event) =>
              setDraft((previous) => ({ ...previous, fullName: event.target.value }))
            }
          />
        </Field>
        {kind === 'izin' ? (
          <Field label="NIM / NIS / ID karyawan (opsional)">
            <Input
              placeholder="Contoh: 2020123456, NIS-123, atau ID internal"
              value={draft.izin.employeeId}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  izin: { ...previous.izin, employeeId: event.target.value },
                }))
              }
            />
          </Field>
        ) : null}
        {kind !== 'izin' ? (
          toneProUnlocked ? (
            <ToneControl
              value={draft.tone}
              onChange={(tone) => setDraft((previous) => ({ ...previous, tone }))}
            />
          ) : (
            <div className="space-y-2">
              <span className="text-xs font-medium capitalize tracking-wide text-muted-foreground">Nada Bahasa</span>
              <ToneProLocked>
                <ToneControl value="formal" onChange={() => {}} showLabel={false} />
              </ToneProLocked>
            </div>
          )
        ) : null}
      </div>

      {kind === 'lamaran' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Posisi Yang Dilamar">
            <Input
              placeholder="Contoh: Associate Product Designer"
              value={draft.lamaran.position}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  lamaran: { ...previous.lamaran, position: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Perusahaan Tujuan">
            <Input
              placeholder="Nama perusahaan atau departemen"
              value={draft.lamaran.company}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  lamaran: { ...previous.lamaran, company: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Pendidikan Relevan" className="sm:col-span-2">
            <Input
              placeholder="Contoh: S1 Teknik Informatika — Universitas …"
              value={draft.lamaran.education}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  lamaran: { ...previous.lamaran, education: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Keahlian Utama" className="sm:col-span-2">
            <Textarea
              placeholder="Ringkas kompetensi yang mendukung posisi tersebut."
              rows={3}
              value={draft.lamaran.skills}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  lamaran: { ...previous.lamaran, skills: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Tempat, Tanggal Lahir (optional)">
            <Input
              placeholder="Contoh: Banten, 17 Mei 1998"
              value={draft.lamaran.birthPlaceDate}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  lamaran: { ...previous.lamaran, birthPlaceDate: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Nomor Telepon (optional)">
            <Input
              type="tel"
              autoComplete="tel"
              placeholder="+62 …"
              value={draft.lamaran.phone}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  lamaran: { ...previous.lamaran, phone: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Email (optional)" className="sm:col-span-2">
            <Input
              type="email"
              autoComplete="email"
              placeholder="nama@email.com"
              value={draft.lamaran.email}
              onChange={(event) => {
                const email = event.target.value
                setDraft((previous) => ({
                  ...previous,
                  lamaran: {
                    ...previous.lamaran,
                    email,
                    includeEmailInLetter: email.trim().length > 0,
                  },
                }))
              }}
            />
          </Field>
          <div className="space-y-2 sm:col-span-2">
            {toneProUnlocked ? (
              <OutputLanguageControl
                value={draft.outputLanguage}
                onChange={(outputLanguage) => setDraft((previous) => ({ ...previous, outputLanguage }))}
              />
            ) : (
              <div className="space-y-2">
                <span className="text-xs font-medium capitalize tracking-wide text-muted-foreground">Bahasa surat</span>
                <ToneProLocked>
                  <OutputLanguageControl value="id" onChange={() => {}} showLabel={false} />
                </ToneProLocked>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {kind === 'resign' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Perusahaan">
            <Input
              placeholder="Nama perusahaan"
              value={draft.resign.company}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  resign: { ...previous.resign, company: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Posisi saat ini">
            <Input
              placeholder="Jabatan Anda"
              value={draft.resign.position}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  resign: { ...previous.resign, position: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Berlaku mulai tanggal">
            <Input
              type="text"
              placeholder="Contoh: 30 Juni 2026"
              value={draft.resign.effectiveDate}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  resign: { ...previous.resign, effectiveDate: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Alasan (opsional)" className="sm:col-span-2">
            <Textarea
              placeholder="Opsional — bisa dikosongkan jika tidak ingin dicantumkan."
              rows={3}
              value={draft.resign.reason}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  resign: { ...previous.resign, reason: event.target.value },
                }))
              }
            />
          </Field>
        </div>
      ) : null}

      {kind === 'permohonan' ? (
        <div className="grid gap-4">
          <Field label="Instansi / pihak dituju">
            <Input
              placeholder="Nama instansi atau bagian yang dituju"
              value={draft.permohonan.institution}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  permohonan: { ...previous.permohonan, institution: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Tujuan permohonan">
            <Input
              placeholder="Ringkas judul permohonan (untuk baris Perihal)"
              value={draft.permohonan.purpose}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  permohonan: { ...previous.permohonan, purpose: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Untuk apa permohonan ini diajukan">
            <Textarea
              placeholder="Jelaskan secara ringkas apa yang Anda ajukan dan konteksnya (mis. jenis bantuan, dokumen, atau layanan yang dimohon)."
              rows={3}
              value={draft.permohonan.whatFor}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  permohonan: { ...previous.permohonan, whatFor: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Detail permohonan">
            <Textarea
              placeholder="Jelaskan secara sopan apa yang Anda mohonkan dan alasannya."
              rows={5}
              value={draft.permohonan.details}
              onChange={(event) =>
                setDraft((previous) => ({
                  ...previous,
                  permohonan: { ...previous.permohonan, details: event.target.value },
                }))
              }
            />
          </Field>
        </div>
      ) : null}

      {kind === 'izin' ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2 border-b border-border/50 pb-3">
            {[
              { step: 1, label: 'Jenis & tanggal' },
              { step: 2, label: 'Alasan' },
              { step: 3, label: 'Pihak dituju' },
            ].map(({ step, label }) => (
              <button
                key={step}
                type="button"
                onClick={() => setIzinStep(step)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  izinStep === step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                }`}
              >
                {step}. {label}
              </button>
            ))}
          </div>

          {izinStep === 1 ? (
            <div className="space-y-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Pilih jenis izin dan rentang tanggal. Nada surat memengaruhi redaksi pembuka dan penutup.
              </p>
              <Field label="Jenis izin">
                <Select
                  value={draft.izin.leaveType === '' ? undefined : draft.izin.leaveType}
                  onValueChange={(value) =>
                    setDraft((previous) => ({
                      ...previous,
                      izin: {
                        ...previous.izin,
                        leaveType: value as (typeof previous.izin)['leaveType'],
                      },
                    }))
                  }
                >
                  <SelectTrigger className="w-full min-w-0 max-w-full">
                    <SelectValue placeholder="Pilih jenis izin" />
                  </SelectTrigger>
                  <SelectContent>
                    {IZIN_LEAVE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Dari">
                  <IzinDateFromPicker
                    dateFrom={draft.izin.dateFrom ?? ''}
                    dateTo={draft.izin.dateTo ?? ''}
                    onDatesChange={(next) =>
                      setDraft((previous) => ({
                        ...previous,
                        izin: { ...previous.izin, ...next },
                      }))
                    }
                  />
                </Field>
                <Field label="Sampai">
                  <IzinDateToPicker
                    dateFrom={draft.izin.dateFrom ?? ''}
                    dateTo={draft.izin.dateTo ?? ''}
                    onDatesChange={(next) =>
                      setDraft((previous) => ({
                        ...previous,
                        izin: { ...previous.izin, ...next },
                      }))
                    }
                  />
                </Field>
              </div>
              {toneProUnlocked ? (
                <IzinNadaControl
                  value={draft.tone}
                  onChange={(tone) => setDraft((previous) => ({ ...previous, tone }))}
                />
              ) : (
                <div className="space-y-2">
                  <span className="text-xs font-medium capitalize tracking-wide text-muted-foreground">
                    Nada surat
                  </span>
                  <ToneProLocked>
                    <IzinNadaControl value="formal" onChange={() => {}} />
                  </ToneProLocked>
                </div>
              )}
            </div>
          ) : null}

          {izinStep === 2 ? (
            <div className="space-y-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Jelaskan alasan secara singkat dan jujur — cukup 1–2 kalimat. Detail tambahan opsional.
              </p>
              <Field label="Alasan singkat">
                <Textarea
                  placeholder="Contoh: Saya perlu mengurus keluarga yang sakit di rumah sakit."
                  rows={3}
                  value={draft.izin.reason}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      izin: { ...previous.izin, reason: event.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Detail tambahan (opsional)">
                <Textarea
                  placeholder="Contoh: nama acara, lokasi, atau keterangan medis ringan."
                  rows={3}
                  value={draft.izin.additionalDetails}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      izin: { ...previous.izin, additionalDetails: event.target.value },
                    }))
                  }
                />
              </Field>
              <div className="flex flex-col gap-3 rounded-lg border border-border/60 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-foreground">Ada bukti pendukung?</span>
                  <p className="text-xs text-muted-foreground">Surat dokter, undangan, bukti administrasi, dll.</p>
                </div>
                <Switch
                  checked={draft.izin.hasAttachment}
                  onCheckedChange={(checked) =>
                    setDraft((previous) => ({
                      ...previous,
                      izin: {
                        ...previous.izin,
                        hasAttachment: checked,
                        ...(!checked ? { attachmentNote: '' } : {}),
                      },
                    }))
                  }
                  aria-label="Ada bukti pendukung"
                />
              </div>
              {draft.izin.hasAttachment ? (
                <Field label="Sebutkan lampiran (opsional)">
                  <Input
                    placeholder="Contoh: surat dokter, undangan resmi"
                    value={draft.izin.attachmentNote}
                    onChange={(event) =>
                      setDraft((previous) => ({
                        ...previous,
                        izin: { ...previous.izin, attachmentNote: event.target.value },
                      }))
                    }
                  />
                </Field>
              ) : null}
            </div>
          ) : null}

          {izinStep === 3 ? (
            <div className="space-y-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Siapa yang menerima surat ini dan di mana. Cukup nama orang atau jabatan — salam pembuka seperti
                “Kepada Yth.” diatur otomatis di surat.
              </p>
              <Field label="Nama penerima">
                <Input
                  placeholder="Contoh: Ibu Dr. Sari, Wakil Dekan, atau HRD"
                  value={draft.izin.recipientName}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      izin: { ...previous.izin, recipientName: event.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Nama institusi">
                <Input
                  placeholder="Sekolah, kampus, atau perusahaan"
                  value={draft.izin.institution}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      izin: { ...previous.izin, institution: event.target.value },
                    }))
                  }
                />
              </Field>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={izinStep <= 1}
              onClick={() => setIzinStep((s) => Math.max(1, s - 1))}
            >
              Kembali
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={
                izinStep >= 3 ||
                (izinStep === 1 &&
                  (draft.izin.leaveType === '' || !areIzinDatesComplete(draft.izin))) ||
                (izinStep === 2 && draft.izin.reason.trim().length < 8)
              }
              onClick={() => setIzinStep((s) => Math.min(3, s + 1))}
            >
              Lanjut
            </Button>
          </div>
        </div>
      ) : null}

      {kind === 'pengaduan' ? (
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Identitas & pihak dituju
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Nama lengkap dan nada bahasa diisi di bagian atas. Email / nomor HP membantu instansi membalas (opsional,
              disarankan).
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email (opsional)">
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="nama@email.com"
                  value={draft.pengaduan.contactEmail}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      pengaduan: { ...previous.pengaduan, contactEmail: event.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Nomor HP (opsional)">
                <Input
                  type="tel"
                  autoComplete="tel"
                  placeholder="+62 …"
                  value={draft.pengaduan.contactPhone}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      pengaduan: { ...previous.pengaduan, contactPhone: event.target.value },
                    }))
                  }
                />
              </Field>
            </div>
            <Field label="Nama instansi / perusahaan">
              <Input
                placeholder="Contoh: PLN, Tokopedia, Bank BCA"
                value={draft.pengaduan.institution}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    pengaduan: { ...previous.pengaduan, institution: event.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Divisi / cabang (opsional)">
              <Input
                placeholder="Contoh: Customer Service, Cabang Sudirman, UP3 Bandung"
                value={draft.pengaduan.divisionOrBranch}
                onChange={(event) =>
                  setDraft((previous) => ({
                    ...previous,
                    pengaduan: { ...previous.pengaduan, divisionOrBranch: event.target.value },
                  }))
                }
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Jenis masalah">
                <Select
                  value={draft.pengaduan.problemCategory === '' ? undefined : draft.pengaduan.problemCategory}
                  onValueChange={(value) =>
                    setDraft((previous) => ({
                      ...previous,
                      pengaduan: {
                        ...previous.pengaduan,
                        problemCategory: value as (typeof previous.pengaduan)['problemCategory'],
                      },
                    }))
                  }
                >
                  <SelectTrigger className="w-full min-w-0 max-w-full">
                    <SelectValue placeholder="Pilih jenis masalah" />
                  </SelectTrigger>
                  <SelectContent>
                    {PENGA_DUAN_PROBLEM_OPTIONS.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Tingkat urgensi">
                <Select
                  value={draft.pengaduan.urgency}
                  onValueChange={(value) =>
                    setDraft((previous) => ({
                      ...previous,
                      pengaduan: { ...previous.pengaduan, urgency: value as (typeof previous.pengaduan)['urgency'] },
                    }))
                  }
                >
                  <SelectTrigger className="w-full min-w-0 max-w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PENGA_DUAN_URGENCY_OPTIONS.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field label="Pernah menghubungi pihak mereka sebelumnya?">
              <Select
                value={draft.pengaduan.priorContact}
                onValueChange={(value) =>
                  setDraft((previous) => ({
                    ...previous,
                    pengaduan: {
                      ...previous.pengaduan,
                      priorContact: value as (typeof previous.pengaduan)['priorContact'],
                      ...(value === 'tidak' ? { priorContactResponse: '' } : {}),
                    },
                  }))
                }
              >
                <SelectTrigger className="w-full min-w-0 max-w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PENGA_DUAN_PRIOR_CONTACT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            {draft.pengaduan.priorContact === 'ya' ? (
              <Field label="Ringkas respon mereka">
                <Textarea
                  placeholder="Apa yang mereka jawab atau lakukan setelah Anda menghubungi?"
                  rows={3}
                  value={draft.pengaduan.priorContactResponse}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      pengaduan: { ...previous.pengaduan, priorContactResponse: event.target.value },
                    }))
                  }
                />
              </Field>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-b border-border/50 pb-3">
            {[
              { step: 1, label: 'Kronologi' },
              { step: 2, label: 'Dampak & bukti' },
              { step: 3, label: 'Harapan' },
            ].map(({ step, label }) => (
              <button
                key={step}
                type="button"
                onClick={() => setPengaduanStep(step)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  pengaduanStep === step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                }`}
              >
                {step}. {label}
              </button>
            ))}
          </div>

          {pengaduanStep === 1 ? (
            <div className="space-y-2">
              <Field label="Apa yang terjadi?">
                <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
                  Ini bagian terpenting: kapan kejadiannya, apa yang terjadi, dan siapa yang terlibat. Tulis singkat &
                  jelas.
                </p>
                <Textarea
                  placeholder="Contoh: Pada 2 Mei 2026 saya menghubungi layanan pelanggan via aplikasi untuk…"
                  rows={8}
                  value={draft.pengaduan.issue}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      pengaduan: { ...previous.pengaduan, issue: event.target.value },
                    }))
                  }
                />
              </Field>
            </div>
          ) : null}

          {pengaduanStep === 2 ? (
            <div className="grid gap-4">
              <Field label="Dampak yang Anda alami (opsional)">
                <p className="mb-2 text-xs leading-relaxed text-muted-foreground">
                  Misalnya: kerugian materi, waktu terbuang, atau ketidaknyamanan. Membantu surat terasa substantif.
                </p>
                <Textarea
                  placeholder="Contoh: Saya kehilangan waktu kerja 2 hari untuk mengejar status pesanan…"
                  rows={4}
                  value={draft.pengaduan.impact}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      pengaduan: { ...previous.pengaduan, impact: event.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Nomor transaksi / ID pelanggan (opsional)">
                <Input
                  placeholder="Order ID, nomor rekening transaksi, nomor tiket, dll."
                  value={draft.pengaduan.transactionOrCustomerId}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      pengaduan: { ...previous.pengaduan, transactionOrCustomerId: event.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Tanggal kejadian spesifik (opsional)">
                <Input
                  placeholder="Contoh: 2 Mei 2026, pukul 14.30 WIB"
                  value={draft.pengaduan.incidentDate}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      pengaduan: { ...previous.pengaduan, incidentDate: event.target.value },
                    }))
                  }
                />
              </Field>
            </div>
          ) : null}

          {pengaduanStep === 3 ? (
            <div className="grid gap-4">
              <Field label="Hasil yang Anda inginkan">
                <Select
                  value={draft.pengaduan.desiredOutcome === '' ? undefined : draft.pengaduan.desiredOutcome}
                  onValueChange={(value) =>
                    setDraft((previous) => ({
                      ...previous,
                      pengaduan: {
                        ...previous.pengaduan,
                        desiredOutcome: value as (typeof previous.pengaduan)['desiredOutcome'],
                        ...(value !== 'lainnya' ? { desiredOutcomeOther: '' } : {}),
                      },
                    }))
                  }
                >
                  <SelectTrigger className="w-full min-w-0 max-w-full">
                    <SelectValue placeholder="Pilih harapan utama" />
                  </SelectTrigger>
                  <SelectContent>
                    {PENGA_DUAN_OUTCOME_OPTIONS.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              {draft.pengaduan.desiredOutcome === 'lainnya' ? (
                <Field label="Jelaskan hasil yang diinginkan (wajib jika Lainnya)">
                  <Textarea
                    placeholder="Tuliskan secara spesifik apa yang Anda harapkan."
                    rows={3}
                    value={draft.pengaduan.desiredOutcomeOther}
                    onChange={(event) =>
                      setDraft((previous) => ({
                        ...previous,
                        pengaduan: { ...previous.pengaduan, desiredOutcomeOther: event.target.value },
                      }))
                    }
                  />
                </Field>
              ) : null}
              <Field label="Catatan tambahan harapan (opsional)">
                <Textarea
                  placeholder="Contoh: Mohon konfirmasi tertulis paling lambat 7 hari kerja."
                  rows={3}
                  value={draft.pengaduan.resolution}
                  onChange={(event) =>
                    setDraft((previous) => ({
                      ...previous,
                      pengaduan: { ...previous.pengaduan, resolution: event.target.value },
                    }))
                  }
                />
              </Field>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={pengaduanStep <= 1}
              onClick={() => setPengaduanStep((s) => Math.max(1, s - 1))}
            >
              Kembali
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={
                pengaduanStep >= 3 ||
                (pengaduanStep === 1 && draft.pengaduan.issue.trim().length < 12)
              }
              onClick={() => setPengaduanStep((s) => Math.min(3, s + 1))}
            >
              Lanjut
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <Label className="mb-2 block text-xs font-medium capitalize tracking-wide text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  )
}
