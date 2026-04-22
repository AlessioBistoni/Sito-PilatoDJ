import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase'
import { uploadJpegToImages } from '@/lib/storage-images'
import {
  isLocalDevImageUploadEnabled,
  saveLocalDevGalleryJpeg,
} from '@/lib/local-dev-image'

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured() && !isLocalDevImageUploadEnabled()) {
    return NextResponse.json(
      {
        error:
          'Supabase non configurato. In sviluppo (npm run dev) senza .env l’immagine si può salvare sotto public/; in produzione servono le variabili in Vercel.',
      },
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

    const buffer = Buffer.from(await file.arrayBuffer())
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_') || 'image.jpg'

    let publicPath: string
    if (isSupabaseConfigured()) {
      const timestamp = Date.now()
      const fileName = `serate/${timestamp}-${originalName}`
      publicPath = await uploadJpegToImages(buffer, fileName, {
        maxEdge: 1200,
        quality: 85,
        variant: 'gallery-square',
      })
    } else {
      publicPath = await saveLocalDevGalleryJpeg(buffer, originalName)
    }

    return NextResponse.json({
      success: true,
      path: publicPath,
      alt: alt || originalName,
    })
  } catch {
    return NextResponse.json(
      { error: 'Errore durante il caricamento dell\'immagine' },
      { status: 500 }
    )
  }
}
