import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const STORAGE_KEY = 'pilato_dj_gallery'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('app_data')
      .select('value')
      .eq('key', STORAGE_KEY)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      throw error
    }
    
    return NextResponse.json({ images: data?.value || [] })
  } catch (error) {
    console.error('Errore nel caricamento delle immagini:', error)
    return NextResponse.json({ images: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { images } = await request.json()
    
    const { error } = await supabase
      .from('app_data')
      .upsert({
        key: STORAGE_KEY,
        value: images,
        updated_at: new Date().toISOString()
      })
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Errore nel salvataggio delle immagini:', error)
    return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 })
  }
}

