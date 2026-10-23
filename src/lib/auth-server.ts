// src/lib/auth-server.ts
import { adminAuth, adminDb } from "./firebase-admin";

export type ServerRole = 'READER' | 'EDITOR' | 'ADMIN' | 'SUPERVISOR';

export interface AuthValidationResult {
  uid: string;
  email?: string;
  role: ServerRole;
}

/**
 * Validates the Firebase ID Token from the request header and checks the user's role.
 */
export async function validateAuth(req: Request, allowedRoles?: ServerRole[]): Promise<AuthValidationResult | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Fetch role from Firestore (Server Side)
    const userDoc = await adminDb.collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return null;
    }

    const userData = userDoc.data();
    const role: ServerRole = (userData?.role?.toUpperCase() as ServerRole) || 'READER';

    if (allowedRoles && !allowedRoles.includes(role)) {
      return null;
    }

    return {
      uid,
      email: decodedToken.email,
      role
    };
  } catch (error) {
    console.error("Auth validation error:", error);
    return null;
  }
}
