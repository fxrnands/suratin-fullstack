import type { LetterDraft, LetterKind, Tone } from '@/components/letter-builder/types'
import { formatIzinDateRangeForLetter } from '@/lib/letter/izin-dates'
import { labelIzinLeaveType } from '@/lib/letter/izin-leave-copy'
import {
  labelPengaduanOutcome,
  labelPengaduanProblem,
  labelPengaduanUrgency,
} from '@/lib/letter/pengaduan-copy'

/** Kota pada kop tanggal — konsisten dengan surat dinas Indonesia umum. */
export const LETTER_HEADER_CITY_DEFAULT = 'Jakarta'

export interface GeneratedLetter {
  subject: string
  lines: string[]
}

export type LetterOutputLocale = 'id' | 'en'

export function formatLetterHeaderDateLocalized(
  city = LETTER_HEADER_CITY_DEFAULT,
  locale: LetterOutputLocale = 'id',
): string {
  const tanggal = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
  return `${city}, ${tanggal}`
}

export function formatLetterHeaderDate(city = LETTER_HEADER_CITY_DEFAULT): string {
  return formatLetterHeaderDateLocalized(city, 'id')
}

/** Baris pertama alamat — lamaran/resign/pengaduan ke perusahaan vs izin ke sekolah. */
export function inferRecipientSalutation(kind: LetterKind, institutionOrCompany: string): string {
  const raw = institutionOrCompany.trim()
  const lower = raw.toLowerCase()

  if (kind === 'lamaran') {
    return 'Bapak/Ibu Personalia atau Pimpinan'
  }

  if (kind === 'resign') {
    return 'Bapak/Ibu Pimpinan'
  }

  if (kind === 'izin') {
    const educationHint =
      /\b(smk|sman|smp|sdn|sd\s|sd-|mi\s|mts|ma\s|universitas|univ\.|institut|inst\.|politeknik|poltek|sekolah|kampus|akademi)\b/i.test(
        raw,
      )
    return educationHint ? 'Kepala Sekolah atau Kepala Bagian Akademik' : 'Bapak/Ibu Pimpinan'
  }

  if (kind === 'pengaduan') {
    return lower.includes('bank') || lower.includes('telkom')
      ? 'Bapak/Ibu Pimpinan atau Bagian Layanan Nasabah/Pelanggan'
      : 'Bapak/Ibu Pimpinan atau Bagian yang bersangkutan'
  }

  return 'Bapak/Ibu Pimpinan'
}

/** Paragraf pembuka setelah baris terpisah "Dengan hormat," */
export function toneOpeningParagraph(tone: Tone): string {
  switch (tone) {
    case 'tegas':
      return 'Sehubungan dengan hal tersebut di atas, dengan ini saya menyampaikan hal-hal sebagai berikut.'
    case 'persuasif':
      return 'Berbekal uraian berikut, saya berharap Bapak/Ibu dapat memberikan pertimbangan yang positif.'
    default:
      return 'Bersama surat ini saya sampaikan hal-hal sebagai berikut.'
  }
}

export function toneClosingParagraph(tone: Tone): string {
  switch (tone) {
    case 'tegas':
      return 'Demikian surat ini saya buat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya.'
    case 'persuasif':
      return 'Atas perhatian dan keputusan Bapak/Ibu, saya ucapkan terima kasih.'
    default:
      return 'Demikian surat ini saya buat. Atas perhatian dan bantuannya, saya ucapkan terima kasih.'
  }
}

function recipientBlock(institutionLine: string, salutationLine: string): string[] {
  return ['Kepada Yth.', salutationLine, institutionLine.trim(), 'Di tempat', '']
}

function recipientBlockForIzin(recipientName: string, institution: string, salutationLine: string): string[] {
  return ['Kepada Yth.', salutationLine, recipientName.trim(), institution.trim(), 'Di tempat', '']
}

function closingSignatureWithTone(name: string, tone: Tone): string[] {
  return ['', toneClosingParagraph(tone), '', 'Hormat saya,', '', name]
}

export function generateLetterPreview(draft: LetterDraft & { kind: LetterKind }): GeneratedLetter {
  const cityDate = formatLetterHeaderDate()
  const name = draft.fullName.trim()
  const tone = draft.tone

  switch (draft.kind) {
    case 'lamaran': {
      const { position, company, education, skills, birthPlaceDate, phone, email, includeEmailInLetter } =
        draft.lamaran
      const subject = `Lamaran pekerjaan untuk posisi ${position.trim()}`
      const salutation = inferRecipientSalutation('lamaran', company)
      const identity: string[] = ['Saya yang bertanda tangan di bawah ini:', '', `Nama: ${name}`]
      if (birthPlaceDate.trim()) {
        identity.push(`Tempat, Tanggal Lahir: ${birthPlaceDate.trim()}`)
      }
      if (phone.trim()) {
        identity.push(`Nomor Telepon: ${phone.trim()}`)
      }
      if (includeEmailInLetter && email.trim()) {
        identity.push(`Email: ${email.trim()}`)
      }
      const lines = [
        cityDate,
        '',
        ...recipientBlock(company.trim(), salutation),
        `Perihal: ${subject}`,
        '',
        'Dengan hormat,',
        '',
        ...identity,
        '',
        toneOpeningParagraph(tone),
        '',
        `Bermaksud mengajukan lamaran secara resmi untuk posisi ${position.trim()} pada ${company.trim()}.`,
        '',
        `Latar belakang pendidikan yang relevan adalah ${education.trim()}. Kompetensi utama yang saya miliki meliputi ${skills.trim()}.`,
        '',
        `Besar harapan saya dapat diberi kesempatan wawancara serta berkontribusi secara profesional pada lingkungan kerja Bapak/Ibu.`,
        '',
        'Atas perhatian dan kesempatannya, saya ucapkan terima kasih.',
        ...closingSignatureWithTone(name, tone),
      ]
      return { subject, lines }
    }

    case 'resign': {
      const { company, position, effectiveDate, reason } = draft.resign
      const perihalLine = `Pengunduran diri dari posisi ${position.trim()}`
      const salutation = inferRecipientSalutation('resign', company)
      const identity: string[] = [
        'Saya yang bertanda tangan di bawah ini:',
        '',
        `Nama: ${name}`,
        `Jabatan: ${position.trim()}`,
        `Perusahaan: ${company.trim()}`,
      ]
      const body: string[] = [
        '',
        toneOpeningParagraph(tone),
        '',
        `Melalui surat ini, saya menyampaikan pengunduran diri yang berlaku efektif mulai tanggal ${effectiveDate.trim()}.`,
      ]
      if (reason.trim()) {
        body.push('', `Alasan pengunduran diri: ${reason.trim()}.`)
      }
      body.push(
        '',
        'Selama masa transisi, saya bersedia membantu penyerahan tugas dan dokumentasi agar berjalan tertib.',
        '',
        'Atas perhatian dan kerja sama Bapak/Ibu selama ini, saya ucapkan terima kasih.',
      )
      const lines = [
        cityDate,
        '',
        ...recipientBlock(company.trim(), salutation),
        `Perihal: ${perihalLine}`,
        '',
        'Dengan hormat,',
        '',
        ...identity,
        ...body,
        ...closingSignatureWithTone(name, tone),
      ]
      return { subject: 'Surat Pengunduran Diri', lines }
    }

    case 'permohonan': {
      const { institution, purpose, whatFor, details } = draft.permohonan
      const subject = purpose.trim()
      const salutation = inferRecipientSalutation('permohonan', institution)
      const lines = [
        cityDate,
        '',
        ...recipientBlock(institution.trim(), salutation),
        `Perihal: Permohonan ${subject}`,
        '',
        'Dengan hormat,',
        '',
        toneOpeningParagraph(tone),
        '',
        `Yang bertanda tangan di bawah ini: ${name}.`,
        '',
        `Dengan ini mengajukan permohonan untuk ${subject}.`,
        '',
        whatFor.trim(),
        '',
        details.trim(),
        ...closingSignatureWithTone(name, tone),
      ]
      return { subject, lines }
    }

    case 'izin': {
      const iz = draft.izin
      const { institution, reason, recipientName, leaveType, employeeId, additionalDetails, hasAttachment, attachmentNote } =
        iz
      const dateRange = formatIzinDateRangeForLetter(iz).trim()
      const leaveLabel = labelIzinLeaveType(leaveType)
      const subject =
        leaveLabel !== ''
          ? `Permohonan izin — ${leaveLabel} (${dateRange})`
          : `Permohonan izin (${dateRange})`
      const salutation = inferRecipientSalutation('izin', institution)
      const identityLines = [`Yang bertanda tangan di bawah ini: ${name}.`]
      if (employeeId.trim()) {
        identityLines.push(`NIM/NIS/ID: ${employeeId.trim()}.`)
      }
      const attachmentLine =
        hasAttachment && attachmentNote.trim()
          ? `Sebagai bahan pertimbangan, saya lampirkan ${attachmentNote.trim()}.`
          : hasAttachment
            ? 'Sebagai bahan pertimbangan, saya melampirkan bukti pendukung.'
            : ''
      const lines = [
        cityDate,
        '',
        ...recipientBlockForIzin(recipientName, institution, salutation),
        `Perihal: ${subject}`,
        '',
        'Dengan hormat,',
        '',
        toneOpeningParagraph(tone),
        '',
        ...identityLines,
        '',
        `Dengan ini mengajukan izin tidak mengikuti kegiatan/tugas pada rentang waktu ${dateRange}${
          leaveLabel ? `, untuk keperluan: ${leaveLabel}` : ''
        }. Alasan: ${(reason ?? '').trim()}.`,
        ...(additionalDetails.trim() ? ['', 'Keterangan tambahan:', additionalDetails.trim()] : []),
        '',
        `Selama berhalangan, saya akan menginformasikan kepada pihak terkait atau menyediakan pengganti tugas sesuai ketentuan yang berlaku.`,
        ...(attachmentLine ? ['', attachmentLine] : []),
        ...closingSignatureWithTone(name, tone),
      ]
      return { subject, lines }
    }

    case 'pengaduan': {
      const peng = draft.pengaduan
      const inst = peng.institution.trim()
      const div = peng.divisionOrBranch.trim()
      const targetLine = div ? `${inst} — ${div}` : inst
      const subject =
        peng.problemCategory !== ''
          ? `Pengaduan — ${labelPengaduanProblem(peng.problemCategory)}`
          : `Pengaduan kepada ${inst}`
      const salutation = inferRecipientSalutation('pengaduan', inst)
      const contactBits = [peng.contactPhone.trim(), peng.contactEmail.trim()].filter(Boolean)
      const contactLine = contactBits.length ? `Kontak: ${contactBits.join(' · ')}` : ''
      const outcomeText =
        peng.desiredOutcome === ''
          ? [peng.desiredOutcomeOther.trim(), peng.resolution.trim()].filter(Boolean).join('. ')
          : peng.desiredOutcome === 'lainnya'
            ? peng.desiredOutcomeOther.trim() || peng.resolution.trim()
            : [labelPengaduanOutcome(peng.desiredOutcome), peng.resolution.trim()].filter(Boolean).join('. ')
      const evidence: string[] = []
      if (peng.transactionOrCustomerId.trim()) {
        evidence.push(`Nomor transaksi / ID pelanggan: ${peng.transactionOrCustomerId.trim()}.`)
      }
      if (peng.incidentDate.trim()) {
        evidence.push(`Tanggal kejadian: ${peng.incidentDate.trim()}.`)
      }
      const lines = [
        cityDate,
        '',
        ...recipientBlock(targetLine, salutation),
        `Perihal: Pengaduan kepada ${inst}`,
        '',
        'Dengan hormat,',
        '',
        toneOpeningParagraph(tone),
        '',
        `Yang bertanda tangan di bawah ini: ${name}.`,
        ...(contactLine ? ['', contactLine] : []),
        '',
        `Jenis masalah: ${peng.problemCategory ? labelPengaduanProblem(peng.problemCategory) : '[belum dipilih]'}.`,
        ...(peng.urgency !== 'normal' ? ['', `Tingkat urgensi: ${labelPengaduanUrgency(peng.urgency)}.`] : []),
        ...(peng.priorContact === 'ya' && peng.priorContactResponse.trim()
          ? [
              '',
              `Sebelumnya saya telah menghubungi pihak ${inst} dengan tanggapan berikut: ${peng.priorContactResponse.trim()}`,
            ]
          : []),
        '',
        'Uraian kronologi:',
        peng.issue.trim(),
        ...(peng.impact.trim() ? ['', 'Dampak yang dialami:', peng.impact.trim()] : []),
        ...(evidence.length ? ['', ...evidence] : []),
        '',
        'Harapan penyelesaian:',
        outcomeText || peng.resolution.trim(),
        ...closingSignatureWithTone(name, tone),
      ]
      return { subject, lines }
    }
  }
}
