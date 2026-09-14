import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/server/backend-proxy';

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/api/v1/auth/login');
}

export async function GET(req: NextRequest) {
  return proxyToBackend(req, '/api/v1/auth/me');
}

export async function DELETE(req: NextRequest) {
  return proxyToBackend(req, '/api/v1/auth/logout');
}
