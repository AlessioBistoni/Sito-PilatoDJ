import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('path')

    if (!imageUrl) {
      return NextResponse.json({ error: 'URL immagine mancante' }, { status: 400 })
    }

    // Estrai il nome del file dall'URL Supabase
    const urlParts = imageUrl.split('/images/')
    if (urlParts.length < 2) {
      return NextResponse.json({ success: true })
    }
    
    const fileName = urlParts[1]

    // Elimina da Supabase Storage
    const { error } = await supabase.storage
      .from('images')
      .remove([fileName])

    if (error) {
      console.error('Errore durante l\'eliminazione:', error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Errore durante l\'eliminazione:', error)
    return NextResponse.json({ success: true })
  }
}

