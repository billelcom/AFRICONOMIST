import { NextResponse } from "next/server";
import { getArticlesCollection } from "@/lib/services/mongodb";
import { validateAuth } from "@/lib/auth-server";
import { pruneArticleReferencesAcrossUsers } from "@/lib/integrity-service";
import { deleteArticle } from "@/lib/services/article-service";

export const dynamic = "force-dynamic";

// GET: جلب المقالات (الخاصية التلقائية مجمدة حالياً)
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

// POST: حفظ مسودة مقال جديدة (مؤمنة للمحررين فقط)
export async function POST(req: Request) {
  try {
    // ⚠️ حماية الخادم: التحقق من الصلاحيات قبل المعالجة
    const auth = await validateAuth(req, ['ADMIN', 'SUPERVISOR', 'EDITOR']);
    if (!auth) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بتنفيذ هذا الإجراء" }, { status: 401 });
    }

    const body = await req.json();
    const collection = await getArticlesCollection();
    if (!collection) {
      return NextResponse.json({ success: false, error: "قاعدة بيانات MongoDB غير متصلة" }, { status: 503 });
    }

    const articleData = {
      ...body,
      status: "pending_review", // فرض حالة المراجعة دائماً عند الحفظ الأولي
      created_at: new Date().toISOString(),
      author_uid: auth.uid
    };

    const result = await collection.insertOne(articleData);
    return NextResponse.json({ success: true, message: "تم حفظ المسودة بنجاح", result });
  } catch (error: any) {
    console.error("Error saving article:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH: اعتماد التقرير أو رفضه (مؤمنة للمشرفين والمحررين فقط)
export async function PATCH(req: Request) {
  try {
    // ⚠️ حماية الخادم: التحقق من الصلاحيات قبل التعديل
    const auth = await validateAuth(req, ['ADMIN', 'SUPERVISOR', 'EDITOR']);
    if (!auth) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بتعديل حالة المقالات" }, { status: 401 });
    }

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
            published_at: new Date().toISOString(),
            reviewed_by_uid: auth.uid
          } 
        }
      );
      return NextResponse.json({ success: true, message: "تم نشر المقال بنجاح!", updateResult });
    } else if (action === "reject") {
      const updateResult = await collection.updateOne(
        { id },
        { 
          $set: { 
            status: "rejected",
            reviewed_by_uid: auth.uid
          } 
        }
      );

      // 🧹 Integrity: Prune references in Firebase when rejected
      await pruneArticleReferencesAcrossUsers(id, true).catch(err => 
        console.error("[API] Proactive prune failed:", err)
      );

      return NextResponse.json({ success: true, message: "تم رفض المقال وتأجيله", updateResult });
    }

    return NextResponse.json({ success: false, error: "إجراء غير معروف" }, { status: 400 });
  } catch (error: any) {
    console.error("Error updating article:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: حذف المقال نهائياً من كافة الأنظمة (مؤمنة للمشرفين والأدمن فقط)
export async function DELETE(req: Request) {
  try {
    const auth = await validateAuth(req, ['ADMIN', 'SUPERVISOR']);
    if (!auth) {
      return NextResponse.json({ success: false, error: "غير مصرح لك بحذف المقالات" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "معرف المقال مطلوب للحذف" }, { status: 400 });
    }

    const result = await deleteArticle(id, true);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "تم حذف المقال وتطهير كافة المراجع بنجاح",
      details: result
    });
  } catch (error: any) {
    console.error("Error deleting article:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

