import { NextRequest, NextResponse } from 'next/server'
import {
  readAppDataValue,
  writeAppDataValue,
  isAppDataConfigured,
} from '@/lib/app-data'
import {
  normalizeCollaborationsStorageValue,
  toCollaborationsStoragePayload,
  type CollaborationPartner,
} from '@/lib/collaborations'

const STORAGE_KEY = 'pilato_dj_collaborations'

function sanitizePartners(input: unknown): CollaborationPartner[] {
  if (!Array.isArray(input)) return []
  const out: CollaborationPartner[] = []
  for (const row of input) {
    if (typeof row !== 'object' || row === null) continue
    const o = row as Record<string, unknown>
    const id = typeof o.id === 'string' ? o.id.trim() : ''
    const name = typeof o.name === 'string' ? o.name.trim() : ''
    const imageUrl = typeof o.imageUrl === 'string' ? o.imageUrl.trim() : ''
    const websiteRaw = o.websiteUrl
    const websiteUrl =
      typeof websiteRaw === 'string' && websiteRaw.trim() ? websiteRaw.trim() : undefined
    if (!id || !name || !imageUrl) continue
    out.push({ id, name, imageUrl, ...(websiteUrl ? { websiteUrl } : {}) })
  }
  return out
}

export async function GET() {
  if (!isAppDataConfigured()) {
    return NextResponse.json({ partners: [], configured: false })
  }
  try {
    const value = await readAppDataValue(STORAGE_KEY)
    return NextResponse.json({
      partners: normalizeCollaborationsStorageValue(value),
      configured: true,
    })
  } catch {
    return NextResponse.json({ partners: [], configured: true })
  }
}

export async function POST(request: NextRequest) {
  if (!isAppDataConfigured()) {
    return NextResponse.json(
      {
        error:
          'Storage non configurato. In produzione imposta NEXT_PUBLIC_SUPABASE_* su Vercel o nel file .env.local.',
      },
      { status: 503 }
    )
  }
  try {
    const body = await request.json()
    const partners = sanitizePartners(body?.partners)
    await writeAppDataValue(STORAGE_KEY, toCollaborationsStoragePayload(partners))
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 })
  }
}
