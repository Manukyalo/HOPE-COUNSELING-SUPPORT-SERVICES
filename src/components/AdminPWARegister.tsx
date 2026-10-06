"use client";

import { useEffect } from "react";

export default function AdminPWARegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/admin-sw.js", { scope: "/admin/" })
        .then((reg) => {
          // Check for service worker updates
          reg.update().catch(() => {});
        })
        .catch((err) => {
          console.warn("[Admin PWA] Service worker registration failed:", err);
        });
    }
  }, []);

  return null;
}
