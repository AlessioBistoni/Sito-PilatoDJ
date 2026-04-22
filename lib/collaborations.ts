export type CollaborationPartner = {
  id: string
  name: string
  imageUrl: string
  /** Link opzionale al sito del partner */
  websiteUrl?: string
}

export type CollaborationsStorageValue = {
  partners: CollaborationPartner[]
}

function isPartnerRecord(x: unknown): x is CollaborationPartner {
  if (typeof x !== 'object' || x === null) return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.name === 'string' &&
    typeof o.imageUrl === 'string' &&
    (o.websiteUrl === undefined ||
      o.websiteUrl === null ||
      typeof o.websiteUrl === 'string')
  )
}

/** Normalizza il valore letto da app_data (oggetto con `partners` o array legacy). */
export function normalizeCollaborationsStorageValue(value: unknown): CollaborationPartner[] {
  if (value == null) return []
  if (Array.isArray(value)) {
    return value.filter(isPartnerRecord).map((p) => ({
      id: p.id,
      name: p.name.trim(),
      imageUrl: p.imageUrl.trim(),
      ...(typeof p.websiteUrl === 'string' && p.websiteUrl.trim()
        ? { websiteUrl: p.websiteUrl.trim() }
        : {}),
    }))
  }
  if (typeof value === 'object' && value !== null && 'partners' in value) {
    const partners = (value as { partners?: unknown }).partners
    return normalizeCollaborationsStorageValue(partners)
  }
  return []
}

export function toCollaborationsStoragePayload(
  partners: CollaborationPartner[]
): CollaborationsStorageValue {
  return { partners }
}
