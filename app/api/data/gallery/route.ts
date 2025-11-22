import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

const STORAGE_KEY = 'pilato_dj_gallery'

// Inizializza la tabella se non esiste
async function initTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS app_data (
        key VARCHAR(255) PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
  } catch (error) {
    // La tabella potrebbe già esistere, ignora l'errore
    console.log('Tabella già esistente o errore nella creazione:', error)
  }
}

export async function GET() {
  try {
    await initTable()
    const result = await sql`
      SELECT value FROM app_data WHERE key = ${STORAGE_KEY}
    `
    
    if (result.rows.length > 0) {
      return NextResponse.json({ images: result.rows[0].value || [] })
    }
    return NextResponse.json({ images: [] })
  } catch (error) {
    console.error('Errore nel caricamento delle immagini:', error)
    return NextResponse.json({ images: [] }, { status: 200 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await initTable()
    const { images } = await request.json()
    
    await sql`
      INSERT INTO app_data (key, value, updated_at)
      VALUES (${STORAGE_KEY}, ${JSON.stringify(images)}::jsonb, CURRENT_TIMESTAMP)
      ON CONFLICT (key) 
      DO UPDATE SET value = ${JSON.stringify(images)}::jsonb, updated_at = CURRENT_TIMESTAMP
    `
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Errore nel salvataggio delle immagini:', error)
    return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 })
  }
}

