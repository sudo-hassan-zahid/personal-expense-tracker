import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TopNav } from "@/components/TopNav";
import { getProfile } from "@/actions/profile";
import { Toaster } from "sonner";
import dynamic from "next/dynamic";
import "./globals.css";

// Lazy load heavy canvas-based components — they don't need SSR
// and shouldn't block first paint or increase initial JS bundle
const ParticleBackground = dynamic(
  () => import("@/components/ui/ParticleBackground").then(m => ({ default: m.ParticleBackground })),
  { ssr: false }
);

const CursorTrail = dynamic(
  () => import("@/components/ui/CursorTrail").then(m => ({ default: m.CursorTrail })),
  { ssr: false }
);

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();
  const cookieStore = await cookies();
  const cookieTheme = cookieStore.get("theme")?.value;
  const activeTheme = cookieTheme || profile?.theme || "dark";
  const themeClass = activeTheme === "light" ? "theme-light" : "";

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className={`min-h-full flex flex-col bg-(--color-canvas-dark) text-(--color-body) animate-liquid relative ${themeClass}`}>
        <div className="glow-mesh" />
        <ParticleBackground />
        {profile?.show_cursor_trail !== false && <CursorTrail />}
        <TopNav activeTheme={activeTheme as "light" | "dark"} />
        <main className="flex-1 flex flex-col relative z-10">{children}</main>
        <Toaster 
          richColors 
          position="top-right" 
          expand={true}
          visibleToasts={5}
          toastOptions={{
            style: {
              background: 'rgba(30, 35, 41, 0.8)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              color: 'var(--color-on-dark)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            },
            className: 'premium-toast',
          }}
        />
      </body>
    </html>
  );
}
