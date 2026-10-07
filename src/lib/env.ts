/**
 * Environment variable validation and inspection.
 *
 * CRITICAL RULE:
 * Never validate environment variables at the module's top level.
 * Top-level validation crashes `next build` when static pages are prerendered
 * without full production secrets attached.
 * All validation must be lazy and called inside request handlers or runtime operations.
 */

export interface EnvHealthCheck {
  isConfigured: boolean;
  variables: Record<string, boolean>;
  missing: string[];
}

/**
 * Validates that essential Firebase Admin environment variables exist at runtime.
 * Throws a descriptive error identifying the exact missing variable name.
 */
export function validateFirebaseAdminEnv(): {
  projectId: string;
  clientEmail: string;
  privateKey: string;
} {
  // Option 1: Full JSON or base64 credentials string
  const serviceAccountJson =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

  if (serviceAccountJson) {
    try {
      let raw = serviceAccountJson.trim();
      if (raw.startsWith('"') && raw.endsWith('"')) raw = raw.slice(1, -1);
      if (raw.startsWith("'") && raw.endsWith("'")) raw = raw.slice(1, -1);

      let parsedStr = raw;
      if (!raw.startsWith("{")) {
        try {
          parsedStr = Buffer.from(raw, "base64").toString("utf-8");
        } catch {
          parsedStr = raw;
        }
      }

      const parsed = JSON.parse(parsedStr);
      const projectId = parsed.project_id || parsed.projectId;
      const clientEmail = parsed.client_email || parsed.clientEmail;
      const privateKey = parsed.private_key || parsed.privateKey;

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
          "FIREBASE_SERVICE_ACCOUNT_JSON is missing one of required fields: project_id, client_email, private_key"
        );
      }

      return { projectId, clientEmail, privateKey };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON: ${msg}`);
    }
  }

  // Option 2: Individual variables
  const missing: string[] = [];
  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  if (!projectId) missing.push("FIREBASE_PROJECT_ID");
  if (!process.env.FIREBASE_CLIENT_EMAIL) missing.push("FIREBASE_CLIENT_EMAIL");
  if (!process.env.FIREBASE_PRIVATE_KEY) missing.push("FIREBASE_PRIVATE_KEY");

  if (missing.length > 0) {
    throw new Error(
      `Missing required Firebase Admin environment variable(s): ${missing.join(", ")}. Please set them in your Vercel Project Settings or .env.local file.`
    );
  }

  return {
    projectId: projectId!,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    privateKey: process.env.FIREBASE_PRIVATE_KEY!,
  };
}

/**
 * Returns a boolean-only inventory of known environment variables for diagnostic endpoints.
 * NEVER returns raw values.
 */
export function getEnvStatus(): Record<string, boolean> {
  return {
    FIREBASE_PROJECT_ID: Boolean(
      process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    ),
    FIREBASE_CLIENT_EMAIL: Boolean(process.env.FIREBASE_CLIENT_EMAIL),
    FIREBASE_PRIVATE_KEY: Boolean(process.env.FIREBASE_PRIVATE_KEY),
    FIREBASE_SERVICE_ACCOUNT_JSON: Boolean(
      process.env.FIREBASE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ),
    ADMIN_SESSION_SECRET: Boolean(process.env.ADMIN_SESSION_SECRET),
    ADMIN_PIN: Boolean(process.env.ADMIN_PIN),
    NEXT_PUBLIC_FIREBASE_API_KEY: Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: Boolean(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: Boolean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: Boolean(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: Boolean(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
    NEXT_PUBLIC_FIREBASE_APP_ID: Boolean(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
    NEXT_PUBLIC_FIREBASE_VAPID_KEY: Boolean(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY),
    AFRICASTALKING_API_KEY: Boolean(process.env.AFRICASTALKING_API_KEY),
    CRON_SECRET: Boolean(process.env.CRON_SECRET),
  };
}
