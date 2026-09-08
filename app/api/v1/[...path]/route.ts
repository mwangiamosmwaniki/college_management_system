import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8080';

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, await params);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, await params);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, await params);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, await params);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxyRequest(req, await params);
}

async function proxyRequest(req: NextRequest, { path }: { path: string[] }) {
  const targetPath = path.join('/');
  const searchParams = req.nextUrl.searchParams.toString();
  const targetUrl = `${BACKEND_URL}/api/v1/${targetPath}${searchParams ? `?${searchParams}` : ''}`;

  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    // Forward relevant headers including cookies and authorization
    if (!['host', 'connection', 'content-length'].includes(key.toLowerCase())) {
      headers[key] = value;
    }
  });

  const fetchOptions: RequestInit = {
    method: req.method,
    headers,
  };

  if (!['GET', 'HEAD'].includes(req.method)) {
    try {
      const body = await req.text();
      if (body) {
        fetchOptions.body = body;
      }
    } catch {
      // Body may be empty
    }
  }

  try {
    const backendRes = await fetch(targetUrl, fetchOptions);
    const contentType = backendRes.headers.get('content-type') || 'application/json';
    const body = await backendRes.text();

    const clientRes = new NextResponse(body, {
      status: backendRes.status,
      headers: {
        'content-type': contentType,
      },
    });

    // Forward Set-Cookie headers from Spring Boot session
    const setCookie = backendRes.headers.get('set-cookie');
    if (setCookie) {
      clientRes.headers.set('set-cookie', setCookie);
    }

    return clientRes;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Backend unreachable';
    return NextResponse.json(
      {
        success: false,
        message: `Spring Boot backend proxy error: ${message}`,
        timestamp: new Date().toISOString(),
      },
      { status: 502 }
    );
  }
}
