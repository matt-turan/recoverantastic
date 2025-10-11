import { type NextRequest, NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('fb-session')?.value;
  const { pathname } = request.nextUrl;

  const isAuthenticated = !!sessionCookie;

  // If the user is on the auth page but is authenticated, redirect to dashboard
  if (pathname === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the user is trying to access a protected page and is not authenticated, redirect to auth page
  const protectedPaths = ['/dashboard', '/journal', '/settings', '/community'];
  if (protectedPaths.some((p) => pathname.startsWith(p)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
