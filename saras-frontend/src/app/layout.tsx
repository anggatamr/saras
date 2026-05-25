import type { Metadata } from "next";
import { Syne, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { Sidebar, BottomNav } from "@/components/layout/Sidebar";

const syne = Syne({ 
  subsets: ["latin"],
  variable: '--font-syne',
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: '--font-hanken-grotesk',
});

export const metadata: Metadata = {
  title: "SARAS - Sistem Asisten Riset Akademik Statistika",
  description: "AI-Powered Research Integrity & Analytics Platform for Indonesian Academia",
};

import { AuthProvider } from "@/lib/auth";
import { ToastProvider, Toaster } from "@/components/ui/toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${syne.variable} ${hankenGrotesk.variable}`}>
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <ToastProvider>
            <div className="flex h-screen w-full overflow-hidden pb-[64px] md:pb-0">
              <Sidebar />
              <div className="flex flex-1 flex-col overflow-hidden">
                {children}
              </div>
              <BottomNav />
            </div>
            <Toaster />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
