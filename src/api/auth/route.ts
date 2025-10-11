import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  const authorization = request.headers.get('Authorization');

  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    try {
      const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn,
      });
      (await cookies()).set('fb-session', sessionCookie, {
        maxAge: expiresIn,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
      });
      return NextResponse.json({ status: 'success' }, { status: 200 });
    } catch (error) {
      console.error('Error creating session cookie', error);
      return NextResponse.json(
        { status: 'error', message: 'Could not create session.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.json(
    { status: 'error', message: 'Unauthorized' },
    { status: 401 }
  );
}

export async function DELETE() {
  (await cookies()).delete('fb-session');
  return NextResponse.json({ status: 'success' }, { status: 200 });
}
