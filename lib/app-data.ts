import { promises as fs } from 'fs'
import path from 'path'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'

const TABLE = 'app_data'

/** File JSON solo per `npm run dev` senza Supabase (cartella ignorata da git). */
const DEV_STORE_PATH = path.join(process.cwd(), '.pilato-dev', 'app-data.json')

function useDevFileStore(): boolean {
  return process.env.NODE_ENV === 'development' && !isSupabaseConfigured()
}

/**
 * True se si può leggere/salvare dati app (Supabase in qualsiasi env, oppure file locale in dev).
 */
export function isAppDataConfigured(): boolean {
  return isSupabaseConfigured() || useDevFileStore()
}

async function readDevStore(): Promise<Record<string, unknown>> {
  try {
    const raw = await fs.readFile(DEV_STORE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {}
  } catch {
    return {}
  }
}

async function writeDevStore(store: Record<string, unknown>): Promise<void> {
  await fs.mkdir(path.dirname(DEV_STORE_PATH), { recursive: true })
  await fs.writeFile(DEV_STORE_PATH, JSON.stringify(store, null, 2), 'utf8')
}

export async function readAppDataValue(key: string): Promise<unknown> {
  if (isSupabaseConfigured()) {
    const { data, error } = await getSupabase()
      .from(TABLE)
      .select('value')
      .eq('key', key)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data?.value ?? null
  }

  if (useDevFileStore()) {
    const store = await readDevStore()
    return store[key] ?? null
  }

  return null
}

export async function writeAppDataValue(key: string, value: unknown): Promise<void> {
  if (isSupabaseConfigured()) {
    const { error } = await getSupabase().from(TABLE).upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    })
    if (error) throw error
    return
  }

  if (useDevFileStore()) {
    const store = await readDevStore()
    store[key] = value
    await writeDevStore(store)
    return
  }

  throw new Error('Storage non disponibile: configura Supabase in produzione')
}
