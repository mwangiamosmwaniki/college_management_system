import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const backendRes = await fetch(`${BACKEND_URL}/api/v1/finance/payments/mpesa/stk-push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
      },
      body: JSON.stringify(payload),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Payment service unavailable';
    return NextResponse.json(
      { success: false, error: `Payment proxy error: ${message}` },
      { status: 502 }
    );
  }
}
