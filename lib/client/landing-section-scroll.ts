export const LANDING_SECTION_IDS = ['cara-kerja', 'harga'] as const
export type LandingSectionId = (typeof LANDING_SECTION_IDS)[number]

const STORAGE_KEY = 'suratin_landing_section'

export function isLandingSectionId(value: string): value is LandingSectionId {
  return (LANDING_SECTION_IDS as readonly string[]).includes(value)
}

export function rememberLandingSectionScroll(sectionId: LandingSectionId) {
  try {
    sessionStorage.setItem(STORAGE_KEY, sectionId)
  } catch {
    /* ignore */
  }
}

export function takeLandingSectionScroll(): LandingSectionId | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
    if (!raw || !isLandingSectionId(raw)) return null
    return raw
  } catch {
    return null
  }
}

export function scrollToLandingSection(sectionId: LandingSectionId) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
