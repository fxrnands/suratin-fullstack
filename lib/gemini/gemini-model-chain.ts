/** Stable IDs for Gemini Developer API free-tier capable models (try in order after primary). */
export const DEFAULT_GEMINI_FALLBACK_MODELS = [
  'gemini-3-flash-preview',
  'gemini-3.1-flash-lite-preview',
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash-lite-preview-09-2025',
  'gemini-2.5-flash-preview-09-2025',
  'gemini-2.0-flash',
] as const

export function resolveGeminiModelChain(): string[] {
  const envPrimary = process.env.GEMINI_MODEL?.trim()
  const envExtras =
    process.env.GEMINI_MODEL_FALLBACKS?.split(',')
      .map((segment) => segment.trim())
      .filter(Boolean) ?? []

  const ordered: string[] = []
  const pushUnique = (modelId: string) => {
    if (modelId && !ordered.includes(modelId)) ordered.push(modelId)
  }

  if (envPrimary) pushUnique(envPrimary)
  for (const modelId of envExtras) pushUnique(modelId)
  for (const modelId of DEFAULT_GEMINI_FALLBACK_MODELS) pushUnique(modelId)

  return ordered
}
