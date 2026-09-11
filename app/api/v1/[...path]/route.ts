import { NextRequest, NextResponse } from 'next/server';
import {
  authenticateWithBackend,
  getSessionFromRequest,
  invalidateSession,
  getStudentData,
  getStudentInvoices,
  getInstitutionalUserList
} from '@/lib/server/auth-store';

// Determine if an external backend is configured (exclude port 8080 which is Nginx in this container)
const RAW_BACKEND_URL = process.env.BACKEND_API_URL?.trim();
const HAS_EXTERNAL_BACKEND = Boolean(
  RAW_BACKEND_URL &&
  !RAW_BACKEND_URL.includes('localhost:8080') &&
  !RAW_BACKEND_URL.includes('127.0.0.1:8080') &&
  !RAW_BACKEND_URL.includes(':3000')
);

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, await params);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, await params);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, await params);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, await params);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return handleRequest(req, await params);
}

async function handleRequest(req: NextRequest, { path }: { path: string[] }) {
  const targetPath = path.join('/');

  // 1. If external backend is available, proxy request
  if (HAS_EXTERNAL_BACKEND && RAW_BACKEND_URL) {
    return proxyRequest(req, targetPath);
  }

  // 2. Built-in authoritative institutional route handling
  // A. AUTH LOGIN
  if (targetPath === 'auth/login' && req.method === 'POST') {
    try {
      const body = await req.json();
      const { identifier, password, tenantId } = body;

      const authResult = await authenticateWithBackend(identifier, password, tenantId);

      if (!authResult.success || !authResult.session) {
        return NextResponse.json(
          {
            success: false,
            message: authResult.message
          },
          { status: authResult.statusCode }
        );
      }

      const session = authResult.session;

      const resData = {
        sessionId: session.sessionId,
        userId: session.userId,
        id: session.userId,
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
      };

      const response = NextResponse.json({
        success: true,
        message: 'Authentication successful',
        data: resData
      });

      response.cookies.set('erp_session_id', session.sessionId, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      });
      response.cookies.set('COLLEGE_ERP_SESSION', session.sessionId, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
      });

      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Auth processing failed';
      return NextResponse.json({ success: false, message }, { status: 400 });
    }
  }

  // B. AUTH ME (Authoritative current user from active session)
  if (targetPath === 'auth/me' && req.method === 'GET') {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: Session missing or expired'
        },
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

  // C. AUTH LOGOUT
  if (targetPath === 'auth/logout' && req.method === 'POST') {
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

  // Session check for protected domain resources
  const session = getSessionFromRequest(req);

  // D. STUDENTS / ME
  if (targetPath === 'students/me' && req.method === 'GET') {
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const result = getStudentData(session, 'me');
    return NextResponse.json(
      { success: result.allowed, data: result.data, error: result.error },
      { status: result.statusCode }
    );
  }

  // E. STUDENTS / ME / FEES
  if (targetPath === 'students/me/fees' && req.method === 'GET') {
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const result = getStudentInvoices(session);
    return NextResponse.json(
      { success: result.allowed, data: result.data, error: result.error },
      { status: result.statusCode }
    );
  }

  // F. STUDENTS / :ID (Strict IDOR protection)
  if (targetPath.startsWith('students/') && req.method === 'GET') {
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const requestedStudentId = targetPath.split('/')[1];
    const result = getStudentData(session, requestedStudentId);
    return NextResponse.json(
      { success: result.allowed, data: result.data, error: result.error },
      { status: result.statusCode }
    );
  }

  // G. STUDENTS DIRECTORY (Restricted to Staff)
  if (targetPath === 'students' && req.method === 'GET') {
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const isStaff = session.roles.some(r => ['ADMIN', 'LECTURER', 'FINANCE', 'DEAN'].includes(r));
    if (!isStaff) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Students cannot access the global student registry.' },
        { status: 403 }
      );
    }
    // Return staff student view
    return NextResponse.json({
      success: true,
      data: [
        {
          id: 'stu_john',
          identifier: 'CIT/0042/2024',
          name: 'John Kariuki',
          programme: 'BSc Computer Science & Information Technology',
          year: 'Year 2, Semester 2',
          gpa: 3.82,
          financialStatus: 'CLEARED'
        }
      ]
    });
  }

  // H. USERS DIRECTORY (Strictly restricted to Admin)
  if (targetPath === 'users' && req.method === 'GET') {
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const result = getInstitutionalUserList(session);
    return NextResponse.json(
      { success: result.allowed, data: result.data, error: result.error },
      { status: result.statusCode }
    );
  }

  // I. FINANCE SUMMARY (Restricted to Finance & Admin)
  if (targetPath.startsWith('finance') && req.method === 'GET') {
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    const isFinanceOrAdmin = session.roles.some(r => ['FINANCE', 'ADMIN'].includes(r));
    if (!isFinanceOrAdmin) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Insufficient financial governance privileges.' },
        { status: 403 }
      );
    }
    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: 24500000,
        outstandingReceivables: 4200000,
        reconciliationRate: 98.4,
        activeInvoicesCount: 142
      }
    });
  }

  // Default institutional response
  return NextResponse.json({
    success: true,
    message: `Request processed by institutional gateway (${targetPath})`,
    data: [],
    timestamp: new Date().toISOString()
  });
}

async function proxyRequest(req: NextRequest, targetPath: string) {
  const searchParams = req.nextUrl.searchParams.toString();
  const targetUrl = `${RAW_BACKEND_URL}/api/v1/${targetPath}${searchParams ? `?${searchParams}` : ''}`;

  const SAFE_HEADERS = new Set([
    'content-type',
    'accept',
    'cookie',
    'user-agent',
    'x-forwarded-for',
    'x-forwarded-proto',
    'x-request-id'
  ]);

  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    const lowerKey = key.toLowerCase();
    if (SAFE_HEADERS.has(lowerKey)) {
      headers[lowerKey] = value;
    }
  });

  const fetchOptions: RequestInit = {
    method: req.method,
    headers
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
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    fetchOptions.signal = controller.signal;

    const backendRes = await fetch(targetUrl, fetchOptions);
    clearTimeout(timeoutId);

    const contentType = backendRes.headers.get('content-type') || 'application/json';
    const body = await backendRes.text();

    const clientRes = new NextResponse(body, {
      status: backendRes.status,
      headers: {
        'content-type': contentType
      }
    });

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
        message: 'Unable to sign you in right now. Please try again.',
        error: message,
        timestamp: new Date().toISOString()
      },
      { status: 502 }
    );
  }
}
