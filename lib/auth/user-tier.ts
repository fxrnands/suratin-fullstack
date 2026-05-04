export const USER_TIER_IDS = ['free', 'pro'] as const
export type UserTierId = (typeof USER_TIER_IDS)[number]

/** Product-facing names (profile + UI). */
export const USER_TIER_PROFILE: Record<
  UserTierId,
  { displayName: string; shortLabel: string; description: string }
> = {
  free: {
    displayName: 'Suratin Essential',
    shortLabel: 'Essential',
    description: 'Mulai gratis — cukup untuk kebutuhan harian.',
  },
  pro: {
    displayName: 'Suratin Professional',
    shortLabel: 'Professional',
    description: 'Tanpa batas — alur surat dan prioritas penuh.',
  },
}

export function isUserTierId(value: string): value is UserTierId {
  return value === 'free' || value === 'pro'
}

export function parseUserTier(raw: string | null | undefined): UserTierId {
  if (raw && isUserTierId(raw)) return raw
  return 'free'
}
