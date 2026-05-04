import { ApiError as GeminiApiError, GoogleGenAI } from '@google/genai'
import { z } from 'zod'

import type { LetterDraft, LetterKind } from '@/components/letter-builder/types'
import { resolveGeminiModelChain } from '@/lib/gemini/gemini-model-chain'
import { geminiLetterStructureInstructions } from '@/lib/letter/gemini-letter-structure'
import { LETTER_HEADER_CITY_DEFAULT } from '@/lib/letter/indonesian-templates'
import { ApiError } from '@/lib/http/api-error'

const geminiLetterSchema = z.object({
  subject: z.string(),
  lines: z.array(z.string()),
})

function stripJsonFence(text: string) {
  const trimmed = text.trim()
  if (trimmed.startsWith('```')) {
    return trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  }
  return trimmed
}

function shouldTryNextGeminiModel(error: unknown): boolean {
  if (error instanceof GeminiApiError && typeof error.status === 'number') {
    const status = error.status
    if (status === 429 || status === 408 || status >= 500) return true
    if (status === 404) return true
    return false
  }
  const message = error instanceof Error ? error.message.toLowerCase() : ''
  return (
    message.includes('resource exhausted') ||
    message.includes('quota') ||
    message.includes('rate limit') ||
    message.includes('overloaded') ||
    message.includes('unavailable')
  )
}

export async function generateLetterWithGemini(
  draft: LetterDraft & { kind: LetterKind },
): Promise<{ subject: string; lines: string[]; modelUsed: string }> {
  if (!process.env.GEMINI_API_KEY?.trim()) {
    throw new ApiError(503, 'AI_UNAVAILABLE', 'GEMINI_API_KEY is not configured')
  }

  const modelChain = resolveGeminiModelChain()
  if (modelChain.length === 0) {
    throw new ApiError(503, 'AI_UNAVAILABLE', 'No Gemini models configured')
  }

  const ai = new GoogleGenAI({})

  const structure = geminiLetterStructureInstructions(draft.kind)
  const english = draft.outputLanguage === 'en'

  const intro = english
    ? `You are an assistant that writes formal professional letters in English (cover letters / business correspondence) suitable for print/PDF.`
    : `You are an assistant that writes formal Indonesian letters ("surat dinas/resmi") suitable for print/PDF.`

  const globalLanguageRule = english
    ? `- Language: English — formal business writing. Mirror tone ${draft.tone}: formal=polished neutral professional English; tegas=firm and direct yet courteous; persuasif=persuasive and confident while respectful.`
    : `- Language: Indonesian formal ("Bahasa Indonesia baku") matching tone ${draft.tone}.`

  const linesConventions = english
    ? `Lines array conventions (critical for layout — mirror the Indonesian blueprint in English):
- Use "" between logical blocks (after date line, after recipient block, after subject line inside lines, before main body opening).
- Element 1: single line "[City], [full English date]" (example: Jakarta, May 4, 2026). City from draft context or default "${LETTER_HEADER_CITY_DEFAULT}" when unknown.
- Recipient block: either ONE string with lines separated by \\n, e.g.:
  To
  Hiring Manager / Human Resources
  [company name]
  [City or location line if appropriate]
  OR separate entries split with "".
- After recipient block, include a line "Subject: [concise English subject matching the JSON subject field]" (own element), then "".
- Include standalone line "Dear Sir or Madam," or "Dear Hiring Manager," (choose what fits the draft) before the main body (own element), then "" then opening paragraph.
- Closing: separate entries for closing paragraph(s), then exactly one line "Sincerely," (own element), then draft.fullName alone on the final element.`
    : `Lines array conventions (critical for layout):
- Use "" between logical blocks (after tanggal, after blok alamat, after Perihal, before penutup).
- Element 1: single line "[Kota], [tanggal dalam bahasa Indonesia]" (example: Jakarta, 4 Mei 2026).
- Recipient block: either ONE string with lines separated by \\n matching:
  Kepada Yth.
  [jabatan penerima]
  [nama instansi]
  Di tempat
  OR equivalent entries separated by "" — never omit "Di tempat" unless draft explicitly differs.
- Include standalone line "Dengan hormat," before isi utama (own element).
- Closing: separate entries for penutup paragraph(s), then "Hormat saya,", then draft.fullName alone.`

  const structureNote = english
    ? '\n\nThe blueprint below is written in Indonesian for section logic — when outputLanguage is English, render salutations, headings, and labels in natural English equivalents while keeping the same section order and blank-line rhythm.'
    : ''

  const lamaranLayoutRules =
    draft.kind === 'lamaran'
      ? english
        ? `

Cover letter (lamaran) layout — mandatory:
- After "Dear …," use "" then a line like "I, the undersigned:" then "" then an identity block (one label per lines[] element). Include a line ONLY if data exists in draft JSON:
  - "Name: " + draft.fullName
  - If draft.lamaran.birthPlaceDate is non-empty: "Place and date of birth: " + that value
  - If draft.lamaran.phone is non-empty: "Phone: " + that value
  - If draft.lamaran.includeEmailInLetter is true AND draft.lamaran.email is non-empty: "Email: " + that email
- After the identity block, "" then at least THREE separate body paragraphs; use "" between paragraphs (empty array elements) so layout/PDF spacing is clear.
- Paragraph 1: intent to apply (position & company from draft).
- Paragraph 2: education and competencies from draft.lamaran.education and draft.lamaran.skills only.
- Paragraph 3: polite closing (thanks, interview hope; mention CV/enclosure only if appropriate).
- Then "" then one short formal thank-you sentence before the signature block.
- Do NOT output the entire body as a single long paragraph.
- JSON "subject" must be exactly: Job Application (no name or job title in this field).`
        : `

Aturan khusus surat lamaran (wajib):
- Setelah "Dengan hormat," gunakan "" lalu baris "Saya yang bertanda tangan di bawah ini:" lalu "" lalu blok identitas (satu label per elemen lines). Sertakan baris HANYA jika datanya ada di JSON:
  - "Nama: " diikuti draft.fullName
  - Jika draft.lamaran.birthPlaceDate tidak kosong: "Tempat, Tanggal Lahir: " + nilai tersebut
  - Jika draft.lamaran.phone tidak kosong: "Nomor Telepon: " + nilai tersebut
  - Jika draft.lamaran.includeEmailInLetter bernilai true DAN draft.lamaran.email tidak kosong: "Email: " + email tersebut
- Setelah blok identitas, "" lalu isi minimal TIGA paragraf terpisah; WAJIB sisipkan "" antarparagraf agar tampilan PDF/print rapi.
- Paragraf 1: maksud melamar (posisi & perusahaan).
- Paragraf 2: pendidikan & kompetensi dari draft.lamaran.education dan draft.lamaran.skills (tanpa fakta baru).
- Paragraf 3: penutup (harapan, terima kasih; boleh menyebut lamiran/CV bila wajar).
- Lalu "" lalu satu kalimat penutup formal (mis. ucapan terima kasih atas perhatian) sebelum "Hormat saya,".
- Dilarang menyatukan seluruh isi menjadi satu paragraf panjang tunggal.
- Field JSON "subject" harus persis: Surat Lamaran Kerja (tanpa nama, tanpa jabatan, tanpa tambahan setelahnya).`
      : ''

  const resignLayoutRules =
    draft.kind === 'resign'
      ? english
        ? `

Resignation letter layout — mandatory (mirror job-application letter rhythm):
- After "Dear …," use "" then "I, the undersigned:" then "" then these identity lines (one per lines[] element), all required:
  - "Name: " + draft.fullName
  - "Position: " + draft.resign.position
  - "Company: " + draft.resign.company
- Do NOT include any Email: line or any email address in the letter body.
- After the identity block, "" then at least TWO separate body paragraphs with "" between them: notice of resignation with effective date from draft.resign.effectiveDate; if draft.resign.reason is non-empty, a separate polite paragraph for the reason; then transition/handover; then thanks.
- Then "" then one short formal sentence before "Sincerely," / name.
- Do NOT merge identity and body into one long paragraph.
- JSON "subject" must be exactly: Letter of Resignation (no name in this field).`
        : `

Aturan khusus surat pengunduran diri (wajib, selaras surat lamaran):
- Setelah "Dengan hormat," gunakan "" lalu "Saya yang bertanda tangan di bawah ini:" lalu "" lalu blok identitas (satu label per elemen lines), wajib:
  - "Nama: " + draft.fullName
  - "Jabatan: " + draft.resign.position
  - "Perusahaan: " + draft.resign.company
- Dilarang mencantumkan email, baris "Email:", atau alamat surel apa pun dalam surat ini.
- Setelah blok identitas, "" lalu isi dalam beberapa paragraf terpisah; WAJIB sisipkan "" antarparagraf: pengunduran diri dan tanggal efektif (draft.resign.effectiveDate); jika draft.resign.reason tidak kosong, paragraf terpisah untuk alasan singkat; komitmen transisi/penyerahan tugas; ucapan terima kasih.
- Lalu "" lalu satu kalimat penutup formal sebelum "Hormat saya,".
- Dilarang menyatukan identitas dan isi utama dalam satu paragraf panjang.
- Field JSON "subject" harus persis: Surat Pengunduran Diri (tanpa nama atau tambahan lain).`
      : ''

  const izinLayoutRules =
    draft.kind === 'izin'
      ? english
        ? `

Leave / absence letter — keep SHORT and courteous (not an argumentative essay):
- Use draft.izin: leaveType as a clear leave category in prose; recipientName plus institution in the recipient block; explicit date range from dateFrom–dateTo in the letter language; brief reason only; optional employeeId after identity; optional additionalDetails; if hasAttachment, one short sentence using attachmentNote when provided.
- draft.tone sets warmth vs firmness; remain respectful.
- JSON "subject" must be exactly: Leave of Absence (no personal names, institution names, or extra wording in this field).`
        : `

Surat izin / dispensasi — ringkas & sopan (bukan esai panjang):
- Pakai draft.izin: leaveType sebagai jenis izin dalam kalimat; recipientName + institution di blok alamat; rentang dateFrom–dateTo tertulis jelas dalam bahasa Indonesia; alasan singkat; opsional employeeId setelah identitas; opsional additionalDetails; jika hasAttachment, satu kalimat singkat memakai attachmentNote bila ada.
- draft.tone mengatur kehangatan vs ketegasan; tetap hormat.
- Field JSON "subject" harus persis: Surat Izin (tanpa nama orang, instansi, atau tambahan lain pada field ini).`
      : ''

  const pengaduanLayoutRules =
    draft.kind === 'pengaduan'
      ? english
        ? `

Complaint letter — mandatory:
- Use draft.pengaduan fields per blueprint: identity + optional contact lines, institution and optional divisionOrBranch, problemCategory label in prose, chronological narrative from issue, optional impact, optional evidence (transactionOrCustomerId, incidentDate), clear remedy from desiredOutcome (+ desiredOutcomeOther when outcome is "lainnya") + optional resolution note, escalation when priorContact is "ya" with priorContactResponse.
- Firmness scales with draft.pengaduan.urgency without abuse; tone follows draft.tone.
- Separate paragraphs with "" in lines[]; never one unstructured wall of text.
- JSON "subject" must be exactly: Complaint Letter (no complainant name, institution name, or extra wording in this field).`
        : `

Surat pengaduan — wajib:
- Pakai seluruh field draft.pengaduan sesuai blueprint: identitas + kontak bila ada, instansi + divisi bila ada, jenis masalah (problemCategory) dalam kalimat, kronologi (issue), dampak (impact) bila diisi, bukti (transactionOrCustomerId / incidentDate) bila diisi, harapan penyelesaian konkret dari desiredOutcome (+ desiredOutcomeOther jika outcome "lainnya") + resolution tambahan bila ada, eskalasi jika priorContact "ya" dengan priorContactResponse.
- Ketegasan mengikuti urgency (normal / mendesak / sangat_mendesak) tanpa menghina; nada mengikuti draft.tone.
- Pisahkan paragraf dengan "" pada lines[]; dilarang satu blok panjang tanpa struktur.
- Field JSON "subject" harus persis: Surat Pengaduan (tanpa nama pengadu, nama instansi, atau tambahan lain pada field ini).`
      : ''

  const prompt = `${intro}

Global rules:
${globalLanguageRule}
- Use ONLY facts implied by the draft JSON; do not invent employers, dates, institutions, or numbers not present or reasonably inferred (city default "${LETTER_HEADER_CITY_DEFAULT}" only when institution location is unknown).
- Output STRICT JSON only: {"subject":"...","lines":["..."]}

${linesConventions}

Structure for this letter kind:
${structure}${structureNote}
${lamaranLayoutRules}
${resignLayoutRules}
${izinLayoutRules}
${pengaduanLayoutRules}

Draft JSON:
${JSON.stringify(draft)}`

  let rawText: string | undefined
  let modelUsed = modelChain[0]

  for (let index = 0; index < modelChain.length; index++) {
    const modelId = modelChain[index]
    modelUsed = modelId
    try {
      const response = await ai.models.generateContent({
        model: modelId,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      })
      const text = response.text
      if (text === undefined || text === '') {
        throw new ApiError(502, 'AI_FAILURE', 'Gemini returned empty output')
      }
      rawText = text
      break
    } catch (error) {
      if (error instanceof ApiError) throw error
      const hasNext = index < modelChain.length - 1
      if (hasNext && shouldTryNextGeminiModel(error)) continue
      throw new ApiError(502, 'AI_FAILURE', 'Gemini request failed')
    }
  }

  if (!rawText) {
    throw new ApiError(502, 'AI_FAILURE', 'Gemini request failed')
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(stripJsonFence(rawText))
  } catch {
    throw new ApiError(502, 'AI_PARSE_ERROR', 'Gemini returned non-JSON output')
  }

  const parsedShape = geminiLetterSchema.safeParse(parsed)
  if (!parsedShape.success) {
    throw new ApiError(502, 'AI_SHAPE_ERROR', 'Gemini JSON did not match expected shape')
  }

  return { ...parsedShape.data, modelUsed }
}
