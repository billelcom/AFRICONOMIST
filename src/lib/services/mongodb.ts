// src/lib/services/mongodb.ts
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || "africonomist";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient | null; db: Db | null }> {
  if (!uri) {
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

    return { client, db };
  } catch (error) {
    console.warn("MongoDB connection deferred or timed out:", error);
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
