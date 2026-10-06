"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import PwaInstallPrompt from "@/components/PwaInstallPrompt";

export default function WebsiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

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
      <PwaInstallPrompt />
    </>
  );
}
