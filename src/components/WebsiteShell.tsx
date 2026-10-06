"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function WebsiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // Purge legacy service workers, caches, and storage for public visitors
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Unregister all legacy service workers on public pages
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        }).catch(() => {});
      }

      // 2. Clear all legacy caches so stale manifests and cached assets are deleted
      if ("caches" in window) {
        caches.keys().then((keys) => {
          for (const key of keys) {
            caches.delete(key);
          }
        }).catch(() => {});
      }

      // 3. Clear any leaked admin bookings from public visitors' localStorage
      if (!isAdminRoute) {
        try {
          localStorage.removeItem("hope_admin_bookings");
        } catch {}
      }
    }
  }, [isAdminRoute]);

  if (isAdminRoute) {
    // Isolated standalone portal shell for clinical admin
    return <>{children}</>;
  }

  // Public marketing website shell (no mobile sticky CTA)
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <WhatsAppButton />
      <Footer />
    </>
  );
}
