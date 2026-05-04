import { Fragment } from 'react'

import { cn } from '@/lib/utils'

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

function segmentByBlankLines(flat: string[]): string[][] {
  const segments: string[][] = []
  let current: string[] = []
  for (const line of flat) {
    if (!line.trim()) {
      if (current.length) {
        segments.push(current)
        current = []
      }
    } else {
      current.push(line)
    }
  }
  if (current.length) segments.push(current)
  return segments
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

function geminiBodySegments(originalLines: string[]): string[][] {
  const out: string[][] = []
  for (const cell of originalLines) {
    if (cell === '') continue
    const cellLines = cell.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    if (!cellLines.length) continue
    if (cellLines.some((l) => lineStartsClosingLead(l))) break
    out.push(cellLines)
  }
  return out
}

function extractClosingLines(originalLines: string[]): string[] {
  const out: string[] = []
  let seen = false
  for (const cell of originalLines) {
    const parts = cell.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    for (const line of parts) {
      if (lineStartsClosingLead(line)) seen = true
      if (seen) out.push(line)
    }
  }
  return out
}

function looksLikeDateLine(s: string): boolean {
  const t = s.trim()
  // Hanya tanggal (preview lama)
  if (/^\d{1,2}\s+\p{L}+(?:\s+\p{L}+)*\s+\d{4}$/u.test(t)) return true
  // "Jakarta, 4 Mei 2026" — kop surat Indonesia
  // Catatan: jangan pakai \' di dalam [...] — di JS itu escape regex tidak valid.
  return /^[\p{L}\s.'-]+,\s*\d{1,2}\s+\p{L}+(?:\s+\p{L}+)*\s+\d{4}$/u.test(t)
}

function isPerihalSegment(seg: string[]): boolean {
  const first = seg[0]?.trim() ?? ''
  return (
    /^perihal\s*:/i.test(first) ||
    /^hal\s*:/i.test(first) ||
    /^subject\s*:/i.test(first) ||
    /^re\s*:/i.test(first)
  )
}

function isFormalSectionHeading(seg: string[]): boolean {
  const first = seg[0]?.trim() ?? ''
  if (seg.length !== 1) return false
  return /^(uraian\s+masalah|harapan\s+penyelesaian)\s*:?\s*$/i.test(first)
}

interface ParsedLetter {
  bodySegments: string[][]
  closingLines: string[]
}

function parseLetterLines(lines: string[]): ParsedLetter {
  const hasExplicitBreaks = lines.some((l) => l === '')

  if (hasExplicitBreaks) {
    const flat = flattenLetterLines(lines)
    const hIdx = flat.findIndex((l) => lineStartsClosingLead(l))
    const bodyFlat = hIdx >= 0 ? flat.slice(0, hIdx) : flat
    while (bodyFlat.length && bodyFlat[bodyFlat.length - 1] === '') bodyFlat.pop()
    const closingLines =
      hIdx >= 0 ? flat.slice(hIdx).filter((l) => l.trim()) : []
    return {
      bodySegments: segmentByBlankLines(bodyFlat).filter((s) => s.length),
      closingLines,
    }
  }

  return {
    bodySegments: geminiBodySegments(lines),
    closingLines: extractClosingLines(lines),
  }
}

interface LetterPreviewBodyProps {
  lines: string[]
  className?: string
}

function letterLooksEnglish(lines: string[]): boolean {
  const flat = flattenLetterLines(lines)
    .map((l) => l.trim())
    .filter(Boolean)
  return flat.some((l) => /^(subject|re)\s*:/i.test(l))
}

export function LetterPreviewBody({ lines, className }: LetterPreviewBodyProps) {
  const { bodySegments, closingLines } = parseLetterLines(lines)
  const docLang = letterLooksEnglish(lines) ? 'en' : 'id'

  return (
    <div
      className={cn('letter-preview-body font-serif text-[15px] leading-[1.85] text-foreground', className)}
      lang={docLang}
    >
      {bodySegments.map((seg, i) => {
        const first = seg[0]?.trim() ?? ''
        const joined = seg.map((l) => l.trim()).join(' ')

        if (seg.length === 1 && looksLikeDateLine(first)) {
          return (
            <p key={i} className="mb-8 text-right text-[15px] tabular-nums text-foreground/90 print:mb-7">
              {first.trim()}
            </p>
          )
        }

        if (isFormalSectionHeading(seg)) {
          return (
            <p
              key={i}
              className="mb-2 mt-8 text-[14px] font-semibold text-foreground print:mt-6"
            >
              {first}
            </p>
          )
        }

        if (isPerihalSegment(seg)) {
          const inner =
            seg.length === 1 ? (
              first
            ) : (
              <>
                {seg.map((line, j) => (
                  <Fragment key={j}>
                    {j > 0 ? <br /> : null}
                    {line}
                  </Fragment>
                ))}
              </>
            )
          return (
            <p
              key={i}
              className="mb-6 rounded-md border border-border/35 bg-muted/25 px-4 py-3 text-[15px] font-semibold leading-snug text-foreground print:border-border print:bg-transparent print:px-0 print:py-0"
            >
              {inner}
            </p>
          )
        }

        const shortMultiLine = seg.length > 1 && seg.every((l) => l.length <= 58)
        if (shortMultiLine) {
          return (
            <p key={i} className="mb-6 text-[15px] leading-[1.65]">
              {seg.map((line, j) => (
                <Fragment key={j}>
                  {j > 0 ? <br /> : null}
                  {line}
                </Fragment>
              ))}
            </p>
          )
        }

        return (
          <p
            key={i}
            className="mb-5 indent-10 text-justify text-[15px] leading-[1.85] hyphens-auto"
          >
            {joined}
          </p>
        )
      })}

      {closingLines.length > 0 ? (
        <footer className="mt-12 ml-auto max-w-[min(100%,42rem)] border-t border-transparent pt-2 text-right print:mt-10">
          {closingLines.length >= 2 ? (
            <>
              {closingLines.slice(0, -1).map((line, j) => (
                <p key={j} className="text-[15px] leading-relaxed">
                  {line}
                </p>
              ))}
              <p className="mt-14 text-[15px] font-semibold leading-relaxed print:mt-12">
                {closingLines[closingLines.length - 1]}
              </p>
            </>
          ) : (
            <p className="text-[15px] leading-relaxed">{closingLines[0]}</p>
          )}
        </footer>
      ) : null}
    </div>
  )
}
