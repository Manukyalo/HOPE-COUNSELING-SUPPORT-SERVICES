import { NextResponse } from "next/server";
import { getEnvStatus } from "@/lib/env";
import { getAdminDb, hasAdminCredentials } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const startTime = Date.now();
  const envStatus = getEnvStatus();

  let firestoreConnected = false;
  let firestoreError: string | null = null;
  let firestoreLatencyMs = 0;

  if (hasAdminCredentials()) {
    try {
      const db = getAdminDb();
      const readStart = Date.now();
      // Read availability settings doc (or check collection existence)
      await db.collection("settings").doc("availability").get();
      firestoreLatencyMs = Date.now() - readStart;
      firestoreConnected = true;
    } catch (err: unknown) {
      firestoreError = err instanceof Error ? err.message : String(err);
      console.error("[api/health] Firestore probe error:", err);
    }
  } else {
    firestoreError = "Firebase Admin credentials not configured in environment";
  }

  const isHealthy = firestoreConnected;

  const responseBody = {
    status: isHealthy ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    timezone: "Africa/Nairobi (UTC+3)",
    environment: process.env.NODE_ENV || "production",
    totalDurationMs: Date.now() - startTime,
    env: envStatus,
    firestore: {
      connected: firestoreConnected,
      latencyMs: firestoreLatencyMs,
      error: firestoreError,
    },
  };

  return NextResponse.json(responseBody, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
