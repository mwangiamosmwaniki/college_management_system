import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_USERS } from '@/lib/mock-data';
import { hashPassword, verifyPassword } from '@/lib/security-crypto';

// In-memory rate limiting map for login attempts per IP / identifier
const loginAttempts: Record<string, { count: number; lockedUntil?: number }> = {};

// Hardcoded sample credentials map for standard demo/production evaluation
// Keyed by lowercase identifier or email, containing salt & hash for passwords
const USER_CREDENTIALS: Record<string, { salt: string; hash: string }> = {};

// Initialize standard passwords: 'Password123!' for each initial user
INITIAL_USERS.forEach(u => {
  const { salt, hash } = hashPassword('Password123!');
  USER_CREDENTIALS[u.identifier.toLowerCase()] = { salt, hash };
  USER_CREDENTIALS[u.email.toLowerCase()] = { salt, hash };
});

export async function POST(req: NextRequest) {
  try {
    const { identifier, password, tenantId } = await req.json();

    if (!identifier || typeof identifier !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Identifier and password are required.' },
        { status: 400 }
      );
    }

    const trimmedId = identifier.trim().toLowerCase();
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const rateLimitKey = `${clientIp}:${trimmedId}`;

    // Check account lockout
    const attemptRecord = loginAttempts[rateLimitKey];
    if (attemptRecord?.lockedUntil && attemptRecord.lockedUntil > Date.now()) {
      const waitSeconds = Math.ceil((attemptRecord.lockedUntil - Date.now()) / 1000);
      return NextResponse.json(
        { error: `Account locked due to excessive failed attempts. Please retry in ${waitSeconds} seconds.` },
        { status: 429 }
      );
    }

    // Locate user record
    const user = INITIAL_USERS.find(
      u => u.identifier.toLowerCase() === trimmedId || u.email.toLowerCase() === trimmedId
    );

    if (!user) {
      // Record failed attempt
      const current = attemptRecord?.count || 0;
      loginAttempts[rateLimitKey] = {
        count: current + 1,
        lockedUntil: current + 1 >= 5 ? Date.now() + 15 * 60 * 1000 : undefined
      };
      return NextResponse.json(
        { error: 'Invalid institutional credentials or unauthorized identity.' },
        { status: 401 }
      );
    }

    if (user.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: `Account is ${user.status.toLowerCase()}. Please contact Registry or Information Directorate.` },
        { status: 403 }
      );
    }

    // Verify Password
    const creds = USER_CREDENTIALS[trimmedId];
    if (!creds || !verifyPassword(password, creds.hash, creds.salt)) {
      const current = (attemptRecord?.count || 0) + 1;
      loginAttempts[rateLimitKey] = {
        count: current,
        lockedUntil: current >= 5 ? Date.now() + 15 * 60 * 1000 : undefined
      };
      return NextResponse.json(
        {
          error: current >= 5
            ? 'Account locked due to 5 failed attempts. Please contact Administrator.'
            : `Invalid password. Attempt ${current} of 5 before temporary lock.`
        },
        { status: 401 }
      );
    }

    // Reset rate limiter on successful authentication
    delete loginAttempts[rateLimitKey];

    // Generate secure session token (mock token representation)
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        identifier: user.identifier,
        name: user.name,
        email: user.email,
        department: user.department,
        institution: user.institution,
        portalAssignments: user.portalAssignments,
        status: user.status
      },
      sessionId,
      institutionId: tenantId || 'inst_apex_tvet'
    });

    // Set HTTP-only secure cookie
    response.cookies.set('erp_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8 // 8 hours session
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal authentication service error: ' + (err.message || 'unknown') },
      { status: 500 }
    );
  }
}
