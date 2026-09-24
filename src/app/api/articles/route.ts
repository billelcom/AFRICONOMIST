import { NextResponse } from "next/server";
import { getArticlesCollection } from "@/lib/services/mongodb";

// GET: جلب المقالات
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const collection = await getArticlesCollection();
    if (!collection) {
      return NextResponse.json({ success: true, count: 0, articles: [], warning: "MongoDB URI not configured yet" });
    }

    const query = status ? { status } : {};
    const articles = await collection
      .find(query)
      .sort({ created_at: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ success: true, count: articles.length, articles });
  } catch (error: any) {
    console.warn("MongoDB connection fallback in /api/articles:", error?.message);
    return NextResponse.json({ success: true, count: 0, articles: [], warning: error?.message || "Database unavailable" });
  }
}

// PATCH: اعتماد التقرير أو رفضه
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, action } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "معرف المقال مطلوب" }, { status: 400 });
    }

    const collection = await getArticlesCollection();
    if (!collection) {
      return NextResponse.json({ success: false, error: "قاعدة بيانات MongoDB غير متصلة بعد" }, { status: 503 });
    }

    if (action === "publish") {
      const updateResult = await collection.updateOne(
        { id },
        { 
          $set: { 
            status: "published", 
            published_at: new Date().toISOString() 
          } 
        }
      );
      return NextResponse.json({ success: true, message: "تم نشر المقال بنجاح!", updateResult });
    } else if (action === "reject") {
      const updateResult = await collection.updateOne(
        { id },
        { $set: { status: "rejected" } }
      );
      return NextResponse.json({ success: true, message: "تم رفض المقال وتأجيله", updateResult });
    }

    return NextResponse.json({ success: false, error: "إجراء غير معروف" }, { status: 400 });
  } catch (error: any) {
    console.error("Error updating article:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
