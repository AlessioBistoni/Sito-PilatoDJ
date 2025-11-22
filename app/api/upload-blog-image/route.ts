import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Nessun file caricato' }, { status: 400 })
    }

    // Verifica che sia un'immagine
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Il file deve essere un\'immagine' }, { status: 400 })
    }

    // Genera un nome file unico
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `blog/${timestamp}-${originalName}`

    // Leggi il file come buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ridimensiona l'immagine per il blog (larghezza max 1400px, mantiene proporzioni)
    const resizedBuffer = await sharp(buffer)
      .resize(1400, 1400, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 90 })
      .toBuffer()

    // Carica su Vercel Blob Storage
    const blob = await put(fileName, resizedBuffer, {
      access: 'public',
      contentType: 'image/jpeg',
    })

    return NextResponse.json({
      success: true,
      path: blob.url,
    })
  } catch (error) {
    console.error('Errore durante l\'upload:', error)
    return NextResponse.json(
      { error: 'Errore durante il caricamento dell\'immagine' },
      { status: 500 }
    )
  }
}

