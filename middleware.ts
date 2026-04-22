import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE } from '@/lib/admin-session'

async function hasValidAdminSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value
  return verifyAdminSessionToken(token)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const method = request.method

  if (pathname.startsWith('/admin/')) {
    if (!(await hasValidAdminSession(request))) {
      const login = new URL('/admin', request.url)
      login.searchParams.set('next', pathname)
      return NextResponse.redirect(login)
    }
    return NextResponse.next()
  }

  if (pathname.startsWith('/api/data/')) {
    const isContactMessages = pathname === '/api/data/contact-messages'
    const needsAuth =
      method === 'POST' || (method === 'GET' && isContactMessages)

    if (needsAuth && !(await hasValidAdminSession(request))) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }
    return NextResponse.next()
  }

  if (
    pathname === '/api/upload-image' ||
    pathname === '/api/upload-blog-image' ||
    pathname === '/api/upload-collaboration-logo'
  ) {
    if (method === 'POST' && !(await hasValidAdminSession(request))) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }
    return NextResponse.next()
  }

  if (pathname === '/api/delete-image') {
    if (method === 'DELETE' && !(await hasValidAdminSession(request))) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/data/:path*',
    '/api/upload-image',
    '/api/upload-blog-image',
    '/api/upload-collaboration-logo',
    '/api/delete-image',
  ],
}
