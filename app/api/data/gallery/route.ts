import { NextRequest, NextResponse } from 'next/server'
import {
  readAppDataValue,
  writeAppDataValue,
  isAppDataConfigured,
} from '@/lib/app-data'
import { normalizeGalleryStorageValue } from '@/lib/gallery'

const STORAGE_KEY = 'pilato_dj_gallery'

export async function GET() {
  if (!isAppDataConfigured()) {
    return NextResponse.json({ images: [], configured: false })
  }
  try {
    const value = await readAppDataValue(STORAGE_KEY)
    return NextResponse.json({
      images: normalizeGalleryStorageValue(value),
      configured: true,
    })
  } catch {
    return NextResponse.json({ images: [], configured: true })
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
    const { images } = await request.json()
    await writeAppDataValue(STORAGE_KEY, images)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 })
  }
}
