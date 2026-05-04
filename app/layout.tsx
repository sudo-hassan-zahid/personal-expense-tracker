/**
 * Page/Route: layout.tsx
 */
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TopNav } from "@/components/TopNav";
import { getRequestProfile } from "@/lib/request-data";
import { Toaster } from "sonner";
import { LazyParticleBackground, LazyCursorTrail } from "@/components/LazyEffects";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Personal Expense Tracker",
  description: "Track your expenses and income.",
};

import { cookies } from "next/headers";

import { ProgressBar } from "@/components/ui/ProgressBar";
import { Suspense } from "react";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getRequestProfile();
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get("theme")?.value;
  const activeTheme = cookieTheme || profile?.theme || "dark";
  const themeClass = activeTheme === "light" ? "theme-light" : "";

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body
        className={`min-h-full flex flex-col bg-(--color-canvas-dark) text-(--color-body) animate-liquid relative ${themeClass}`}
      >
        <Suspense fallback={null}>
          <ProgressBar />
        </Suspense>
        <div className="glow-mesh" />
        <LazyParticleBackground />
        {profile?.show_cursor_trail !== false && <LazyCursorTrail />}
        <TopNav activeTheme={activeTheme as "light" | "dark"} profile={profile} />
        <main className="flex-1 flex flex-col relative z-10">{children}</main>
        <Toaster
          richColors
          position="top-right"
          expand={true}
          visibleToasts={5}
          toastOptions={{
            style: {
              background: "rgba(30, 35, 41, 0.8)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              color: "var(--color-on-dark)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
            },
            className: "premium-toast",
          }}
        />
      </body>
    </html>
  );
}
