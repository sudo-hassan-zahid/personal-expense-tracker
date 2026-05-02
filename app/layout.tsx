import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TopNav } from "@/components/TopNav";
import { getProfile } from "@/actions/profile";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await getProfile();
  const theme = profile?.theme === "light" ? "theme-light" : "theme-dark";

  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className={`min-h-full flex flex-col bg-(--color-canvas-dark) text-(--color-body) ${theme}`}>
        <TopNav />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
