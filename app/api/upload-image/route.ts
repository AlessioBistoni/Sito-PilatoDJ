import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase'
import { uploadJpegToImages } from '@/lib/storage-images'

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Supabase non configurato (.env.local)' },
      { status: 503 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const alt = formData.get('alt') as string

    if (!file) {
      return NextResponse.json({ error: 'Nessun file caricato' }, { status: 400 })
    }
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Il file deve essere un\'immagine' }, { status: 400 })
    }

    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `serate/${timestamp}-${originalName}`

    const buffer = Buffer.from(await file.arrayBuffer())
    const publicUrl = await uploadJpegToImages(buffer, fileName, {
      maxEdge: 1200,
      quality: 85,
    })

    return NextResponse.json({
      success: true,
      path: publicUrl,
      alt: alt || originalName,
    })
  } catch {
    return NextResponse.json(
      { error: 'Errore durante il caricamento dell\'immagine' },
      { status: 500 }
    )
  }
}
