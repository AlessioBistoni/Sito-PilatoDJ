import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const STORAGE_KEY = 'pilato_dj_dates'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('app_data')
      .select('value')
      .eq('key', STORAGE_KEY)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error
    }
    
    return NextResponse.json({ dates: data?.value || [] })
  } catch (error) {
    console.error('Errore nel caricamento delle date:', error)
    return NextResponse.json({ dates: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { dates } = await request.json()
    
    const { error } = await supabase
      .from('app_data')
      .upsert({
        key: STORAGE_KEY,
        value: dates,
        updated_at: new Date().toISOString()
      })
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Errore nel salvataggio delle date:', error)
    return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 })
  }
}

