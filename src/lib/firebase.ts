import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth,
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  signOut 
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

/**
 * Universal Auth initialization.
 * getAuth(app) is safe for both Client and Server in Next.js.
 * On the client, it automatically handles persistence.
 * On the server, it uses in-memory persistence.
 */
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

// Mobile-friendly configuration
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const dbRealtime = db;

// Connection test for client-side only
async function testConnection() {
  try {
    await getDocFromServer(doc(db, '_system_', 'connectivity_test'));
  } catch (error) {
    // Expected to fail if offline or no permissions, but confirms SDK is working
  }
}

if (typeof window !== 'undefined') {
  testConnection();
}

export { signInWithPopup, signInWithRedirect, getRedirectResult, signOut };
