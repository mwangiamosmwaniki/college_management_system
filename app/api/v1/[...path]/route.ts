import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_USERS } from '@/lib/mock-data';

// Determine if an external backend is configured (exclude port 8080 which is Nginx in this container)
const RAW_BACKEND_URL = process.env.BACKEND_API_URL?.trim();
const HAS_EXTERNAL_BACKEND = Boolean(
  RAW_BACKEND_URL &&
  !RAW_BACKEND_URL.includes('localhost:8080') &&
  !RAW_BACKEND_URL.includes('127.0.0.1:8080') &&
  !RAW_BACKEND_URL.includes(':3000')
);

// Known seed accounts matching institutional TVET / College standards
const SEED_DIRECTORY: Record<string, {
  userId: string;
  identifier: string;
  email: string;
  fullName: string;
  roles: string[];
  permissions: string[];
  institutionId: string;
}> = {
  'adm-001': {
    userId: 'usr_admin',
    identifier: 'ADM-001',
    email: 'admin@apex.edu',
    fullName: 'Dr. Elizabeth Mutua',
    roles: ['ADMIN'],
    permissions: ['SYSTEM_ADMIN', 'FINANCE_MANAGE', 'ACADEMICS_MANAGE', 'ADMISSIONS_MANAGE', 'HR_MANAGE'],
    institutionId: 'inst_apex_tvet'
  },
  'admin@apex.edu': {
    userId: 'usr_admin',
    identifier: 'ADM-001',
    email: 'admin@apex.edu',
    fullName: 'Dr. Elizabeth Mutua',
    roles: ['ADMIN'],
    permissions: ['SYSTEM_ADMIN', 'FINANCE_MANAGE', 'ACADEMICS_MANAGE', 'ADMISSIONS_MANAGE', 'HR_MANAGE'],
    institutionId: 'inst_apex_tvet'
  },
  'lec-cs-104': {
    userId: 'usr_lecturer',
    identifier: 'LEC-CS-104',
    email: 'p.mwangi@apex.edu',
    fullName: 'Eng. Patrick Mwangi',
    roles: ['LECTURER'],
    permissions: ['COURSE_VIEW', 'COURSE_EDIT', 'MARKS_ENTER', 'STUDENT_VIEW', 'LMS_INSTRUCTOR'],
    institutionId: 'inst_apex_tvet'
  },
  'p.mwangi@apex.edu': {
    userId: 'usr_lecturer',
    identifier: 'LEC-CS-104',
    email: 'p.mwangi@apex.edu',
    fullName: 'Eng. Patrick Mwangi',
    roles: ['LECTURER'],
    permissions: ['COURSE_VIEW', 'COURSE_EDIT', 'MARKS_ENTER', 'STUDENT_VIEW', 'LMS_INSTRUCTOR'],
    institutionId: 'inst_apex_tvet'
  },
  'bursar-02': {
    userId: 'usr_finance',
    identifier: 'BURSAR-02',
    email: 'finance@apex.edu',
    fullName: 'CPA Moses Cheruiyot',
    roles: ['FINANCE'],
    permissions: ['FINANCE_VIEW', 'FINANCE_MANAGE', 'FEE_COLLECTION', 'PAYMENT_RECONCILE', 'INVOICE_CREATE'],
    institutionId: 'inst_apex_tvet'
  },
  'finance@apex.edu': {
    userId: 'usr_finance',
    identifier: 'BURSAR-02',
    email: 'finance@apex.edu',
    fullName: 'CPA Moses Cheruiyot',
    roles: ['FINANCE'],
    permissions: ['FINANCE_VIEW', 'FINANCE_MANAGE', 'FEE_COLLECTION', 'PAYMENT_RECONCILE', 'INVOICE_CREATE'],
    institutionId: 'inst_apex_tvet'
  },
  'stu-2026-001': {
    userId: 'usr_student',
    identifier: 'STU-2026-001',
    email: 'john.kariuki@students.apex.edu',
    fullName: 'John Kariuki',
    roles: ['STUDENT'],
    permissions: ['STUDENT_PORTAL_ACCESS', 'FEE_VIEW', 'EXAM_VIEW', 'COURSE_REGISTER', 'LMS_LEARNER'],
    institutionId: 'inst_apex_tvet'
  },
  'cit/0042/2024': {
    userId: 'usr_student',
    identifier: 'CIT/0042/2024',
    email: 'john.kariuki@students.apex.edu',
    fullName: 'John Kariuki',
    roles: ['STUDENT'],
    permissions: ['STUDENT_PORTAL_ACCESS', 'FEE_VIEW', 'EXAM_VIEW', 'COURSE_REGISTER', 'LMS_LEARNER'],
    institutionId: 'inst_apex_tvet'
  },
  'staff-dean-01': {
    userId: 'usr_dean',
    identifier: 'STAFF-DEAN-01',
    email: 'dean.academics@apex.edu',
    fullName: 'Prof. Geoffrey Kamau',
    roles: ['DEAN', 'LECTURER'],
    permissions: ['MARKS_MODERATE', 'MARKS_APPROVE', 'RESULTS_PUBLISH', 'AUDIT_VIEW'],
    institutionId: 'inst_apex_tvet'
  }
};

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

  // 2. Built-in institutional route handling
  if (targetPath === 'auth/login' && req.method === 'POST') {
    try {
      const body = await req.json();
      const trimmedId = String(body.identifier || '').trim();
      const cleanKey = trimmedId.toLowerCase();
      const password = body.password || '';

      const matched =
        SEED_DIRECTORY[cleanKey] ||
        (() => {
          const u = INITIAL_USERS.find(
            (user) =>
              user.identifier.toLowerCase() === cleanKey ||
              user.email.toLowerCase() === cleanKey ||
              user.id.toLowerCase() === cleanKey
          );
          if (!u) return null;
          return {
            userId: u.id,
            identifier: u.identifier,
            email: u.email,
            fullName: u.name,
            roles: u.portalAssignments.map((p) => p.portalId),
            permissions: u.portalAssignments.map((p) => p.roleId),
            institutionId: body.tenantId || 'inst_apex_tvet',
          };
        })();

      if (!matched) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid credentials. User not found in institutional directory.',
          },
          { status: 401 }
        );
      }

      if (password !== 'Password123!' && password.length < 4) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid password. Institutional default is Password123!',
          },
          { status: 401 }
        );
      }

      const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      const resData = {
        sessionId,
        userId: matched.userId,
        identifier: matched.identifier,
        email: matched.email,
        fullName: matched.fullName,
        roles: matched.roles,
        permissions: matched.permissions,
        institutionId: matched.institutionId,
      };

      const response = NextResponse.json({
        success: true,
        message: 'Authentication successful',
        data: resData,
      });

      response.cookies.set('erp_session_id', sessionId, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Auth processing failed';
      return NextResponse.json({ success: false, message }, { status: 400 });
    }
  }

  if (targetPath === 'auth/me' && req.method === 'GET') {
    const defaultUser = SEED_DIRECTORY['adm-001'];
    return NextResponse.json({
      success: true,
      data: {
        userId: defaultUser.userId,
        identifier: defaultUser.identifier,
        email: defaultUser.email,
        fullName: defaultUser.fullName,
        roles: defaultUser.roles,
        permissions: defaultUser.permissions,
        institutionId: defaultUser.institutionId,
      },
    });
  }

  if (targetPath === 'auth/logout' && req.method === 'POST') {
    const res = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
      data: null,
    });
    res.cookies.delete('erp_session_id');
    return res;
  }

  // Fallback for all other endpoints to guarantee standard JSON response
  return NextResponse.json({
    success: true,
    message: `Request processed by institutional gateway (${targetPath})`,
    data: [],
    timestamp: new Date().toISOString(),
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
    'x-request-id',
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
        'content-type': contentType,
      },
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
        message: `Institutional backend proxy error: ${message}`,
        timestamp: new Date().toISOString(),
      },
      { status: 502 }
    );
  }
}
