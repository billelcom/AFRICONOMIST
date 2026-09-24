// src/app/api/cron/trigger/route.ts
import { NextResponse } from 'next/server';
import { generateRandomAutonomousReport } from '@/lib/services/articleGenerator';

export const dynamic = "force-dynamic";
export const maxDuration = 30; // زيادة وقت التنفيذ المسموح به في Vercel

/**
 * معالج Webhook المجدول للـ Cron كل 30 دقيقة
 * متوافق 100% مع خطة Vercel Hobby عند استدعائه عبر:
 * 1. GitHub Actions Workflow (مجاني تماماً كل 30 دقيقة)
 * 2. Cron-job.org (مجاني تماماً)
 * 3. EasyCron أو Upstash QStash
 * 4. لوحة المشرف المفتوحة
 */
async function handleCronTrigger(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const keyFromQuery = searchParams.get('key') || searchParams.get('secret');
    const authHeader = req.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    const expectedSecret = process.env.CRON_SECRET;

    // إذا تم تعيين سر في متغيرات البيئة، نتأكد من تطابقه لحماية السيرفر من السبام
    if (expectedSecret && expectedSecret.trim() !== '') {
      const providedSecret = keyFromQuery || bearerToken;
      if (providedSecret !== expectedSecret) {
        return NextResponse.json({
          success: false,
          error: "Unauthorized: Invalid CRON_SECRET token. Provide ?key=... or Authorization: Bearer <token>"
        }, { status: 401 });
      }
    }

    console.log("⚡ [Cron Trigger] Executing periodic 30-minute generation cycle...");
    const report = await generateRandomAutonomousReport();

    return NextResponse.json({
      success: true,
      mode: "autonomous_30min_cron",
      timestamp: new Date().toISOString(),
      message: `تم تشغيل دورة التوليد بنجاح لـ ${report.country} (${report.journalisticType})`,
      article: {
        id: report.id,
        title: report.title,
        country: report.country,
        sector: report.sector,
        genre: report.journalisticType,
        status: report.status,
        created_at: report.created_at
      }
    });

  } catch (error: any) {
    console.error("Cron trigger error:", error);
    return NextResponse.json({
      success: false,
      error: error?.message || "Internal server error during cron cycle execution"
    }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return handleCronTrigger(req);
}

export async function POST(req: Request) {
  return handleCronTrigger(req);
}
