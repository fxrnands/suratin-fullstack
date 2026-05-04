'use client'

import { Copy, Download, RefreshCw } from 'lucide-react'

import { LetterPreviewBody } from '@/components/letter-builder/letter-preview-body'
import type { LetterKind, LetterOutputLanguage } from '@/components/letter-builder/types'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { halTitleForKind } from '@/lib/letter/letter-presentation'
import { cn } from '@/lib/utils'

interface PreviewLetterPanelProps {
  generating: boolean
  pdfDownloading?: boolean
  /** Blob URL from the same PDF pipeline as download; screen preview. */
  pdfPreviewUrl: string | null
  pdfPreviewLoading?: boolean
  subject: string | null
  lines: string[] | null
  letterKind?: LetterKind | null
  outputLanguage?: LetterOutputLanguage
  onCopy: () => void
  onDownloadPdf: () => void | Promise<void>
  onRegenerate: () => void
  showChrome?: boolean
  /** Unique anchor for print / Save as PDF from browser — HTML mirror hidden on screen when PDF iframe shows. */
  printAnchor?: boolean
  className?: string
}

export function PreviewLetterPanel({
  generating,
  pdfDownloading = false,
  pdfPreviewUrl,
  pdfPreviewLoading = false,
  subject,
  lines,
  letterKind = null,
  outputLanguage = 'id',
  onCopy,
  onDownloadPdf,
  onRegenerate,
  showChrome = true,
  printAnchor = false,
  className,
}: PreviewLetterPanelProps) {
  const halLine =
    subject !== null && subject !== ''
      ? halTitleForKind(letterKind ?? undefined, subject, outputLanguage)
      : null
  const hasLetter = Boolean(lines?.length)
  const showPdfFrame = Boolean(pdfPreviewUrl)
  const showHtmlFallback = hasLetter && !pdfPreviewLoading && !showPdfFrame

  return (
    <div
      className={cn(
        'flex min-h-0 flex-col rounded-xl border border-border/70 bg-card shadow-sm print:border-0 print:bg-transparent print:shadow-none',
        className,
      )}
    >
      {showChrome ? (
        <header className="shrink-0 border-b border-border/60 px-5 py-4 print:hidden">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">Preview Surat</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {generating
              ? 'AI sedang menyusun surat Anda…'
              : hasLetter
                ? showPdfFrame
                  ? 'Tampilan memakai PDF yang sama dengan tombol unduh.'
                  : pdfPreviewLoading
                    ? 'Menyiapkan pratinjau PDF…'
                    : 'Periksa kembali sebelum dikirim atau dicetak.'
                : 'Surat Anda akan tampil di sini setelah dihasilkan.'}
          </p>
        </header>
      ) : null}

      <div
        className={cn(
          'flex flex-1 flex-col px-5 py-6 lg:min-h-0 print:min-h-0 print:overflow-visible print:p-0',
          /* Satu area scroll: isi mengikuti tinggi panel; iframe PDF yang menggulir, bukan wadah luar. */
          showPdfFrame && hasLetter && !generating
            ? 'min-h-0 overflow-hidden'
            : 'min-h-[200px] overflow-y-auto',
        )}
      >
        {generating ? (
          <PreviewSkeleton />
        ) : !hasLetter ? (
          <div className="flex w-full flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border/70 bg-secondary/15 px-6 py-10 text-center lg:min-h-0 print:hidden">
            <p className="font-serif text-sm italic leading-relaxed text-muted-foreground">
              Surat Anda akan muncul di sini…
            </p>
            <p className="mt-3 max-w-xs text-xs text-muted-foreground">
              Isi formulir di kiri, lalu klik tombol <span className="font-medium text-foreground">Buat Surat</span>.
            </p>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col gap-3">
            {pdfPreviewLoading ? (
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border/60 bg-muted/20 py-8 print:hidden">
                <Spinner className="size-8 text-primary" />
                <p className="text-sm text-muted-foreground">Memuat pratinjau PDF…</p>
              </div>
            ) : null}

            {showPdfFrame ? (
              <iframe
                title="Pratinjau PDF surat"
                src={pdfPreviewUrl ?? undefined}
                className="min-h-0 w-full flex-1 basis-0 rounded-md border border-border bg-muted/20 print:hidden"
              />
            ) : null}

            {showHtmlFallback ? (
              <p className="text-center text-xs text-muted-foreground print:hidden">
                Pratinjau PDF membutuhkan nama lengkap (minimal 2 karakter) di formulir. Menampilkan teks sementara
                di bawah.
              </p>
            ) : null}

            <article
              id={printAnchor ? 'letter-print-root' : undefined}
              className={cn(
                'mx-auto max-w-[72ch] rounded-lg border border-border/40 bg-[#fdfcfa] p-4 shadow-inner ring-1 ring-black/3 print:border-0 print:bg-white print:px-0 print:py-0 print:shadow-none print:ring-0',
                printAnchor && 'letter-print-body',
                (showPdfFrame || pdfPreviewLoading) && 'hidden print:block',
              )}
            >
              {halLine ? (
                <header className="mb-9 border-b border-border/50 pb-5 print:mb-8 print:pb-4">
                  <p className="font-serif text-[15px] font-semibold tracking-tight text-foreground print:text-[14pt]">
                    Hal: {halLine}
                  </p>
                </header>
              ) : null}
              <LetterPreviewBody lines={lines ?? []} />
            </article>
          </div>
        )}
      </div>

      <footer className="flex shrink-0 flex-wrap gap-2 border-t border-border/60 px-5 py-4 print:hidden">
        <Button type="button" variant="outline" size="sm" disabled={!hasLetter || generating} onClick={onCopy}>
          <Copy />
          Salin Teks
        </Button>
        <Button type="button" variant="outline" size="sm" disabled={!hasLetter || generating} onClick={onRegenerate}>
          <RefreshCw />
          Buat Ulang
        </Button>
        <Button
          type="button"
          size="sm"
          className="ml-auto sm:ml-0"
          disabled={!hasLetter || generating || pdfDownloading}
          onClick={() => void onDownloadPdf()}
        >
          {pdfDownloading ? <Spinner className="size-4" /> : <Download />}
          {pdfDownloading ? 'Menyiapkan PDF…' : 'Unduh PDF'}
        </Button>
      </footer>
    </div>
  )
}

function PreviewSkeleton() {
  return (
    <div className="flex min-h-[200px] flex-1 flex-col space-y-4 rounded-lg border border-border/40 bg-secondary/10 p-6 lg:min-h-0 print:hidden">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner className="size-5 text-primary" />
        AI sedang menyusun surat Anda…
      </div>
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-3 animate-pulse rounded bg-muted',
              index % 4 === 0 ? 'w-[94%]' : index % 4 === 2 ? 'w-[88%]' : 'w-full',
            )}
          />
        ))}
      </div>
    </div>
  )
}
