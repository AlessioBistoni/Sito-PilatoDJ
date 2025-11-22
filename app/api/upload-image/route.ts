import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const alt = formData.get('alt') as string

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
    const fileName = `serate/${timestamp}-${originalName}`

    // Leggi il file come buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ridimensiona l'immagine mantenendo le proporzioni
    // Max width: 1200px, Max height: 1200px, qualità: 85%
    const resizedBuffer = await sharp(buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toBuffer()

    // Carica su Vercel Blob Storage
    const blob = await put(fileName, resizedBuffer, {
      access: 'public',
      contentType: 'image/jpeg',
    })

    return NextResponse.json({
      success: true,
      path: blob.url,
      alt: alt || originalName,
    })
  } catch (error) {
    console.error('Errore durante l\'upload:', error)
    return NextResponse.json(
      { error: 'Errore durante il caricamento dell\'immagine' },
      { status: 500 }
    )
  }
}

