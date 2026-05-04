'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { useAuth } from '@/components/auth/auth-provider'
import { STORAGE_KEY } from '@/components/letter-builder/constants'
import type { GeneratedLetter } from '@/components/letter-builder/generate-letter'
import type { LetterDraft, LetterKind } from '@/components/letter-builder/types'
import { createEmptyDraft, mergeParsedDraft } from '@/components/letter-builder/types'
import { isDraftComplete } from '@/components/letter-builder/validation'
import {
  halTitleForKind,
  removeEmailLabelLinesFromLines,
  replaceFirstDateInLetterLines,
} from '@/lib/letter/letter-presentation'
import { buildLetterPdfFilename } from '@/lib/pdf/letter-pdf-filename'

export interface UseLetterBuilderOptions {
  initialKind?: LetterKind
}

export function useLetterBuilder(options?: UseLetterBuilderOptions) {
  const { accessToken, refreshSession, user } = useAuth()
  const toneProUnlocked = user?.tier === 'pro'
  const appliedInitialKindRef = useRef(false)
  const [hydrated, setHydrated] = useState(false)
  const [draft, setDraft] = useState<LetterDraft>(() => createEmptyDraft())
  const [generated, setGenerated] = useState<GeneratedLetter | null>(null)
  const [generating, setGenerating] = useState(false)
  const [pdfDownloading, setPdfDownloading] = useState(false)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)
  const [pdfPreviewLoading, setPdfPreviewLoading] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setDraft(mergeParsedDraft(JSON.parse(stored)))
    } catch {
      // ignore corrupt draft
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated || appliedInitialKindRef.current) return
    if (!options?.initialKind) return
    setDraft((previous) => ({ ...previous, kind: options.initialKind }))
    appliedInitialKindRef.current = true
  }, [hydrated, options?.initialKind])

  useEffect(() => {
    if (!hydrated) return
    const timer = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft))
    }, 400)
    return () => window.clearTimeout(timer)
  }, [draft, hydrated])

  useEffect(() => {
    if (!hydrated || !user) return
    if (user.tier === 'pro') return
    setDraft((previous) => {
      const toneOk = previous.tone === 'formal'
      const langOk = previous.outputLanguage === 'id'
      if (toneOk && langOk) return previous
      return {
        ...previous,
        ...(!toneOk ? { tone: 'formal' as const } : {}),
        ...(!langOk ? { outputLanguage: 'id' as const } : {}),
      }
    })
  }, [hydrated, user])

  useEffect(() => {
    let cancelled = false

    if (!generated?.subject || !generated.lines?.length || !draft.kind) {
      setPdfPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous)
        return null
      })
      setPdfPreviewLoading(false)
      return
    }

    const name = draft.fullName.trim()
    if (name.length < 2) {
      setPdfPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous)
        return null
      })
      setPdfPreviewLoading(false)
      return
    }

    setPdfPreviewLoading(true)
    ;(async () => {
      try {
        const res = await fetch('/api/v1/letters/pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kind: draft.kind,
            fullName: name,
            subject: generated.subject,
            lines: generated.lines,
            outputLanguage: draft.outputLanguage,
          }),
        })
        if (cancelled) return
        if (!res.ok) {
          setPdfPreviewUrl((previous) => {
            if (previous) URL.revokeObjectURL(previous)
            return null
          })
          return
        }
        const blob = await res.blob()
        if (cancelled) return
        const next = URL.createObjectURL(blob)
        if (cancelled) {
          URL.revokeObjectURL(next)
          return
        }
        setPdfPreviewUrl((previous) => {
          if (previous) URL.revokeObjectURL(previous)
          return next
        })
      } catch {
        if (!cancelled) {
          setPdfPreviewUrl((previous) => {
            if (previous) URL.revokeObjectURL(previous)
            return null
          })
        }
      } finally {
        if (!cancelled) setPdfPreviewLoading(false)
      }
    })()

    return () => {
      cancelled = true
      setPdfPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous)
        return null
      })
      setPdfPreviewLoading(false)
    }
  }, [generated, draft.kind, draft.fullName, draft.outputLanguage])

  const runGenerate = useCallback(async () => {
    if (!isDraftComplete(draft)) return
    if (!accessToken) return
    setGenerating(true)
    try {
      const postGenerate = (token: string) =>
        fetch('/api/v1/letters/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ draft }),
        })

      let token = accessToken
      let res = await postGenerate(token)
      if (res.status === 401) {
        const next = await refreshSession()
        if (!next) {
          toast.error('Sesi berakhir. Silakan masuk lagi.')
          return
        }
        res = await postGenerate(next)
      }

      const data = (await res.json().catch(() => null)) as {
        subject?: string
        lines?: string[]
        error?: { message?: string; code?: string }
      } | null
      if (!res.ok || !data?.subject || !data.lines) {
        toast.error(data?.error?.message ?? 'Gagal menghasilkan surat (AI)')
        return
      }
      let lines = replaceFirstDateInLetterLines(data.lines, draft.outputLanguage)
      if (draft.kind === 'resign') {
        lines = removeEmailLabelLinesFromLines(lines)
      }
      setGenerated({
        subject: halTitleForKind(draft.kind, data.subject, draft.outputLanguage),
        lines,
      })
    } finally {
      setGenerating(false)
    }
  }, [draft, accessToken, refreshSession])

  const handleCopy = useCallback(async () => {
    if (!generated?.lines.length) return
    try {
      await navigator.clipboard.writeText(generated.lines.join('\n'))
    } catch {
      window.prompt('Salin teks surat:', generated.lines.join('\n'))
    }
  }, [generated])

  const handleDownloadPdf = useCallback(async () => {
    if (!generated?.lines.length || !draft.kind) return
    const name = draft.fullName.trim()
    if (!name) {
      toast.error('Isi nama lengkap di formulir untuk nama file PDF.')
      return
    }

    setPdfDownloading(true)
    try {
      const res = await fetch('/api/v1/letters/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: draft.kind,
          fullName: name,
          subject: generated.subject,
          lines: generated.lines,
          outputLanguage: draft.outputLanguage,
        }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: { message?: string } } | null
        toast.error(data?.error?.message ?? 'Gagal membuat PDF')
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = buildLetterPdfFilename(draft.kind, name)
      anchor.rel = 'noopener'
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
      toast.success('PDF berhasil diunduh')
    } catch {
      toast.error('Gagal mengunduh PDF')
    } finally {
      setPdfDownloading(false)
    }
  }, [generated, draft.kind, draft.fullName, draft.outputLanguage])

  const handleKindChange = useCallback((kind: LetterKind) => {
    setDraft((previous) => ({ ...previous, kind }))
    setGenerated(null)
  }, [])

  const complete = isDraftComplete(draft)

  return {
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
  }
}
