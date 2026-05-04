/**
 * Component: ThemeToggle.tsx
 */
"use client";

import { Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";

export function ThemeToggle({ initialTheme }: { initialTheme: "light" | "dark" }) {
  const router = useRouter();

  const toggleTheme = () => {
    const newTheme = initialTheme === "light" ? "dark" : "light";

    // Apply immediately to avoid delay
    if (newTheme === "light") {
      document.body.classList.add("theme-light");
    } else {
      document.body.classList.remove("theme-light");
    }

    // Save session preference to cookie
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
    router.refresh(); // Refresh to ensure server components know about it
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border border-(--color-hairline-on-dark) text-(--color-muted) hover:text-(--color-primary) hover:bg-(--color-surface-elevated-dark) transition-all active:scale-95 flex items-center justify-center"
      title={`Switch to ${initialTheme === "light" ? "dark" : "light"} mode`}
    >
      {initialTheme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
