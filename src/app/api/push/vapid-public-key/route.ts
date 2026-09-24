// src/app/api/push/vapid-public-key/route.ts
import { NextResponse } from 'next/server';
import { VAPID_PUBLIC_KEY } from '../../../../lib/pwa/webPushServer';

export async function GET() {
  return NextResponse.json({
    publicKey: VAPID_PUBLIC_KEY,
    status: 'active'
  });
}
