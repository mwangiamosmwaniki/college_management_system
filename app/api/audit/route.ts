import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams.toString();
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/audit-logs${searchParams ? `?${searchParams}` : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Audit service unavailable';
    return NextResponse.json(
      { success: false, error: `Audit proxy error: ${message}` },
      { status: 502 }
    );
  }
}
