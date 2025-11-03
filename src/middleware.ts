
import { NextRequest, NextResponse } from 'next/server';

const publicPaths = ['/login'];
const protectedPaths = [
    '/',
    '/dashboard/inventory', 
    '/dashboard/sales', 
    '/dashboard/purchases', 
    '/dashboard/employees', 
    '/dashboard/reports'
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = publicPaths.includes(path);
  const isProtectedPath = protectedPaths.includes(path) || path.startsWith('/dashboard');

  const authCookie = request.cookies.get('firebaseAuth'); // or your specific auth cookie name

  if (isProtectedPath && !authCookie) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  if (isPublicPath && authCookie) {
    return NextResponse.redirect(new URL('/dashboard/inventory', request.nextUrl));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
