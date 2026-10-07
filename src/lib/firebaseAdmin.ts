import "server-only";
import { App, getApps, initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";
import { getMessaging, Messaging } from "firebase-admin/messaging";
import { validateFirebaseAdminEnv } from "./env";

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;
let adminMessaging: Messaging | null = null;

/**
 * Normalizes a PEM private key:
 * - Trims whitespace
 * - Strips accidental surrounding quotes
 * - Replaces escaped literal "\\n" with actual newline characters
 * - Converts CRLF to LF
 */
export function normalizePrivateKey(raw: string): string {
  let key = raw.trim();

  // Strip wrapping quotes if inserted by some env formatters
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }
  if (key.startsWith("'") && key.endsWith("'")) {
    key = key.slice(1, -1);
  }

  // Critical fix for Vercel multiline private keys
  key = key.replace(/\\n/g, "\n");
  key = key.replace(/\r\n/g, "\n");

  return key.trim();
}

/**
 * Check if admin credentials can be loaded without throwing.
 */
export function hasAdminCredentials(): boolean {
  if (
    process.env.FIREBASE_AUTH_EMULATOR_HOST !== undefined ||
    process.env.FIRESTORE_EMULATOR_HOST !== undefined
  ) {
    return true;
  }

  try {
    validateFirebaseAdminEnv();
    return true;
  } catch {
    return false;
  }
}

/**
 * Lazily initializes and returns the Firebase Admin App instance.
 * Guarded by `getApps().length` to avoid duplicate app errors in serverless environments.
 */
export function getAdminApp(): App {
  if (adminApp) return adminApp;

  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    return adminApp;
  }

  const { projectId, clientEmail, privateKey } = validateFirebaseAdminEnv();

  const serviceAccount: ServiceAccount = {
    projectId,
    clientEmail,
    privateKey: normalizePrivateKey(privateKey),
  };

  adminApp = initializeApp({
    credential: cert(serviceAccount),
    projectId,
  });

  return adminApp;
}

/**
 * Lazily returns the Firestore Admin instance.
 */
export function getAdminDb(): Firestore {
  if (adminDb) return adminDb;

  const app = getAdminApp();
  adminDb = getFirestore(app);
  try {
    adminDb.settings({ ignoreUndefinedProperties: true });
  } catch {
    // If settings already applied, ignore
  }
  return adminDb;
}

/**
 * Lazily returns the Firebase Auth Admin instance.
 */
export function getAdminAuth(): Auth {
  if (adminAuth) return adminAuth;
  const app = getAdminApp();
  adminAuth = getAuth(app);
  return adminAuth;
}

/**
 * Lazily returns the Firebase Messaging instance for Push Notifications.
 */
export function getAdminMessaging(): Messaging {
  if (adminMessaging) return adminMessaging;
  const app = getAdminApp();
  adminMessaging = getMessaging(app);
  return adminMessaging;
}
