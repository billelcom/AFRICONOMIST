import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();
export const dbRealtime = db;

// Connection test as required by skill
async function testConnection() {
  try {
    // Attempting to get a non-existent doc to verify connectivity
    await getDocFromServer(doc(db, '_system_', 'connectivity_test'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firebase connection test failed: Client is offline.");
    }
    // "Missing or insufficient permissions" is actually a success for connectivity
    // as it means we reached the server and rules blocked us.
  }
}

if (typeof window !== 'undefined') {
  testConnection();
}

export { signInWithPopup, signOut };
