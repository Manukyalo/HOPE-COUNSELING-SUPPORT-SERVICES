"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileStickyCTA from "@/components/MobileStickyCTA";

export default function WebsiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // Phase 4: Purge legacy service workers and public localStorage leaks
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Unregister any service workers on public marketing pages
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (const registration of registrations) {
            registration.unregister();
          }
        });
      }

      // 2. Clear any leaked admin bookings from public visitors' localStorage
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

  // Public marketing website shell
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <WhatsAppButton />
      <MobileStickyCTA />
      <Footer />
    </>
  );
}
