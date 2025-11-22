import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

const STORAGE_KEY = 'pilato_dj_gallery'

export async function GET() {
  try {
    const images = await kv.get<any[]>(STORAGE_KEY)
    return NextResponse.json({ images: images || [] })
  } catch (error) {
    console.error('Errore nel caricamento delle immagini:', error)
    return NextResponse.json({ images: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { images } = await request.json()
    await kv.set(STORAGE_KEY, images)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Errore nel salvataggio delle immagini:', error)
    return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 })
  }
}

