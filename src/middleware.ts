// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/register', '/api/auth'];
const PROTECTED_PREFIXES = [
  '/dashboard','/income','/expense','/transfer','/services',
  '/analytics','/alerts','/sync','/envelopes','/onboarding'
];

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

export default async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const isPublic = PUBLIC_ROUTES.some(p => pathname === p || pathname.startsWith(p + '/'));
  const isProtected = PROTECTED_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'));

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token && pathname.startsWith('/auth/')) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  if (!token && isProtected) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/login';
    url.search = new URLSearchParams({ callbackUrl: pathname + (search || '') }).toString();
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}