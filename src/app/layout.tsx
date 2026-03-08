import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChatBot } from "@/components/ChatBot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Hope Counseling Support Services",
    description: "A premium counseling psychology platform providing booking, live sessions, and mood tracking.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={inter.className}>
                <Navbar />
                {children}
                <Footer />
                <ChatBot />
            </body>
        </html>
    );
}
