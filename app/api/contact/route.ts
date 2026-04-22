import { NextRequest, NextResponse } from 'next/server'
import {
  readAppDataValue,
  writeAppDataValue,
  isAppDataConfigured,
} from '@/lib/app-data'
import {
  clampContactFields,
  normalizeContactMessagesValue,
  toContactMessagesStorage,
  type ContactMessage,
} from '@/lib/contact-messages'
import { formatContactWhatsAppBody, notifyContactViaWhatsApp } from '@/lib/whatsapp-notify'

const STORAGE_KEY = 'pilato_dj_contact_messages'

/** Limite soft anti-spam per istanza serverless (non globale su Vercel). */
const recentByIp = new Map<string, number[]>()
const WINDOW_MS = 15 * 60 * 1000
const MAX_PER_WINDOW = 5

function rateLimitOk(ip: string): boolean {
  const now = Date.now()
  const windowStart = now - WINDOW_MS
  const prev = (recentByIp.get(ip) ?? []).filter((t) => t > windowStart)
  if (prev.length >= MAX_PER_WINDOW) {
    return false
  }
  prev.push(now)
  recentByIp.set(ip, prev)
  if (recentByIp.size > 5000) {
    recentByIp.clear()
  }
  return true
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }
  return request.headers.get('x-real-ip') || 'unknown'
}

export async function POST(request: NextRequest) {
  if (!isAppDataConfigured()) {
    return NextResponse.json(
      {
        error:
          'Invio messaggi non disponibile: configura lo storage (Supabase in produzione o sviluppo con file locale).',
      },
      { status: 503 }
    )
  }

  const ip = clientIp(request)
  if (!rateLimitOk(ip)) {
    return NextResponse.json(
      { error: 'Troppi invii ravvicinati. Riprova tra qualche minuto.' },
      { status: 429 }
    )
  }

  try {
    const body = await request.json()
    /** Honeypot: se compilato, rispondi ok senza salvare (bot). */
    if (typeof body.company === 'string' && body.company.trim() !== '') {
      return NextResponse.json({ success: true })
    }

    const raw = {
      name: typeof body.name === 'string' ? body.name : '',
      email: typeof body.email === 'string' ? body.email : '',
      phone: typeof body.phone === 'string' ? body.phone : '',
      message: typeof body.message === 'string' ? body.message : '',
    }
    const { name, email, phone, message } = clampContactFields(raw)

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Compila nome, email e messaggio.' },
        { status: 400 }
      )
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Indirizzo email non valido.' }, { status: 400 })
    }

    const existing = normalizeContactMessagesValue(await readAppDataValue(STORAGE_KEY))
    const newMsg: ContactMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      createdAt: new Date().toISOString(),
      name,
      email,
      phone,
      message,
    }
    const next = [newMsg, ...existing]

    await writeAppDataValue(STORAGE_KEY, toContactMessagesStorage(next))

    /** WhatsApp in background: non bloccare la risposta al visitatore. */
    void notifyContactViaWhatsApp(formatContactWhatsAppBody({ name, email, phone, message }))

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[api/contact]', e)
    return NextResponse.json({ error: 'Errore nel salvataggio del messaggio.' }, { status: 500 })
  }
}
