// src/app/api/push/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { pushSubscriptionsStore, StoredSubscription } from '../../../../lib/pwa/webPushServer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subscription } = body;

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'بيانات الاشتراك غير مكتملة / Invalid subscription payload' },
        { status: 400 }
      );
    }

    // Check if subscription already exists
    const exists = pushSubscriptionsStore.find(
      (s) => s.subscription.endpoint === subscription.endpoint
    );

    if (!exists) {
      const newSub: StoredSubscription = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        subscription,
        createdAt: new Date().toISOString(),
        userAgent: req.headers.get('user-agent') || 'Unknown'
      };
      pushSubscriptionsStore.push(newSub);
    }

    return NextResponse.json({
      success: true,
      message: 'تم تفعيل التنبيهات اللحظية لصحيفة لافريكونوميست بنجاح!',
      totalSubscribers: pushSubscriptionsStore.length
    });
  } catch (err: any) {
    console.error('[API /api/push/subscribe] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'فشل تسجيل الاشتراك' },
      { status: 500 }
    );
  }
}
