import { NextRequest, NextResponse } from 'next/server';

const RAW_BACKEND_URL = process.env.BACKEND_API_URL?.trim();
const HAS_EXTERNAL_BACKEND = Boolean(
  RAW_BACKEND_URL &&
  !RAW_BACKEND_URL.includes('localhost:8080') &&
  !RAW_BACKEND_URL.includes('127.0.0.1:8080') &&
  !RAW_BACKEND_URL.includes(':3000')
);

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams.toString();

    if (HAS_EXTERNAL_BACKEND && RAW_BACKEND_URL) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const backendRes = await fetch(
        `${RAW_BACKEND_URL}/api/v1/audit-logs${searchParams ? `?${searchParams}` : ''}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Cookie: req.headers.get('cookie') || '',
          },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);

      const contentType = backendRes.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await backendRes.json();
        return NextResponse.json(data, { status: backendRes.status });
      }
    }

    return NextResponse.json(
      {
        success: true,
        content: [],
        totalElements: 0,
        totalPages: 0,
        pageNumber: 0,
        pageSize: 20,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Audit service unavailable';
    return NextResponse.json(
      { success: false, error: `Audit service error: ${message}` },
      { status: 500 }
    );
  }
}

