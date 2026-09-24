// src/lib/services/mongodb.ts
import { MongoClient, Db } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let lastAuthFailTimestamp = 0;
let lastConnectionError: string | null = null;
const AUTH_RETRY_COOLDOWN_MS = 10000; // 10s cooldown before retrying bad credentials to prevent log spam

export function getLastConnectionError(): string | null {
  return lastConnectionError;
}

export async function connectToDatabase(): Promise<{ client: MongoClient | null; db: Db | null }> {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "africonomist";

  // فحص ما إذا كان الرابط غير معرف أو يحتوي على قيم افتراضية غير حقيقية
  if (!uri || uri.includes("username:password") || uri.includes("<password>")) {
    return { client: null, db: null };
  }

  // إذا كانت بيانات الدخول فشلت مؤخراً، نتجنب تكرار محاولات الاتصال الفاشلة في كل طلب
  if (lastAuthFailTimestamp > 0 && Date.now() - lastAuthFailTimestamp < AUTH_RETRY_COOLDOWN_MS) {
    return { client: null, db: null };
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = new MongoClient(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });

    await client.connect();
    const db = client.db(dbName);

    cachedClient = client;
    cachedDb = db;
    lastAuthFailTimestamp = 0;
    lastConnectionError = null;

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
      console.warn(
        "[MongoDB Atlas] Authentication failed with provided credentials. Running in local fallback state."
      );
    } else {
      console.warn("[MongoDB Atlas] Connection deferred:", errorMessage);
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
