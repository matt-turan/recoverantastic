import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// This API route is used to receive the auth token from the client
// and set it as a secure, httpOnly cookie.
export async function GET(request: NextRequest) {
  const authorization = request.headers.get('Authorization');

  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    cookies().set('fb-session', idToken, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });
  }

  return NextResponse.json({ status: 'success' }, { status: 200 });
}

export async function DELETE() {
  cookies().delete('fb-session');
  return NextResponse.json({ status: 'success' }, { status: 200 });
}
