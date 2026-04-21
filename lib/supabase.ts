import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? ''
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? ''

/** True se URL e chiave sono impostati e non sono segnaposto da template. */
export function isSupabaseConfigured(): boolean {
  if (!url || !key) return false
  if (/placeholder/i.test(url) || key === 'placeholder') return false
  try {
    const u = new URL(url)
    if (/placeholder/i.test(u.hostname)) return false
    const local = u.hostname === 'localhost' || u.hostname === '127.0.0.1'
    const supabaseCloud = u.hostname.endsWith('.supabase.co')
    if (supabaseCloud && u.protocol !== 'https:') return false
    if (local && u.protocol !== 'http:' && u.protocol !== 'https:') return false
    return supabaseCloud || local
  } catch {
    return false
  }
}

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase non configurato')
  }
  client ??= createClient(url, key)
  return client
}
