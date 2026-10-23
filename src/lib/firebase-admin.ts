import { initializeApp, getApps, getApp, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let app: App;

if (!getApps().length) {
  app = initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
} else {
  app = getApp();
}

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
export { app as adminApp };
