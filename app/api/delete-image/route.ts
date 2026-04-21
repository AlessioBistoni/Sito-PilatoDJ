import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase'
import { removeStorageObjectByPublicUrl, pathFromPublicImageUrl } from '@/lib/storage-images'

export async function DELETE(request: NextRequest) {
  try {
    const imageUrl = new URL(request.url).searchParams.get('path')
    if (!imageUrl) {
      return NextResponse.json({ error: 'URL immagine mancante' }, { status: 400 })
    }

    if (!pathFromPublicImageUrl(imageUrl)) {
      return NextResponse.json({ success: true })
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true })
    }

    await removeStorageObjectByPublicUrl(imageUrl)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: true })
  }
}
