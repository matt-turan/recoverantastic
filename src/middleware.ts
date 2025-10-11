import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('fb-session')?.value;
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();

  // Forward the Authorization header to server components/actions
  if (token) {
    response.headers.set('Authorization', `Bearer ${token}`);
  }
  
  // If the user is on the auth page but has a token, redirect to dashboard
  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the user is trying to access a protected page without a token, redirect to auth page
  const protectedPaths = ['/dashboard', '/journal', '/settings', '/community'];
  if (protectedPaths.some(p => pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
