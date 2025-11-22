import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imagePath = searchParams.get('path')

    if (!imagePath) {
      return NextResponse.json({ error: 'Percorso immagine mancante' }, { status: 400 })
    }

    // Rimuovi lo slash iniziale per ottenere il percorso relativo
    const relativePath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
    const filePath = path.join(process.cwd(), 'public', relativePath)

    // Verifica che il file esista
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File non trovato' }, { status: 404 })
    }

    // Elimina il file
    await unlink(filePath)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Errore durante l\'eliminazione:', error)
    return NextResponse.json(
      { error: 'Errore durante l\'eliminazione del file' },
      { status: 500 }
    )
  }
}

