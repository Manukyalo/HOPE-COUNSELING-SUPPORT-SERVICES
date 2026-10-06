import { App, getApps, initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

/**
 * Lazy initialization of Firebase Admin SDK.
 * CRITICAL: Environment variables are read only when getAdminDb() or getAdminAuth()
 * is called at request time — never at module evaluation time.
 * This guarantees Next.js build-time page rendering will never fail.
 */

let adminApp: App | null = null;

function getServiceAccount(): ServiceAccount | null {
  const jsonKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (jsonKey) {
    try {
      const parsed = JSON.parse(jsonKey);
      return parsed as ServiceAccount;
    } catch {
      // Might be base64 encoded
      try {
        const decoded = Buffer.from(jsonKey, "base64").toString("utf-8");
        return JSON.parse(decoded) as ServiceAccount;
      } catch (e) {
        console.error("[firebase-admin] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY", e);
      }
    }
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKey) {
    // Convert escaped newlines
    if (privateKey.includes("\\n")) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }
    return {
      projectId,
      clientEmail,
      privateKey,
    };
  }

  return null;
}

export function getAdminApp(): App {
  if (adminApp) return adminApp;

  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    return adminApp;
  }

  const serviceAccount = getServiceAccount();
  const projectId =
    (serviceAccount as { projectId?: string } | null)?.projectId ||
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "hope-counseling-cfea1";

  if (serviceAccount) {
    adminApp = initializeApp({
      credential: cert(serviceAccount),
      projectId,
    });
  } else {
    // Initialized with project ID (works if ADC / emulator / ambient credentials present)
    adminApp = initializeApp({
      projectId,
    });
  }

  return adminApp;
}

export function getAdminDb(): Firestore {
  const app = getAdminApp();
  const db = getFirestore(app);
  // Ensure timestamps are correctly handled
  db.settings({ ignoreUndefinedProperties: true });
  return db;
}

export function getAdminAuth(): Auth {
  const app = getAdminApp();
  return getAuth(app);
}
