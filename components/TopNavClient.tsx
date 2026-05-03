"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function TopNavClient({ user, activeTheme }: { user: any, activeTheme: "light" | "dark" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center gap-4">
      {/* Client logic will go here */}
    </div>
  );
}
