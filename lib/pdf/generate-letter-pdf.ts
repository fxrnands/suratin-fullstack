import { PDFDocument, PageSizes, StandardFonts, rgb, type PDFPage, type PDFFont, type RGB } from 'pdf-lib'

import type { LetterKind } from '@/components/letter-builder/types'
import {
  halTitleForKind,
  looksLikeLetterDateLine,
  replaceFirstDateInFlatLines,
} from '@/lib/letter/letter-presentation'
import type { LetterOutputLocale } from '@/lib/letter/indonesian-templates'

/** ~25 mm — surat dinas Indonesia biasanya margin tidak sempit */
const MARGIN_PT = 72
const BODY_PT = 11.5
const SUBJECT_PT = 12.5
const LINE_STEP = 15.5
/** Jarak antar chunk teks pendek / meta */
const PARAGRAPH_GAP_PT = 10
/** Jarak setelah paragraf isi (justify / body) */
const BODY_CHUNK_GAP_PT = 16
/** Jarak ekstra setelah blok Perihal / meta */
const META_BLOCK_TAIL_PT = 8
/** Ruang sebelum blok penutup kanan (paragraf terakhir → Hormat saya) */
const CLOSING_TOP_PAD_PT = 64
/** Ruang setelah "Hormat saya," / setara — area tanda tangan */
const AFTER_CLOSING_LEAD_PT = 56
const AFTER_CLOSING_OTHER_LINE_PT = 10
const TEXT_COLOR = rgb(0.06, 0.06, 0.06)

function flattenLetterLines(lines: string[]): string[] {
  const out: string[] = []
  for (const cell of lines) {
    if (cell === '') {
      out.push('')
      continue
    }
    const parts = cell.split(/\r?\n/)
    for (const p of parts) {
      out.push(p)
    }
  }
  return out
}

function lineStartsClosingLead(line: string): boolean {
  const t = line.trim().toLowerCase()
  return (
    t.startsWith('hormat saya') ||
    t.startsWith('sincerely') ||
    t.startsWith('yours sincerely') ||
    t.startsWith('yours faithfully') ||
    t.startsWith('best regards') ||
    t.startsWith('respectfully,')
  )
}

function isPerihalLine(s: string): boolean {
  const t = s.trim()
  return (
    /^perihal\s*:/i.test(t) ||
    /^hal\s*:/i.test(t) ||
    /^subject\s*:/i.test(t) ||
    /^re\s*:/i.test(t)
  )
}

function isSalutationLine(s: string): boolean {
  const t = s.trim().toLowerCase()
  return t.startsWith('dengan hormat') || t.startsWith('dear ')
}

function splitFlatIntoChunks(flat: string[]): string[][] {
  const chunks: string[][] = []
  let current: string[] = []
  for (const line of flat) {
    if (!line.trim()) {
      if (current.length) {
        chunks.push(current)
        current = []
      }
    } else {
      current.push(line)
    }
  }
  if (current.length) chunks.push(current)
  return chunks
}

function findClosingChunkIndex(chunks: string[][]): number {
  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i].some((l) => lineStartsClosingLead(l))) return i
  }
  return -1
}

function wrapTextLine(text: string, maxWidth: number, font: PDFFont, fontSize: number): string[] {
  const trimmed = text.trim()
  if (!trimmed) return []

  const words = trimmed.split(/\s+/).filter(Boolean)
  const result: string[] = []
  let current = ''

  const flush = () => {
    if (current) {
      result.push(current)
      current = ''
    }
  }

  for (const word of words) {
    const trial = current ? `${current} ${word}` : word
    if (font.widthOfTextAtSize(trial, fontSize) <= maxWidth) {
      current = trial
      continue
    }

    flush()

    if (font.widthOfTextAtSize(word, fontSize) <= maxWidth) {
      current = word
      continue
    }

    let chunk = ''
    for (const ch of word) {
      const next = chunk + ch
      if (font.widthOfTextAtSize(next, fontSize) <= maxWidth) {
        chunk = next
      } else {
        if (chunk) result.push(chunk)
        chunk = ch
      }
    }
    current = chunk
  }

  flush()
  return result.length ? result : ['']
}

function packWordsIntoLines(words: string[], maxWidth: number, font: PDFFont, fontSize: number): string[][] {
  const lines: string[][] = []
  let current: string[] = []
  let lineWidth = 0
  const spaceW = font.widthOfTextAtSize(' ', fontSize)

  const flush = () => {
    if (current.length) {
      lines.push(current)
      current = []
      lineWidth = 0
    }
  }

  for (const word of words) {
    const wW = font.widthOfTextAtSize(word, fontSize)
    const add = current.length ? spaceW + wW : wW
    if (lineWidth + add <= maxWidth) {
      current.push(word)
      lineWidth += add
    } else {
      flush()
      if (font.widthOfTextAtSize(word, fontSize) <= maxWidth) {
        current = [word]
        lineWidth = wW
      } else {
        let chunk = ''
        for (const ch of word) {
          const next = chunk + ch
          if (font.widthOfTextAtSize(next, fontSize) <= maxWidth) {
            chunk = next
          } else {
            if (chunk) {
              lines.push([chunk])
              chunk = ch
            } else {
              lines.push([ch])
            }
          }
        }
        if (chunk) {
          current = [chunk]
          lineWidth = font.widthOfTextAtSize(chunk, fontSize)
        }
      }
    }
  }
  flush()
  return lines
}

function drawJustifiedWordsLine(
  page: PDFPage,
  words: string[],
  xLeft: number,
  y: number,
  maxWidth: number,
  font: PDFFont,
  fontSize: number,
  color: RGB,
) {
  if (words.length === 0) return
  if (words.length === 1) {
    page.drawText(words[0], { x: xLeft, y, size: fontSize, font, color })
    return
  }
  const spaceW = font.widthOfTextAtSize(' ', fontSize)
  const wordWidths = words.map((w) => font.widthOfTextAtSize(w, fontSize))
  const natural =
    wordWidths.reduce((a, b) => a + b, 0) + spaceW * (words.length - 1)
  const extra = maxWidth - natural
  const gaps = words.length - 1
  const addPerGap = gaps > 0 ? extra / gaps : 0
  let x = xLeft
  for (let i = 0; i < words.length; i++) {
    page.drawText(words[i], { x, y, size: fontSize, font, color })
    x += wordWidths[i]
    if (i < words.length - 1) x += spaceW + addPerGap
  }
}

interface PdfCursor {
  page: PDFPage
  pageWidth: number
  pageHeight: number
  y: number
  margin: number
}

function ensureSpace(cursor: PdfCursor, minY: number, addPage: () => void) {
  if (cursor.y < minY) addPage()
}

export async function generateLetterPdfBytes(input: {
  kind: LetterKind
  subject: string
  lines: string[]
  outputLanguage?: LetterOutputLocale
}): Promise<Uint8Array> {
  const lang: LetterOutputLocale = input.outputLanguage ?? 'id'
  const halTitle = halTitleForKind(input.kind, input.subject, lang)
  const pdfDoc = await PDFDocument.create()
  const fontRegular = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

  let page = pdfDoc.addPage(PageSizes.A4)
  const pageWidth = page.getWidth()
  const pageHeight = page.getHeight()
  const maxTextWidth = pageWidth - MARGIN_PT * 2

  const cursor: PdfCursor = {
    page,
    pageWidth,
    pageHeight,
    y: pageHeight - MARGIN_PT - 8,
    margin: MARGIN_PT,
  }

  const addPage = () => {
    page = pdfDoc.addPage(PageSizes.A4)
    cursor.page = page
    cursor.pageWidth = page.getWidth()
    cursor.pageHeight = page.getHeight()
    cursor.y = cursor.pageHeight - MARGIN_PT - 8
  }

  const drawWrappedLeft = (raw: string, size: number, bold: boolean, gapAfter = PARAGRAPH_GAP_PT) => {
    const f = bold ? fontBold : fontRegular
    const wrapped = wrapTextLine(raw, maxTextWidth, f, size)
    for (const wl of wrapped) {
      ensureSpace(cursor, MARGIN_PT + LINE_STEP, addPage)
      cursor.page.drawText(wl, {
        x: cursor.margin,
        y: cursor.y,
        size,
        font: f,
        color: TEXT_COLOR,
      })
      cursor.y -= LINE_STEP
    }
    cursor.y -= gapAfter
  }

  const drawWrappedRight = (raw: string, size: number, bold: boolean, gapAfter = PARAGRAPH_GAP_PT) => {
    const f = bold ? fontBold : fontRegular
    const wrapped = wrapTextLine(raw, maxTextWidth, f, size)
    for (const wl of wrapped) {
      ensureSpace(cursor, MARGIN_PT + LINE_STEP, addPage)
      const w = f.widthOfTextAtSize(wl, size)
      cursor.page.drawText(wl, {
        x: cursor.pageWidth - cursor.margin - w,
        y: cursor.y,
        size,
        font: f,
        color: TEXT_COLOR,
      })
      cursor.y -= LINE_STEP
    }
    cursor.y -= gapAfter
  }

  const drawJustifiedBodyParagraph = (paragraph: string, gapAfter = PARAGRAPH_GAP_PT) => {
    const words = paragraph.trim().split(/\s+/).filter(Boolean)
    if (!words.length) return

    const lines = packWordsIntoLines(words, maxTextWidth, fontRegular, BODY_PT)

    for (let li = 0; li < lines.length; li++) {
      const lineWords = lines[li]
      const isLast = li === lines.length - 1

      if (isLast || lineWords.length <= 1) {
        const textLine = lineWords.join(' ')
        const sublines = wrapTextLine(textLine, maxTextWidth, fontRegular, BODY_PT)
        for (const sub of sublines) {
          ensureSpace(cursor, MARGIN_PT + LINE_STEP, addPage)
          cursor.page.drawText(sub, {
            x: cursor.margin,
            y: cursor.y,
            size: BODY_PT,
            font: fontRegular,
            color: TEXT_COLOR,
          })
          cursor.y -= LINE_STEP
        }
      } else {
        ensureSpace(cursor, MARGIN_PT + LINE_STEP, addPage)
        drawJustifiedWordsLine(
          cursor.page,
          lineWords,
          cursor.margin,
          cursor.y,
          maxTextWidth,
          fontRegular,
          BODY_PT,
          TEXT_COLOR,
        )
        cursor.y -= LINE_STEP
      }
    }
    cursor.y -= gapAfter
  }

  drawWrappedLeft(`Hal: ${halTitle}`, SUBJECT_PT, true, PARAGRAPH_GAP_PT + 2)

  const flatRaw = flattenLetterLines(input.lines)
  const flat = replaceFirstDateInFlatLines(flatRaw, lang)
  const chunks = splitFlatIntoChunks(flat)
  const closeIdx = findClosingChunkIndex(chunks)

  const processPreClosing = (slice: string[][]) => {
    for (const chunk of slice) {
      if (!chunk.length) continue
      const first = chunk[0].trim()
      const joined = chunk.map((l) => l.trim()).join(' ')

      if (chunk.length === 1 && looksLikeLetterDateLine(first)) {
        drawWrappedRight(chunk[0], BODY_PT, false)
        continue
      }

      if (chunk.some((l) => isPerihalLine(l))) {
        for (const line of chunk) {
          drawWrappedLeft(line, BODY_PT, true, 2)
        }
        cursor.y -= META_BLOCK_TAIL_PT
        continue
      }

      const allShort = chunk.every((l) => l.trim().length < 56)
      const fewLines = chunk.length <= 6
      const looksMeta =
        /^nama\s*:/i.test(first) ||
        /^jabatan\s*:/i.test(first) ||
        /^perusahaan\s*:/i.test(first) ||
        /^yang\s+bertanda\s+tangan/i.test(first) ||
        /^saya\s+yang\s+bertanda/i.test(first) ||
        /^tempat,?\s*tanggal\s+lahir\s*:/i.test(first) ||
        /^nomor\s*telepon\s*:/i.test(first) ||
        /^no\.?\s*hp\s*:/i.test(first) ||
        /^no\.?\s*telepon\s*:/i.test(first) ||
        /^email\s*:/i.test(first)

      const t0 = chunk[0].trim()
      if ((allShort && fewLines) || t0.startsWith('Kepada') || t0.startsWith('To') || looksMeta) {
        for (const line of chunk) {
          drawWrappedLeft(line, BODY_PT, false, 1)
        }
        cursor.y -= META_BLOCK_TAIL_PT
        continue
      }

      if (isSalutationLine(first)) {
        drawWrappedLeft(joined, BODY_PT, false, PARAGRAPH_GAP_PT)
        continue
      }

      if (joined.length > 70) {
        drawJustifiedBodyParagraph(joined, BODY_CHUNK_GAP_PT)
      } else {
        drawWrappedLeft(joined, BODY_PT, false, BODY_CHUNK_GAP_PT)
      }
    }
  }

  const processClosing = (slice: string[][]) => {
    cursor.y -= CLOSING_TOP_PAD_PT
    for (const chunk of slice) {
      for (const line of chunk) {
        const gap = lineStartsClosingLead(line) ? AFTER_CLOSING_LEAD_PT : AFTER_CLOSING_OTHER_LINE_PT
        drawWrappedRight(line, BODY_PT, false, gap)
      }
      cursor.y -= 8
    }
  }

  if (closeIdx >= 0) {
    processPreClosing(chunks.slice(0, closeIdx))
    processClosing(chunks.slice(closeIdx))
  } else {
    processPreClosing(chunks)
  }

  return pdfDoc.save()
}
