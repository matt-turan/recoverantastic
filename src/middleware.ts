// import { NextRequest, NextResponse } from 'next/server';
// import { auth } from '@/lib/firebase-admin';

// export async function middleware(request: NextRequest) {
//   const sessionCookie = request.cookies.get('fb-session')?.value;
//   const { pathname } = request.nextUrl;

//   let isAuthenticated = false;
//   if (sessionCookie) {
//     try {
//       await auth.verifySessionCookie(sessionCookie, true);
//       isAuthenticated = true;
//     } catch (error) {
//       // Session cookie is invalid.
//       isAuthenticated = false;
//     }
//   }

//   // If the user is on the auth page but is authenticated, redirect to dashboard
//   if (pathname === '/' && isAuthenticated) {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }

//   // If the user is trying to access a protected page and is not authenticated, redirect to auth page
//   const protectedPaths = ['/dashboard', '/journal', '/settings', '/community'];
//   if (protectedPaths.some((p) => pathname.startsWith(p)) && !isAuthenticated) {
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// };

// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('fb-session')?.value;
  const { pathname } = request.nextUrl;

  let isAuthenticated = false;

  if (sessionCookie) {
    try {
      // Call your API route to verify the session
      const verifyUrl = new URL('/api/auth/verify', request.url);
      const response = await fetch(verifyUrl, {
        headers: {
          cookie: `fb-session=${sessionCookie}`,
        },
      });
      isAuthenticated = response.ok;
    } catch (error) {
      isAuthenticated = false;
    }
  }

  if (pathname === '/' && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const protectedPaths = ['/dashboard', '/journal', '/settings', '/community'];
  if (protectedPaths.some((p) => pathname.startsWith(p)) && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};