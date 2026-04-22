export interface GalleryImage {
  id: string
  src: string
  /** Testo alternativo (accessibilità) */
  alt: string
  /** Nome serata in didascalia (se assente si usa `alt`) */
  eventTitle?: string
  /** Data serata, preferibilmente YYYY-MM-DD */
  eventDate?: string
}

/** Stesse 8 serate in `/public/immagini/serate/`: usate sul sito se lo storage non è attivo. */
export const DEFAULT_GALLERY_IMAGES: GalleryImage[] = Array.from(
  { length: 8 },
  (_, i) => ({
    id: `default-${i + 1}`,
    src: `/immagini/serate/${i + 1}.jpg`,
    alt: `Serata ${i + 1}`,
    eventTitle: `Serata ${i + 1}`,
  })
)

/** Normalizza un valore letto dallo storage (array o, per compatibilità, `{ images: [...] }`). */
export function normalizeGalleryStorageValue(
  value: unknown
): Record<string, unknown>[] {
  if (Array.isArray(value)) {
    return value as Record<string, unknown>[]
  }
  if (
    value != null &&
    typeof value === 'object' &&
    'images' in (value as object) &&
    Array.isArray((value as { images: unknown }).images)
  ) {
    return (value as { images: Record<string, unknown>[] }).images
  }
  return []
}

export function parseGalleryListFromJson(raw: unknown): GalleryImage[] {
  if (!Array.isArray(raw)) return []
  return raw.map((row) => {
    const o = row as Record<string, unknown>
    return {
      id: String(o.id ?? ''),
      src: String(o.src ?? ''),
      alt: String(o.alt ?? ''),
      ...(typeof o.eventTitle === 'string' && o.eventTitle
        ? { eventTitle: o.eventTitle }
        : {}),
      ...(typeof o.eventDate === 'string' && o.eventDate
        ? { eventDate: o.eventDate }
        : {}),
    } as GalleryImage
  })
}

export function galleryCaptionTitle(image: GalleryImage): string {
  const t = image.eventTitle?.trim()
  if (t) return t
  return image.alt
}

export function formatGalleryEventDate(
  raw: string | undefined | null
): string {
  if (raw == null || String(raw).trim() === '') return ''
  const day = String(raw).trim().split('T')[0] ?? ''
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return ''
  const d = new Date(`${day}T12:00:00`)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function galleryAriaLabel(image: GalleryImage): string {
  const title = galleryCaptionTitle(image)
  const date = formatGalleryEventDate(image.eventDate)
  if (date) return `Apri immagine: ${title}, ${date}`
  return `Apri immagine: ${title}`
}
