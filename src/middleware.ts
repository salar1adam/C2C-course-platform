import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './lib/session'

export async function middleware(request: NextRequest) {
  const session = await getSession()
  const { pathname } = request.nextUrl

  const isLoginPage = pathname === '/'

  if (!session) {
    if (isLoginPage) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  const { role } = session

  if (isLoginPage) {
    const redirectUrl = role === 'admin' ? '/admin/dashboard' : '/student/dashboard'
    return NextResponse.redirect(new URL(redirectUrl, request.url))
  }

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/student/dashboard', request.url))
  }

  if (pathname.startsWith('/student') && role !== 'student') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
