import { App, getApps, initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

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

/**
 * Indicates if explicit service account credentials have been configured.
 * When false, avoids long ADC metadata lookup timeouts.
 */
export function hasAdminCredentials(): boolean {
  return (
    getServiceAccount() !== null ||
    process.env.FIREBASE_AUTH_EMULATOR_HOST !== undefined ||
    process.env.FIRESTORE_EMULATOR_HOST !== undefined
  );
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
    adminApp = initializeApp({
      projectId,
    });
  }

  return adminApp;
}

export function getAdminDb(): Firestore {
  if (adminDb) return adminDb;

  const app = getAdminApp();
  adminDb = getFirestore(app);
  try {
    adminDb.settings({ ignoreUndefinedProperties: true });
  } catch {
    // Ignore if already configured
  }
  return adminDb;
}

export function getAdminAuth(): Auth {
  if (adminAuth) return adminAuth;
  const app = getAdminApp();
  adminAuth = getAuth(app);
  return adminAuth;
}
