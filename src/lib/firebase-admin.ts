import { App, getApps, initializeApp, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

/**
 * Normalizes a PEM private key:
 * - Trims whitespace
 * - Strips leading/trailing double or single quotes
 * - Replaces escaped literal "\n" with actual newline characters
 * - Converts CRLF to LF
 */
export function normalizePrivateKey(raw: string): string {
  let key = raw.trim();

  // Strip wrapping double quotes
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.slice(1, -1);
  }
  // Strip wrapping single quotes
  if (key.startsWith("'") && key.endsWith("'")) {
    key = key.slice(1, -1);
  }

  // Convert literal \n escapes to real newlines
  key = key.replace(/\\n/g, "\n");
  // Convert Windows CRLF to standard LF
  key = key.replace(/\r\n/g, "\n");

  return key.trim();
}

/**
 * Parses a JSON or base64-encoded service account credentials string.
 */
function parseServiceAccountString(raw: string): ServiceAccount | null {
  let trimmed = raw.trim();

  // Strip accidental wrapping quotes
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    trimmed = trimmed.slice(1, -1);
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    trimmed = trimmed.slice(1, -1);
  }

  let jsonStr = trimmed;
  // If not starting with '{', attempt base64 decode
  if (!trimmed.startsWith("{")) {
    try {
      jsonStr = Buffer.from(trimmed, "base64").toString("utf-8");
    } catch {
      jsonStr = trimmed;
    }
  }

  try {
    const parsed = JSON.parse(jsonStr) as Record<string, string>;
    const projectId = parsed.project_id || parsed.projectId;
    const clientEmail = parsed.client_email || parsed.clientEmail;
    const rawPrivateKey = parsed.private_key || parsed.privateKey;

    if (projectId && clientEmail && rawPrivateKey) {
      return {
        projectId,
        clientEmail,
        privateKey: normalizePrivateKey(rawPrivateKey),
      };
    }
  } catch {
    // Return null on JSON parse failure so caller can report appropriately
    return null;
  }

  return null;
}

/**
 * Reads service account credentials at request time (lazy).
 * If missing or invalid, throws a clear error identifying the exact missing variable name(s).
 */
function resolveCredentialsOrThrow(): ServiceAccount {
  // Option 1: Single JSON / base64 variable (preferred for Vercel)
  const jsonSource =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (jsonSource) {
    const parsed = parseServiceAccountString(jsonSource);
    if (parsed) {
      return parsed;
    }
    const varName = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
      ? "FIREBASE_SERVICE_ACCOUNT_JSON"
      : "FIREBASE_SERVICE_ACCOUNT_KEY";
    throw new Error(
      `Firebase Admin initialization failed: ${varName} was provided but could not be parsed as a valid service account JSON. Ensure it is valid JSON or base64-encoded JSON containing "project_id", "client_email", and "private_key".`
    );
  }

  // Option 2: Individual variables
  const missing: string[] = [];
  if (!process.env.FIREBASE_CLIENT_EMAIL) {
    missing.push("FIREBASE_CLIENT_EMAIL");
  }
  if (!process.env.FIREBASE_PRIVATE_KEY) {
    missing.push("FIREBASE_PRIVATE_KEY");
  }
  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) {
    missing.push("FIREBASE_PROJECT_ID (or NEXT_PUBLIC_FIREBASE_PROJECT_ID)");
  }

  if (missing.length > 0) {
    throw new Error(
      `Firebase Admin initialization failed: missing required environment variable(s) [${missing.join(
        ", "
      )}]. Set either FIREBASE_SERVICE_ACCOUNT_JSON (base64 or JSON string) or provide the individual variables in Vercel settings.`
    );
  }

  return {
    projectId: projectId!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: normalizePrivateKey(process.env.FIREBASE_PRIVATE_KEY!),
  };
}

/**
 * Indicates if explicit service account credentials have been configured in the environment.
 * Evaluated lazily at request time.
 */
export function hasAdminCredentials(): boolean {
  if (
    process.env.FIREBASE_AUTH_EMULATOR_HOST !== undefined ||
    process.env.FIRESTORE_EMULATOR_HOST !== undefined
  ) {
    return true;
  }

  const jsonSource =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (jsonSource) {
    return parseServiceAccountString(jsonSource) !== null;
  }

  return Boolean(
    process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY &&
      (process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
  );
}

/**
 * Lazy, request-time initialization of Firebase Admin App.
 */
export function getAdminApp(): App {
  if (adminApp) return adminApp;

  const existingApps = getApps();
  if (existingApps.length > 0) {
    adminApp = existingApps[0];
    return adminApp;
  }

  const serviceAccount = resolveCredentialsOrThrow();

  adminApp = initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.projectId,
  });

  return adminApp;
}

/**
 * Lazy request-time Firestore instance.
 */
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

/**
 * Lazy request-time Firebase Auth instance.
 */
export function getAdminAuth(): Auth {
  if (adminAuth) return adminAuth;
  const app = getAdminApp();
  adminAuth = getAuth(app);
  return adminAuth;
}

