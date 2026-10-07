"use client";

import { useEffect } from "react";

import { registerAdminDevice } from "@/lib/pwa-notifications";

export default function AdminPWARegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/admin-sw.js", { scope: "/admin/" })
        .then((reg) => {
          // Check for service worker updates
          reg.update().catch(() => {});

          if ("Notification" in window && Notification.permission === "granted") {
            let deviceId = localStorage.getItem("hc_admin_device_id");
            if (!deviceId) {
              deviceId = "device_" + Math.random().toString(36).substring(2) + "_" + Date.now();
              localStorage.setItem("hc_admin_device_id", deviceId);
            }
            registerAdminDevice(deviceId).catch(() => {});
          }
        })
        .catch((err) => {
          console.warn("[Admin PWA] Service worker registration failed:", err);
        });
    }
  }, []);

  return null;
}
