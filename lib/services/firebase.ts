// lib/services/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// فحص أمان أولي لبيانات الاعتماد قبل التهيئة لمنع انهيار Next.js أثناء Build Time
const hasValidConfig = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.length > 5 &&
  !firebaseConfig.apiKey.includes("your-") &&
  !firebaseConfig.apiKey.includes("AIzaSy_demo_key") &&
  firebaseConfig.apiKey !== "undefined"
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let dbRealtime: Firestore | null = null;

if (hasValidConfig) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    try {
      auth = getAuth(app);
    } catch {
      auth = null;
    }
    try {
      dbRealtime = getFirestore(app);
    } catch {
      dbRealtime = null;
    }
  } catch {
    app = null;
    auth = null;
    dbRealtime = null;
  }
}

// خدمة الهوية والمحررين البشريين (RBAC) وخدمة البث الفوري
export { app, auth, dbRealtime };
export default app;
