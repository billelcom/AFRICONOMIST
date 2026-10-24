import { NextRequest, NextResponse } from "next/server";
import { validateAuth } from "@/lib/auth-server";
import { runRejectedArticlesCleanup } from "@/lib/services/article-service";

/**
 * Maintenance API: Database Cleanup Utility
 * Securely triggers a comprehensive scan of MongoDB and Firebase to prune orphaned data.
 */

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // ⚠️ Strict Security: Maintenance is for Admins and Supervisors only
    const auth = await validateAuth(req, ['ADMIN', 'SUPERVISOR']);
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized maintenance request" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") || "rejected_only";

    console.log(`[Maintenance] Starting database cleanup. Mode: ${mode} Triggered by: ${auth.email}`);

    let result;
    if (mode === "rejected_only") {
      // Scans for 'rejected' articles in MongoDB and ensures they are pruned from Firebase
      result = await runRejectedArticlesCleanup(true);
    } else {
      return NextResponse.json({ success: false, error: "Unknown cleanup mode" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Database cleanup cycle completed successfully",
      summary: result,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("[Maintenance] Cleanup utility failed:", error);
    return NextResponse.json({
      success: false,
      error: "فشلت عملية تنظيف قاعدة البيانات التبادلية",
      details: error.message
    }, { status: 500 });
  }
}
