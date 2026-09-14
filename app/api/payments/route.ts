import { NextRequest } from 'next/server';
import { proxyToBackend } from '@/lib/server/backend-proxy';

export async function POST(req: NextRequest) {
  return proxyToBackend(req, '/api/v1/finance/payments/mpesa/stk-push');
}


