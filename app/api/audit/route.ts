import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const { action, resource, portalId, status, details, actorId, institutionId, previousState, newState } = payload;

    const serverTimestamp = new Date().toISOString();
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Unknown User-Agent';
    const auditId = `aud_srv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const logEntry = {
      id: auditId,
      timestamp: serverTimestamp,
      action: action || 'UNKNOWN_ACTION',
      resource: resource || 'UNKNOWN_RESOURCE',
      portalId: portalId || 'CORE',
      status: status || 'GRANTED',
      details: details || '',
      actorId: actorId || 'SYSTEM_ACTOR',
      institutionId: institutionId || 'inst_apex_tvet',
      ipAddress: clientIp,
      userAgent,
      previousState: previousState || null,
      newState: newState || null
    };

    return NextResponse.json({
      success: true,
      log: logEntry
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Audit generation failed: ' + err.message }, { status: 500 });
  }
}
