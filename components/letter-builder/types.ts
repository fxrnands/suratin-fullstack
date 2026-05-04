export const LETTER_KINDS = ['lamaran', 'resign', 'permohonan', 'izin', 'pengaduan'] as const

export type LetterKind = (typeof LETTER_KINDS)[number]

export type Tone = 'formal' | 'tegas' | 'persuasif'

const TONES: Tone[] = ['formal', 'tegas', 'persuasif']

export const OUTPUT_LANGUAGES = ['id', 'en'] as const

export type LetterOutputLanguage = (typeof OUTPUT_LANGUAGES)[number]

export const PENGA_DUAN_PROBLEM_CATEGORY_IDS = [
  'layanan_buruk',
  'tagihan_tidak_sesuai',
  'produk_bermasalah',
  'penipuan_fraud',
  'keterlambatan_layanan',
  'lainnya_masalah',
] as const

export type PengaduanProblemCategoryId = (typeof PENGA_DUAN_PROBLEM_CATEGORY_IDS)[number]

export const PENGA_DUAN_DESIRED_OUTCOME_IDS = [
  'refund',
  'perbaikan_layanan',
  'klarifikasi',
  'kompensasi',
  'tindakan_pihak_terkait',
  'lainnya',
] as const

export type PengaduanDesiredOutcomeId = (typeof PENGA_DUAN_DESIRED_OUTCOME_IDS)[number]

export const PENGA_DUAN_URGENCY_IDS = ['normal', 'mendesak', 'sangat_mendesak'] as const

export type PengaduanUrgencyId = (typeof PENGA_DUAN_URGENCY_IDS)[number]

/** Riwayat kontak sebelum surat ini (opsional di UI; default `tidak`). */
export type PengaduanPriorContact = 'tidak' | 'ya'

export const IZIN_LEAVE_TYPE_IDS = ['sakit', 'keluarga', 'acara', 'administrasi', 'lainnya'] as const

export type IzinLeaveTypeId = (typeof IZIN_LEAVE_TYPE_IDS)[number]

export interface LetterDraft {
  kind: LetterKind | null
  fullName: string
  tone: Tone
  /** Letter body language; Pro-only selection — non-Pro forced to `id` on server. */
  outputLanguage: LetterOutputLanguage
  lamaran: {
    position: string
    company: string
    education: string
    skills: string
    /** Opsional — contoh: "Banten, 17 Mei 1998" */
    birthPlaceDate: string
    phone: string
    email: string
    /** Jika true dan `email` terisi, email dimasukkan ke blok identitas surat */
    includeEmailInLetter: boolean
  }
  resign: {
    company: string
    position: string
    effectiveDate: string
    reason: string
  }
  permohonan: {
    institution: string
    purpose: string
    /** Jelaskan untuk apa permohonan ini diajukan (ringkasan ajuan). */
    whatFor: string
    details: string
  }
  izin: {
    /** Contoh: Bapak/Ibu Dosen, HRD — hindari "Kepada Yth." di sini. */
    recipientName: string
    institution: string
    leaveType: IzinLeaveTypeId | ''
    reason: string
    /** ISO `yyyy-MM-dd` */
    dateFrom: string
    /** ISO `yyyy-MM-dd` */
    dateTo: string
    /** NIM / NIS / ID karyawan (opsional). */
    employeeId: string
    /** Konteks tambahan: acara, lokasi, dll. (opsional). */
    additionalDetails: string
    hasAttachment: boolean
    /** Contoh: surat dokter, undangan (opsional jika `hasAttachment`). */
    attachmentNote: string
  }
  pengaduan: {
    institution: string
    /** Divisi / cabang / unit (opsional). */
    divisionOrBranch: string
    contactPhone: string
    contactEmail: string
    problemCategory: PengaduanProblemCategoryId | ''
    issue: string
    impact: string
    transactionOrCustomerId: string
    incidentDate: string
    desiredOutcome: PengaduanDesiredOutcomeId | ''
    /** Wajib diisi jika `desiredOutcome` = lainnya. */
    desiredOutcomeOther: string
    /** Catatan tambahan harapan penyelesaian (opsional). */
    resolution: string
    urgency: PengaduanUrgencyId
    priorContact: PengaduanPriorContact
    /** Jika `priorContact` = ya: ringkas respon pihak instansi. */
    priorContactResponse: string
  }
}

export function createEmptyDraft(): LetterDraft {
  return {
    kind: null,
    fullName: '',
    tone: 'formal',
    outputLanguage: 'id',
    lamaran: {
      position: '',
      company: '',
      education: '',
      skills: '',
      birthPlaceDate: '',
      phone: '',
      email: '',
      includeEmailInLetter: false,
    },
    resign: { company: '', position: '', effectiveDate: '', reason: '' },
    permohonan: { institution: '', purpose: '', whatFor: '', details: '' },
    izin: {
      recipientName: '',
      institution: '',
      leaveType: '',
      reason: '',
      dateFrom: '',
      dateTo: '',
      employeeId: '',
      additionalDetails: '',
      hasAttachment: false,
      attachmentNote: '',
    },
    pengaduan: {
      institution: '',
      divisionOrBranch: '',
      contactPhone: '',
      contactEmail: '',
      problemCategory: '',
      issue: '',
      impact: '',
      transactionOrCustomerId: '',
      incidentDate: '',
      desiredOutcome: '',
      desiredOutcomeOther: '',
      resolution: '',
      urgency: 'normal',
      priorContact: 'tidak',
      priorContactResponse: '',
    },
  }
}

export function mergeParsedDraft(raw: unknown): LetterDraft {
  const empty = createEmptyDraft()
  if (!raw || typeof raw !== 'object') return empty
  const p = raw as Partial<LetterDraft>
  const kindCandidate = p.kind
  const kind =
    typeof kindCandidate === 'string' && (LETTER_KINDS as readonly string[]).includes(kindCandidate)
      ? (kindCandidate as LetterKind)
      : null
  const toneCandidate = p.tone
  const tone =
    typeof toneCandidate === 'string' && TONES.includes(toneCandidate as Tone)
      ? (toneCandidate as Tone)
      : empty.tone

  const langCandidate = p.outputLanguage
  const outputLanguage =
    langCandidate === 'id' || langCandidate === 'en' ? langCandidate : empty.outputLanguage

  return {
    ...empty,
    ...p,
    kind,
    tone,
    outputLanguage,
    lamaran: {
      ...empty.lamaran,
      ...p.lamaran,
      birthPlaceDate:
        typeof p.lamaran?.birthPlaceDate === 'string' ? p.lamaran.birthPlaceDate : empty.lamaran.birthPlaceDate,
      phone: typeof p.lamaran?.phone === 'string' ? p.lamaran.phone : empty.lamaran.phone,
      email: typeof p.lamaran?.email === 'string' ? p.lamaran.email : empty.lamaran.email,
      includeEmailInLetter:
        (typeof p.lamaran?.email === 'string' ? p.lamaran.email : empty.lamaran.email).trim().length > 0,
    },
    resign: { ...empty.resign, ...p.resign },
    permohonan: {
      ...empty.permohonan,
      ...p.permohonan,
      whatFor:
        typeof p.permohonan?.whatFor === 'string' ? p.permohonan.whatFor : empty.permohonan.whatFor,
    },
    izin: (() => {
      const raw =
        p.izin && typeof p.izin === 'object' ? (p.izin as Partial<LetterDraft['izin']>) : {}
      const leaveCandidate = raw.leaveType
      const leaveOk =
        typeof leaveCandidate === 'string' &&
        (IZIN_LEAVE_TYPE_IDS as readonly string[]).includes(leaveCandidate)
      return {
        recipientName:
          typeof raw.recipientName === 'string' ? raw.recipientName : empty.izin.recipientName,
        institution:
          typeof raw.institution === 'string' ? raw.institution : empty.izin.institution,
        leaveType: leaveOk ? (leaveCandidate as IzinLeaveTypeId) : empty.izin.leaveType,
        reason: typeof raw.reason === 'string' ? raw.reason : empty.izin.reason,
        dateFrom: typeof raw.dateFrom === 'string' ? raw.dateFrom : empty.izin.dateFrom,
        dateTo: typeof raw.dateTo === 'string' ? raw.dateTo : empty.izin.dateTo,
        employeeId: typeof raw.employeeId === 'string' ? raw.employeeId : empty.izin.employeeId,
        additionalDetails:
          typeof raw.additionalDetails === 'string' ? raw.additionalDetails : empty.izin.additionalDetails,
        hasAttachment: typeof raw.hasAttachment === 'boolean' ? raw.hasAttachment : empty.izin.hasAttachment,
        attachmentNote:
          typeof raw.attachmentNote === 'string' ? raw.attachmentNote : empty.izin.attachmentNote,
      }
    })(),
    pengaduan: (() => {
      const raw = p.pengaduan
      const merged: LetterDraft['pengaduan'] = {
        ...empty.pengaduan,
        ...(raw && typeof raw === 'object' ? raw : {}),
        divisionOrBranch:
          typeof raw?.divisionOrBranch === 'string' ? raw.divisionOrBranch : empty.pengaduan.divisionOrBranch,
        contactPhone: typeof raw?.contactPhone === 'string' ? raw.contactPhone : empty.pengaduan.contactPhone,
        contactEmail: typeof raw?.contactEmail === 'string' ? raw.contactEmail : empty.pengaduan.contactEmail,
        impact: typeof raw?.impact === 'string' ? raw.impact : empty.pengaduan.impact,
        transactionOrCustomerId:
          typeof raw?.transactionOrCustomerId === 'string'
            ? raw.transactionOrCustomerId
            : empty.pengaduan.transactionOrCustomerId,
        incidentDate: typeof raw?.incidentDate === 'string' ? raw.incidentDate : empty.pengaduan.incidentDate,
        desiredOutcomeOther:
          typeof raw?.desiredOutcomeOther === 'string' ? raw.desiredOutcomeOther : empty.pengaduan.desiredOutcomeOther,
        priorContactResponse:
          typeof raw?.priorContactResponse === 'string'
            ? raw.priorContactResponse
            : empty.pengaduan.priorContactResponse,
      }
      const problemOk =
        typeof raw?.problemCategory === 'string' &&
        (PENGA_DUAN_PROBLEM_CATEGORY_IDS as readonly string[]).includes(raw.problemCategory)
      merged.problemCategory = problemOk ? (raw.problemCategory as PengaduanProblemCategoryId) : ''

      const outcomeOk =
        typeof raw?.desiredOutcome === 'string' &&
        (PENGA_DUAN_DESIRED_OUTCOME_IDS as readonly string[]).includes(raw.desiredOutcome)
      merged.desiredOutcome = outcomeOk ? (raw.desiredOutcome as PengaduanDesiredOutcomeId) : ''

      const urgencyOk =
        typeof raw?.urgency === 'string' && (PENGA_DUAN_URGENCY_IDS as readonly string[]).includes(raw.urgency)
      merged.urgency = urgencyOk ? (raw.urgency as PengaduanUrgencyId) : empty.pengaduan.urgency

      merged.priorContact =
        raw?.priorContact === 'ya' || raw?.priorContact === 'tidak' ? raw.priorContact : empty.pengaduan.priorContact

      const rawLoose = raw as Record<string, unknown> | undefined
      const legacy =
        rawLoose &&
        typeof rawLoose === 'object' &&
        !('problemCategory' in rawLoose) &&
        typeof rawLoose.issue === 'string' &&
        typeof rawLoose.resolution === 'string' &&
        String(rawLoose.resolution).trim().length > 0

      if (legacy && !merged.desiredOutcome) {
        merged.desiredOutcome = 'lainnya'
        merged.desiredOutcomeOther = String(rawLoose.resolution).trim()
        merged.resolution = ''
      }

      return merged
    })(),
  }
}
