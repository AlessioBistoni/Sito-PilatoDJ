import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
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

    // Crea la cartella se non esiste
    const uploadDir = path.join(process.cwd(), 'public', 'immagini', 'blog')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Genera un nome file unico
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}-${originalName}`
    const filePath = path.join(uploadDir, fileName)

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

    // Salva il file ridimensionato
    await writeFile(filePath, resizedBuffer)

    // Restituisci il percorso relativo
    const relativePath = `/immagini/blog/${fileName}`

    return NextResponse.json({
      success: true,
      path: relativePath,
    })
  } catch (error) {
    console.error('Errore durante l\'upload:', error)
    return NextResponse.json(
      { error: 'Errore durante il caricamento dell\'immagine' },
      { status: 500 }
    )
  }
}

