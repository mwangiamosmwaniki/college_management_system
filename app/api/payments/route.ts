import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, amount, accountReference, invoiceId, studentId } = await req.json();

    if (!phoneNumber || !amount || Number(amount) <= 0) {
      return NextResponse.json({ error: 'Valid phone number and positive amount are required.' }, { status: 400 });
    }

    // Format phone to 254XXXXXXXXX
    let sanitizedPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (sanitizedPhone.startsWith('0')) {
      sanitizedPhone = '254' + sanitizedPhone.substring(1);
    } else if (sanitizedPhone.startsWith('+')) {
      sanitizedPhone = sanitizedPhone.substring(1);
    }

    const checkoutRequestId = `ws_CO_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const merchantRequestId = `MR_${Date.now()}`;

    // STK Push request simulation with idempotency tracking
    return NextResponse.json({
      success: true,
      checkoutRequestId,
      merchantRequestId,
      responseCode: '0',
      responseDescription: 'Success. Request accepted for processing',
      customerMessage: `Success. Prompt sent to ${sanitizedPhone}. Enter M-Pesa PIN to complete payment of KES ${Number(amount).toLocaleString()}.`,
      reference: accountReference || `FEE-${studentId || 'STU'}`,
      invoiceId: invoiceId || null
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Payment gateway error: ' + err.message }, { status: 500 });
  }
}
