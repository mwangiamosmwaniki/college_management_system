import { NextRequest, NextResponse } from 'next/server';
import {
  authenticateWithBackend,
  getSessionFromRequest,
  invalidateSession
} from '@/lib/server/auth-store';

// Determine if a real, external backend URL is provided (must NOT be localhost:8080 or 127.0.0.1:8080 which is Nginx in this container)
const RAW_BACKEND_URL = process.env.BACKEND_API_URL?.trim();
const HAS_EXTERNAL_BACKEND = Boolean(
  RAW_BACKEND_URL &&
  !RAW_BACKEND_URL.includes('localhost:8080') &&
  !RAW_BACKEND_URL.includes('127.0.0.1:8080') &&
  !RAW_BACKEND_URL.includes(':3000')
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password, tenantId } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: 'Institutional identifier and password are required.' },
        { status: 400 }
      );
    }

    const trimmedId = String(identifier).trim();

    // 1. If an external backend is configured, proxy request directly
    if (HAS_EXTERNAL_BACKEND && RAW_BACKEND_URL) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const backendRes = await fetch(`${RAW_BACKEND_URL}/api/v1/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: trimmedId, password, tenantId }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const contentType = backendRes.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await backendRes.json();
          const res = NextResponse.json(data, { status: backendRes.status });
          const setCookie = backendRes.headers.get('set-cookie');
          if (setCookie) {
            res.headers.set('set-cookie', setCookie);
          }
          return res;
        }

        // If backend returned non-JSON error
        return NextResponse.json(
          { success: false, error: 'Unable to sign you in right now. Please try again.' },
          { status: 502 }
        );
      } catch {
        // Backend unavailable: do NOT authenticate locally when backend was expected
        return NextResponse.json(
          { success: false, error: 'Unable to sign you in right now. Please try again.' },
          { status: 502 }
        );
      }
    }

    // 2. Perform authoritative BCrypt authentication against institutional database
    const authResult = await authenticateWithBackend(trimmedId, String(password), tenantId);

    if (!authResult.success || !authResult.session) {
      return NextResponse.json(
        { success: false, error: authResult.message },
        { status: authResult.statusCode }
      );
    }

    const session = authResult.session;

    const response = NextResponse.json(
      {
        success: true,
        message: 'Institutional credentials verified successfully.',
        data: {
          sessionId: session.sessionId,
          userId: session.userId,
          id: session.userId,
          identifier: session.identifier,
          email: session.email,
          fullName: session.fullName,
          name: session.fullName,
          institutionId: session.institutionId,
          institution: 'Apex National Polytechnic',
          department: session.department,
          faculty: session.faculty,
          campus: session.campus,
          status: session.status,
          roles: session.roles,
          permissions: session.permissions,
          portalAssignments: session.portalAssignments
        }
      },
      { status: 200 }
    );

    // Set secure HTTP-only session cookies
    response.cookies.set('erp_session_id', session.sessionId, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.set('COLLEGE_ERP_SESSION', session.sessionId, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown institutional authentication error';
    return NextResponse.json(
      { success: false, error: `Authentication service error: ${message}` },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  // If proxying to external backend
  if (HAS_EXTERNAL_BACKEND && RAW_BACKEND_URL) {
    try {
      const backendRes = await fetch(`${RAW_BACKEND_URL}/api/v1/auth/me`, {
        headers: {
          cookie: req.headers.get('cookie') || '',
          authorization: req.headers.get('authorization') || '',
        },
      });
      const data = await backendRes.json();
      return NextResponse.json(data, { status: backendRes.status });
    } catch {
      return NextResponse.json(
        { success: false, error: 'Authentication service unavailable.' },
        { status: 502 }
      );
    }
  }

  const session = getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: No active session found.' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      id: session.userId,
      userId: session.userId,
      identifier: session.identifier,
      email: session.email,
      fullName: session.fullName,
      name: session.fullName,
      institutionId: session.institutionId,
      department: session.department,
      faculty: session.faculty,
      campus: session.campus,
      status: session.status,
      roles: session.roles,
      permissions: session.permissions,
      portalAssignments: session.portalAssignments
    }
  });
}

export async function DELETE(req: NextRequest) {
  const session = getSessionFromRequest(req);
  if (session) {
    invalidateSession(session.sessionId);
  }

  const res = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
    data: null
  });

  res.cookies.delete('erp_session_id');
  res.cookies.delete('COLLEGE_ERP_SESSION');
  return res;
}
