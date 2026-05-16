import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SARAS - Sistem Asisten Riset Akademik Statistika",
  description: "AI-Powered Research Integrity & Analytics Platform for Indonesian Academia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <div className="flex h-screen w-full overflow-hidden">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
