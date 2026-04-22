/**
 * URL per anteprima / next/image: path sotto `public` o URL assoluti (es. Supabase).
 * Corregge valori errati da vecchia logica che anteponeva `/` agli URL http(s).
 */
export function resolveBlogImageSrc(raw: string | undefined | null): string {
  if (raw == null || typeof raw !== 'string') return ''
  let s = raw.trim()
  if (!s) return ''
  if (s.startsWith('/https://') || s.startsWith('/http://')) {
    s = s.slice(1)
  }
  if (s.startsWith('data:') || s.startsWith('blob:')) return s
  if (s.startsWith('http://') || s.startsWith('https://')) return s
  if (s.startsWith('//')) return `https:${s}`
  if (s.startsWith('/')) return s
  return `/${s}`
}

/** Normalizza il campo immagine in salvataggio (ripara eventuali `/https://` già salvati). */
export function normalizeBlogImageForStorage(raw: string): string {
  return resolveBlogImageSrc(raw)
}
