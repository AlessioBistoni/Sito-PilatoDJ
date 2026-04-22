import { NextRequest, NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase'
import { tryDeleteLocalPublicImmaginiFile } from '@/lib/local-dev-image'
import { removeStorageObjectByPublicUrl, pathFromPublicImageUrl } from '@/lib/storage-images'

export async function DELETE(request: NextRequest) {
  try {
    const raw = new URL(request.url).searchParams.get('path')
    if (!raw) {
      return NextResponse.json({ error: 'URL immagine mancante' }, { status: 400 })
    }
    const imageUrl = decodeURIComponent(raw)

    if (await tryDeleteLocalPublicImmaginiFile(imageUrl)) {
      return NextResponse.json({ success: true })
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
