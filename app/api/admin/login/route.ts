import { NextRequest, NextResponse } from 'next/server'
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSessionToken,
} from '@/lib/admin-session'

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 12
const attemptsByIp = new Map<string, number[]>()

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip') || 'unknown'
}

function rateLimitLogin(ip: string): boolean {
  const now = Date.now()
  const start = now - WINDOW_MS
  const list = (attemptsByIp.get(ip) ?? []).filter((t) => t > start)
  if (list.length >= MAX_ATTEMPTS) return false
  list.push(now)
  attemptsByIp.set(ip, list)
  if (attemptsByIp.size > 4000) attemptsByIp.clear()
  return true
}

function expectedAdminPassword(): string | null {
  const direct = process.env.ADMIN_PASSWORD?.trim()
  if (direct) return direct
  /** Solo server: mai bundle client. Preferire ADMIN_PASSWORD. */
  const legacy = process.env.NEXT_PUBLIC_ADMIN_PASSWORD?.trim()
  if (legacy) return legacy
  if (process.env.NODE_ENV !== 'production') return 'piluz2024'
  return null
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request)
  if (!rateLimitLogin(ip)) {
    return NextResponse.json(
      { error: 'Troppi tentativi. Riprova tra qualche minuto.' },
      { status: 429 }
    )
  }

  const pwd = expectedAdminPassword()
  if (!pwd) {
    return NextResponse.json(
      {
        error:
          'Accesso admin non configurato: imposta ADMIN_PASSWORD nelle variabili d’ambiente (produzione).',
      },
      { status: 503 }
    )
  }

  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Richiesta non valida' }, { status: 400 })
  }

  const password = typeof body.password === 'string' ? body.password : ''
  if (password !== pwd) {
    return NextResponse.json({ error: 'Password errata' }, { status: 401 })
  }

  const token = await createAdminSessionToken()
  if (!token) {
    return NextResponse.json(
      {
        error:
          'Sessione non inizializzabile: in produzione imposta ADMIN_SESSION_SECRET (min. 16 caratteri).',
      },
      { status: 503 }
    )
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions())
  return res
}
