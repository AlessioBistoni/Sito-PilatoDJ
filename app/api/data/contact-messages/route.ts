import { NextRequest, NextResponse } from 'next/server'
import {
  readAppDataValue,
  writeAppDataValue,
  isAppDataConfigured,
} from '@/lib/app-data'
import {
  normalizeContactMessagesValue,
  toContactMessagesStorage,
  type ContactMessage,
} from '@/lib/contact-messages'

const STORAGE_KEY = 'pilato_dj_contact_messages'

function sanitizeMessages(input: unknown): ContactMessage[] {
  if (!Array.isArray(input)) return []
  const out: ContactMessage[] = []
  for (const row of input) {
    if (typeof row !== 'object' || row === null) continue
    const o = row as Record<string, unknown>
    const id = typeof o.id === 'string' ? o.id.trim() : ''
    const createdAt = typeof o.createdAt === 'string' ? o.createdAt.trim() : ''
    const name = typeof o.name === 'string' ? o.name.trim() : ''
    const email = typeof o.email === 'string' ? o.email.trim() : ''
    const phone = typeof o.phone === 'string' ? o.phone.trim() : ''
    const message = typeof o.message === 'string' ? o.message.trim() : ''
    if (!id || !createdAt || !name || !email || !message) continue
    out.push({ id, createdAt, name, email, phone, message })
  }
  return out
}

export async function GET() {
  if (!isAppDataConfigured()) {
    return NextResponse.json({ messages: [], configured: false })
  }
  try {
    const value = await readAppDataValue(STORAGE_KEY)
    return NextResponse.json({
      messages: normalizeContactMessagesValue(value),
      configured: true,
    })
  } catch {
    return NextResponse.json({ messages: [], configured: true })
  }
}

export async function POST(request: NextRequest) {
  if (!isAppDataConfigured()) {
    return NextResponse.json(
      {
        error:
          'Storage non configurato. In produzione imposta NEXT_PUBLIC_SUPABASE_* su Vercel o nel file .env.local.',
      },
      { status: 503 }
    )
  }
  try {
    const body = await request.json()
    const messages = sanitizeMessages(body?.messages)
    await writeAppDataValue(STORAGE_KEY, toContactMessagesStorage(messages))
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 })
  }
}
