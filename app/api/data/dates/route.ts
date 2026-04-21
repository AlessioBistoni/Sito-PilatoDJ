import { NextRequest, NextResponse } from 'next/server'
import {
  readAppDataValue,
  writeAppDataValue,
  isAppDataConfigured,
} from '@/lib/app-data'

const STORAGE_KEY = 'pilato_dj_dates'

export async function GET() {
  if (!isAppDataConfigured()) {
    return NextResponse.json({ dates: [], configured: false })
  }
  try {
    const value = await readAppDataValue(STORAGE_KEY)
    return NextResponse.json({
      dates: Array.isArray(value) ? value : [],
      configured: true,
    })
  } catch {
    return NextResponse.json({ dates: [], configured: true })
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
    const { dates } = await request.json()
    await writeAppDataValue(STORAGE_KEY, dates)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[dates POST]', err)
    const message =
      err instanceof Error ? err.message : 'Errore nel salvataggio'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
