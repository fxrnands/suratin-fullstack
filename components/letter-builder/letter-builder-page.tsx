'use client'

import { DynamicLetterFields } from '@/components/letter-builder/dynamic-letter-fields'
import { LetterTypePicker } from '@/components/letter-builder/letter-type-picker'
import { PreviewLetterPanel } from '@/components/letter-builder/preview-panel'
import type { LetterKind } from '@/components/letter-builder/types'
import { useLetterBuilder } from '@/components/letter-builder/use-letter-builder'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

interface LetterBuilderPageProps {
  initialKind?: LetterKind
}

export function LetterBuilderPage({ initialKind }: LetterBuilderPageProps) {
  const {
    draft,
    setDraft,
    toneProUnlocked,
    generating,
    pdfDownloading,
    pdfPreviewUrl,
    pdfPreviewLoading,
    generated,
    complete,
    runGenerate,
    handleCopy,
    handleDownloadPdf,
    handleKindChange,
  } = useLetterBuilder({ initialKind })

  const previewProps = {
    generating,
    pdfDownloading,
    pdfPreviewUrl,
    pdfPreviewLoading,
    subject: generated?.subject ?? null,
    lines: generated?.lines ?? null,
    letterKind: draft.kind,
    outputLanguage: draft.outputLanguage,
    onCopy: handleCopy,
    onDownloadPdf: handleDownloadPdf,
    onRegenerate: runGenerate,
  }

  return (
    <div className="letter-builder-print flex min-h-dvh flex-col bg-background text-foreground">
      <main className="flex min-h-0 flex-1 flex-col bg-secondary/25 print:bg-white">
        <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 py-8 pb-32 lg:max-w-[1200px] lg:px-10 lg:py-8 lg:pb-24 xl:max-w-[1280px] print:max-w-none print:px-6 print:py-4 print:pb-6">
          <div className="grid min-h-0 flex-1 gap-10 lg:grid-cols-2 lg:items-stretch lg:gap-12 xl:gap-14 print:grid-cols-1 print:gap-0">
            <div className="flex min-w-0 flex-col gap-10 print:hidden">
          <LetterTypePicker value={draft.kind} onChange={handleKindChange} />

          <section className="space-y-4 rounded-xl border border-border/60 bg-card/40 p-6 shadow-sm">
            <div>
              <h2 className="text-base font-semibold capitalize text-foreground">2. detail surat</h2>
              <p className="mt-1 text-sm capitalize text-muted-foreground">
                Lengkapi kolom sesuai konteks—otomatis tersimpan di perangkat Anda.
              </p>
            </div>
            <DynamicLetterFields
              kind={draft.kind}
              draft={draft}
              setDraft={setDraft}
              toneProUnlocked={toneProUnlocked}
            />
          </section>

          <Button
            type="button"
            size="lg"
            className="hidden w-full lg:flex"
            disabled={!complete || generating}
            onClick={runGenerate}
          >
            {generating ? (
              <>
                <Spinner className="size-5" />
                Menghasilkan…
              </>
            ) : (
              'Buat Surat'
            )}
          </Button>
            </div>

            <div className="flex min-h-0 min-w-0 flex-col gap-6 lg:sticky lg:top-28 lg:h-full lg:w-full lg:max-h-[calc(100dvh-8rem)] print:static print:max-h-none">
          <details className="group rounded-xl border border-border/70 bg-card shadow-sm lg:hidden print:hidden">
            <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                Preview Surat
                <span className="text-xs font-normal text-muted-foreground group-open:hidden">Buka</span>
                <span className="hidden text-xs font-normal text-muted-foreground group-open:inline">Tutup</span>
              </span>
            </summary>
            <div className="flex max-h-[min(85dvh,900px)] min-h-0 flex-col border-t border-border/60 px-4 pb-4 pt-4">
              <PreviewLetterPanel
                {...previewProps}
                showChrome={false}
                className="flex min-h-0 flex-1 flex-col rounded-none border-0 bg-transparent shadow-none"
              />
            </div>
          </details>

              <div className="hidden min-h-0 flex-1 flex-col lg:flex print:flex print:flex-col print:max-h-none print:overflow-visible">
                <PreviewLetterPanel
                  {...previewProps}
                  printAnchor
                  className="flex h-full min-h-0 flex-1 flex-col overflow-hidden shadow-md print:h-auto print:min-h-0 print:flex-none print:overflow-visible"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-md lg:hidden print:hidden">
        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={!complete || generating}
          onClick={runGenerate}
        >
          {generating ? (
            <>
              <Spinner className="size-5" />
              Menghasilkan…
            </>
          ) : (
            'Buat Surat'
          )}
        </Button>
      </div>
    </div>
  )
}
