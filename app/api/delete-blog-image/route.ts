import { NextRequest, NextResponse } from 'next/server'
import { del } from '@vercel/blob'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('path')

    if (!imageUrl) {
      return NextResponse.json({ error: 'URL immagine mancante' }, { status: 400 })
    }

    // Elimina il blob da Vercel Blob Storage
    await del(imageUrl)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Errore durante l\'eliminazione:', error)
    // Se l'immagine non esiste o è già stata eliminata, restituisci successo comunque
    return NextResponse.json({ success: true })
  }
}

