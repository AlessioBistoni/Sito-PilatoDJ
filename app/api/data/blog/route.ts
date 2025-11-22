import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

const STORAGE_KEY = 'pilato_dj_blog'

export async function GET() {
  try {
    const posts = await kv.get<any[]>(STORAGE_KEY)
    return NextResponse.json({ posts: posts || [] })
  } catch (error) {
    console.error('Errore nel caricamento dei post:', error)
    return NextResponse.json({ posts: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { posts } = await request.json()
    await kv.set(STORAGE_KEY, posts)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Errore nel salvataggio dei post:', error)
    return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 })
  }
}

