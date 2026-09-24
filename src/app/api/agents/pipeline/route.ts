// src/app/api/agents/pipeline/route.ts
import { NextResponse } from 'next/server';
import { 
  generateReportPipeline, 
  generateRandomAutonomousReport, 
  AgentTaskRequest 
} from "@/lib/services/articleGenerator";

export const dynamic = "force-dynamic";

// دالة POST: التوليد التحريري الفوري بناءً على خيارات المشرف أو استدعاء يدوي
export async function POST(req: Request) {
  try {
    let body: AgentTaskRequest = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const report = await generateReportPipeline(body);

    return NextResponse.json({
      success: true,
      message: `تم إعداد التقرير بنجاح لدولة ${report.country} وفق نمط (${report.journalisticType}) لقطاع (${report.sector})`,
      report
    });

  } catch (error: any) {
    console.error("Agents pipeline POST error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || "Internal server error" 
    }, { status: 500 });
  }
}

// دالة GET: دورة الرصد التلقائي كل نصف ساعة (Autonomous Cron / Background Ingest)
export async function GET(req: Request) {
  try {
    const report = await generateRandomAutonomousReport();

    return NextResponse.json({
      success: true,
      mode: "autonomous_30min_cycle",
      message: `دورة الرصد نصف الساعية أنشأت بنجاح مسودة قيد المراجعة لدولة ${report.country}`,
      report
    });
  } catch (error: any) {
    console.error("Agents pipeline GET (cron) error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error?.message || "Internal server error in cron cycle" 
    }, { status: 500 });
  }
}
