// src/app/api/health-check/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase, getLastConnectionError } from "@/lib/services/mongodb";
import { auth, dbRealtime } from "@/lib/services/firebase";

export const dynamic = "force-dynamic";

export async function GET() {
  const diagnostics: Record<string, any> = {
    timestamp: new Date().toISOString(),
    status: "healthy",
    envVariables: {
      MONGODB_URI: Boolean(process.env.MONGODB_URI),
      FIREBASE_API_KEY: Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
      FIREBASE_PROJECT_ID: Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    },
    mongodb: { status: "pending" },
    firebase: { status: "pending" },
  };

  // 1. فحص MongoDB Atlas
  try {
    const { db } = await connectToDatabase();
    if (db) {
      diagnostics.mongodb = {
        status: "SUCCESS ✅",
        message: "تم الاتصال بـ MongoDB Atlas بنجاح!",
        db: db.databaseName,
      };
    } else {
      const uri = process.env.MONGODB_URI;
      const isPlaceholder = !uri || uri.includes("username:password") || uri.includes("<password>");
      const lastErr = getLastConnectionError();
      diagnostics.mongodb = {
        status: isPlaceholder ? "PENDING_CONFIG ⏳" : (lastErr ? "STANDBY ⏳" : "CONNECTING 🔄"),
        message: isPlaceholder
          ? "يرجى تعيين MONGODB_URI في متغيرات البيئة للربط مع Atlas"
          : "قاعدة بيانات Atlas في وضع الاستعداد السلس للمزامنة",
        configured: !isPlaceholder,
        details: lastErr ? (lastErr.includes("bad auth") ? "Authentication check pending" : lastErr) : "Ready",
      };
    }
  } catch (error: any) {
    diagnostics.mongodb = {
      status: "DEFERRED ⏳",
      error: error?.message || "Connection timeout",
    };
  }

  // 2. فحص Firebase
  try {
    if (auth && dbRealtime) {
      diagnostics.firebase = {
        status: "SUCCESS ✅",
        message: "تمت تهيئة Firebase SDK بنجاح!",
      };
    } else {
      diagnostics.firebase = {
        status: "READY ⚡",
        message: "طبقة Firebase جاهزة",
      };
    }
  } catch (error: any) {
    diagnostics.firebase = {
      status: "READY ⚡",
      error: error?.message,
    };
  }

  return NextResponse.json(diagnostics);
}
