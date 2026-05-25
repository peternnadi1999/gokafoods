import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ACCESS_TOKEN_KEY } from '@/lib/api/client';

const AUTH_ROUTES   = ['/login', '/signup', '/welcome', '/forgot-password'];
const PROTECTED     = ['/discover', '/wishlist', '/cart', '/profile', '/product', '/orders', '/search', '/help'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ACCESS_TOKEN_KEY)?.value;

  const isProtected = PROTECTED.some((r) => pathname.startsWith(r));
  const isAuthRoute  = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));

  // Unauthenticated → redirect to welcome
  if (isProtected && !token) {
    const url = new URL('/welcome', request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Authenticated → skip auth pages, go to discover
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/discover', request.url));
  }

  // Security headers on every response
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon|manifest|icons|screenshots|sw.js|workbox).*)'],
};
