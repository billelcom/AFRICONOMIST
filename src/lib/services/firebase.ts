// src/lib/services/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSy_demo_key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "africonomist-demo.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "africonomist-demo",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "africonomist-demo.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef",
};

// منع إعادة التهيئة عند التحديث السريع (Hot Reload)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// خدمة الهوية والمحررين البشريين (RBAC)
export const auth = getAuth(app);

// خدمة البث الفوري للأسواق ومؤشرات العملات
export const dbRealtime = getFirestore(app);

export default app;
