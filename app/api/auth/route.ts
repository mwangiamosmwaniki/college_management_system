import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Identifier and password are required.' },
        { status: 400 }
      );
    }

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await backendRes.json();
    const res = NextResponse.json(data, { status: backendRes.status });

    const setCookie = backendRes.headers.get('set-cookie');
    if (setCookie) {
      res.headers.set('set-cookie', setCookie);
    }

    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Authentication service unavailable';
    return NextResponse.json(
      { success: false, error: `Auth proxy error: ${message}` },
      { status: 502 }
    );
  }
}
