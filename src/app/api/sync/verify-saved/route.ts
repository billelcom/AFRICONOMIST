import { NextRequest, NextResponse } from 'next/server';
import { validateAuth } from '@/lib/auth-server';
import { filterValidArticles } from '@/lib/integrity-service';

export async function POST(req: NextRequest) {
  try {
    const authResult = await validateAuth(req);
    if (!authResult) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { articleIds } = body;

    if (!Array.isArray(articleIds) || articleIds.length === 0) {
      return NextResponse.json({ existingIds: [] });
    }

    const existingIds = await filterValidArticles(articleIds);

    return NextResponse.json({
      success: true,
      existingIds
    });
  } catch (err: any) {
    console.error('[API /api/sync/verify-saved] Error:', err);
    return NextResponse.json(
      { error: 'فشل التحقق من المقالات المحفوظة' },
      { status: 500 }
    );
  }
}
