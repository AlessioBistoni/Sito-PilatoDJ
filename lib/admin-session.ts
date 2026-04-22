import type { NextRequest } from 'next/server'

/** Nome cookie sessione admin (httpOnly, impostato da /api/admin/login) */
export const ADMIN_SESSION_COOKIE = 'pilato_admin_session'

const TTL_SEC = 60 * 60 * 24 * 7

function sessionSecret(): string {
  const s = process.env.ADMIN_SESSION_SECRET?.trim()
  if (s && s.length >= 16) return s
  const pwd =
    process.env.ADMIN_PASSWORD?.trim() || process.env.NEXT_PUBLIC_ADMIN_PASSWORD?.trim()
  if (pwd && pwd.length >= 8) {
    return `pilato-admin-hmac:${pwd}:v1`.padEnd(32, '0').slice(0, 64)
  }
  if (process.env.NODE_ENV !== 'production') {
    return 'pilato-dev-only-admin-session-secret-min-32b'
  }
  return ''
}

async function hmacSha256Hex(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  const bytes = new Uint8Array(sig)
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let x = 0
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return x === 0
}

/** Valore cookie `expUnix.hexsig` */
export async function createAdminSessionToken(): Promise<string | null> {
  const secret = sessionSecret()
  if (!secret) return null
  const exp = Math.floor(Date.now() / 1000) + TTL_SEC
  const sig = await hmacSha256Hex(String(exp), secret)
  return `${exp}.${sig}`
}

export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false
  const secret = sessionSecret()
  if (!secret) return false
  const dot = token.indexOf('.')
  if (dot <= 0) return false
  const expStr = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const exp = parseInt(expStr, 10)
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false
  const expected = await hmacSha256Hex(String(exp), secret)
  return timingSafeEqualHex(sig.toLowerCase(), expected.toLowerCase())
}

export function adminSessionCookieOptions(): {
  httpOnly: boolean
  secure: boolean
  sameSite: 'lax'
  path: string
  maxAge: number
} {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TTL_SEC,
  }
}

export async function isAdminRequest(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  return verifyAdminSessionToken(token)
}
