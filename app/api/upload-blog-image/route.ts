import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase'
import { uploadJpegToImages } from '@/lib/storage-images'
import {
  isLocalDevImageUploadEnabled,
  saveLocalDevBlogJpeg,
} from '@/lib/local-dev-image'

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured() && !isLocalDevImageUploadEnabled()) {
    return NextResponse.json(
      {
        error:
          'Storage non disponibile. Imposta NEXT_PUBLIC_SUPABASE_* in .env oppure usa `npm run dev` senza Supabase: l’immagine verrà salvata sotto public/immagini/caricate/.',
      },
      { status: 503 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

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
      const fileName = `blog/${timestamp}-${originalName}`
      // fit 'inside' in storage: niente ingrandimenti, solo ridimensionamento se oltre il lato max
      publicPath = await uploadJpegToImages(buffer, fileName, {
        maxEdge: 1920,
        quality: 92,
      })
    } else {
      publicPath = await saveLocalDevBlogJpeg(buffer, originalName)
    }

    return NextResponse.json({ success: true, path: publicPath })
  } catch {
    return NextResponse.json(
      { error: 'Errore durante il caricamento dell\'immagine' },
      { status: 500 }
    )
  }
}
