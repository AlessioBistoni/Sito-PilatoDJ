import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

const STORAGE_KEY = 'pilato_dj_dates'

export async function GET() {
  try {
    const dates = await kv.get<string[]>(STORAGE_KEY)
    return NextResponse.json({ dates: dates || [] })
  } catch (error) {
    console.error('Errore nel caricamento delle date:', error)
    return NextResponse.json({ dates: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { dates } = await request.json()
    await kv.set(STORAGE_KEY, dates)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Errore nel salvataggio delle date:', error)
    return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 })
  }
}

