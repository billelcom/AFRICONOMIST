// src/app/api/push/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendNotificationToAll } from '../../../../lib/pwa/webPushServer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, body: msgBody, url } = body;

    const result = await sendNotificationToAll({
      title: title || 'لافريكونوميست | عاجل أسواق المال',
      body: msgBody || 'صدر تقرير استقصائي جديد حول السياسات النقدية وسندات السيادة الإفريقية.',
      url: url || '/?tab=editorial'
    });

    return NextResponse.json({
      success: true,
      message: `تم إرسال الإشعار لـ ${result.attempted} مستخدمين نشطين`,
      result
    });
  } catch (err: any) {
    console.error('[API /api/push/send] Error:', err);
    return NextResponse.json(
      { error: err?.message || 'فشل إرسال الإشعار' },
      { status: 500 }
    );
  }
}
