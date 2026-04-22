import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase'
import { uploadJpegToImages } from '@/lib/storage-images'
import {
  isLocalDevImageUploadEnabled,
  saveLocalDevCollaborationLogoJpeg,
} from '@/lib/local-dev-image'

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured() && !isLocalDevImageUploadEnabled()) {
    return NextResponse.json(
      {
        error:
          'Storage non disponibile. Imposta NEXT_PUBLIC_SUPABASE_* in .env oppure usa `npm run dev` senza Supabase: il logo verrà salvato sotto public/immagini/caricate/.',
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
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_') || 'logo.jpg'

    let publicPath: string
    if (isSupabaseConfigured()) {
      const timestamp = Date.now()
      const fileName = `collaborations/${timestamp}-${originalName}`
      publicPath = await uploadJpegToImages(buffer, fileName, {
        maxEdge: 800,
        quality: 90,
      })
    } else {
      publicPath = await saveLocalDevCollaborationLogoJpeg(buffer, originalName)
    }

    return NextResponse.json({ success: true, path: publicPath })
  } catch {
    return NextResponse.json(
      { error: 'Errore durante il caricamento del logo' },
      { status: 500 }
    )
  }
}
