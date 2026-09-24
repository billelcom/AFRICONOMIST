// lib/services/mongodb.ts
import { MongoClient, Db } from "mongodb";
import fs from "fs";
import path from "path";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let lastAuthFailTimestamp = 0;
let lastConnectionError: string | null = null;
const AUTH_RETRY_COOLDOWN_MS = 15000;

export function getLastConnectionError(): string | null {
  return lastConnectionError;
}

/**
 * دالة ذكية لاسترجاع رابط الاتصال بـ MongoDB Atlas
 * تفضل القيمة الصحيحة من .env.local لتفادي أي تشويه قد يحدث في متغيرات الحاوية
 */
function getResolvedMongoUri(): string | undefined {
  try {
    const envLocalPath = path.resolve(process.cwd(), ".env.local");
    if (fs.existsSync(envLocalPath)) {
      const content = fs.readFileSync(envLocalPath, "utf8");
      const match = content.match(/^MONGODB_URI\s*=\s*(.+)$/m);
      if (match && match[1]) {
        const localUri = match[1].trim().replace(/^['"]|['"]$/g, "");
        if (localUri && !localUri.includes("username:password") && !localUri.includes("<password>")) {
          return localUri;
        }
      }
    }
  } catch {
    // تجاهل في بيئة المتصفح أو الأخطاء العابرة
  }

  return process.env.MONGODB_URI;
}

export async function connectToDatabase(): Promise<{ client: MongoClient | null; db: Db | null }> {
  const uri = getResolvedMongoUri();
  const dbName = process.env.MONGODB_DB_NAME || "africonomist";

  // فحص ما إذا كان الرابط غير معرف أو يحتوي على قيم افتراضية غير حقيقية
  if (!uri || uri.includes("username:password") || uri.includes("<password>")) {
    return { client: null, db: null };
  }

  // إذا كانت بيانات الدخول فشلت مؤخراً، ننتظر فترة الهدوء لتفادي التكرار
  if (lastAuthFailTimestamp > 0 && Date.now() - lastAuthFailTimestamp < AUTH_RETRY_COOLDOWN_MS) {
    return { client: null, db: null };
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = new MongoClient(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    });

    await client.connect();
    const db = client.db(dbName);

    cachedClient = client;
    cachedDb = db;
    lastAuthFailTimestamp = 0;
    lastConnectionError = null;
    process.env.MONGODB_URI = uri; // مزامنة المتغير للرابط الفعال

    return { client, db };
  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    lastConnectionError = errorMessage;
    const isAuthError =
      error?.codeName === "AtlasError" ||
      errorMessage.includes("bad auth") ||
      errorMessage.includes("authentication failed") ||
      errorMessage.includes("AuthenticationFailed");

    if (isAuthError) {
      lastAuthFailTimestamp = Date.now();
    }

    return { client: null, db: null };
  }
}

// دالة مساعدة لجلب مجموعة المقالات بأمان تام
export async function getArticlesCollection() {
  try {
    const { db } = await connectToDatabase();
    if (!db) {
      return null;
    }
    return db.collection("articles");
  } catch {
    return null;
  }
}
