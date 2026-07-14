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
  title: { default: "Tharvion — Build Wealth With Clarity", template: "%s | Tharvion" },
  description: "A private personal finance workspace for spending, planning, and building wealth with clarity.",
};

const enableAmbientEffects = process.env.NEXT_PUBLIC_ENABLE_AMBIENT_EFFECTS === "true";

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
        {enableAmbientEffects && <LazyParticleBackground />}
        {enableAmbientEffects && profile?.show_cursor_trail === true && <LazyCursorTrail />}
        <TopNav activeTheme={activeTheme as "light" | "dark"} profile={profile} />
        <main className="flex-1 flex flex-col relative z-10">{children}</main>
        <Toaster
          richColors
          position="top-right"
          expand={true}
          visibleToasts={5}
          toastOptions={{
            style: {
              background: "color-mix(in srgb, var(--color-surface-card-dark) 88%, transparent)",
              backdropFilter: "blur(16px)",
              border: "1px solid var(--color-hairline-on-dark)",
              borderRadius: "16px",
              color: "var(--color-on-dark)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.16)",
            },
            className: "premium-toast",
          }}
        />
      </body>
    </html>
  );
}
