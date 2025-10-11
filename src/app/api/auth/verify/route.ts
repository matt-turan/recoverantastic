// src/app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
    const sessionCookie = request.cookies.get('fb-session')?.value;

    if (!sessionCookie) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await auth.verifySessionCookie(sessionCookie, true);
        return NextResponse.json({ authenticated: true });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }
}