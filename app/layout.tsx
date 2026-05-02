import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TopNav } from "@/components/TopNav";
import { getProfile } from "@/actions/profile";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
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
      <body className={`min-h-full flex flex-col bg-(--color-canvas-dark) text-(--color-body) ${themeClass}`}>
        <TopNav activeTheme={activeTheme as "light" | "dark"} />
        <main className="flex-1 flex flex-col">{children}</main>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
