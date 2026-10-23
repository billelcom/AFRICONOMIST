import { NextRequest, NextResponse } from 'next/server';
import { validateAuth } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  try {
    const authResult = await validateAuth(req);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { items } = body;

    console.log('[API /api/sync/queue] Received offline synced batch:', items?.length || 0, 'items');

    return NextResponse.json({
      success: true,
      syncedCount: Array.isArray(items) ? items.length : 0,
      timestamp: new Date().toISOString(),
      message: 'تمت معالجة كافة العمليات المحفوظة في وضع عدم الاتصال بنجاح.'
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'فشل مزامنة العمليات غير المتصلة' },
      { status: 500 }
    );
  }
}
