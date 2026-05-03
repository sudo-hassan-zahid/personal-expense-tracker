"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function TopNavClient({ user, activeTheme }: { user: any; activeTheme: "light" | "dark" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="h-[64px] bg-(--color-canvas-dark) flex items-center justify-between px-6 shrink-0 border-b border-(--color-hairline-on-dark) sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2 text-primary font-bold text-xl tracking-tight hover:text-primary-active transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 transition-transform duration-500 group-hover:rotate-180">
              <path d="M12 2L2 12l10 10 10-10L12 2zm0 4.8l5.2 5.2-5.2 5.2-5.2-5.2L12 6.8z" />
            </svg>
            <span className="text-(--color-primary)">TRACKER</span>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="relative group text-nav-link text-(--color-body) hover:text-(--color-primary) transition-colors"
              >
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-(--color-primary) transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                href="/dashboard/categories"
                className="relative group text-nav-link text-(--color-body) hover:text-(--color-primary) transition-colors"
              >
                Categories
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-(--color-primary) transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                href="/dashboard/profile"
                className="relative group text-nav-link text-(--color-body) hover:text-(--color-primary) transition-colors"
              >
                Profile
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-(--color-primary) transition-all duration-300 group-hover:w-full" />
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle initialTheme={activeTheme} />
            {user ? (
              <form action="/auth/signout" method="post">
                <button className="text-button text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md transition-colors">
                  Log Out
                </button>
              </form>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-button text-(--color-body) hover:text-(--color-primary)"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="text-button bg-(--color-primary) text-(--color-on-primary) px-[24px] h-[40px] rounded-md flex items-center justify-center hover:bg-(--color-primary-active) transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-(--color-body) hover:bg-(--color-surface-elevated-dark) rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-[64px] right-0 bottom-0 w-[280px] bg-(--color-surface-card-dark) border-l border-(--color-hairline-on-dark) z-40 md:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col p-6 gap-6">
          <div className="flex items-center justify-between">
            <span className="text-body-sm font-semibold uppercase tracking-wider text-(--color-muted)">
              Menu
            </span>
            <ThemeToggle initialTheme={activeTheme} />
          </div>

          <nav className="flex flex-col gap-4">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-title-sm text-(--color-body) hover:text-(--color-primary) py-2 border-b border-(--color-hairline-on-dark) hover:pl-2 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/categories"
                  className="text-title-sm text-(--color-body) hover:text-(--color-primary) py-2 border-b border-(--color-hairline-on-dark) hover:pl-2 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Categories
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="text-title-sm text-(--color-body) hover:text-(--color-primary) py-2 border-b border-(--color-hairline-on-dark) hover:pl-2 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>

                <form action="/auth/signout" method="post" className="mt-4">
                  <button className="w-full text-button text-white bg-red-600 hover:bg-red-700 px-4 py-3 rounded-md transition-colors">
                    Log Out
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-col gap-4">
                <Link
                  href="/login"
                  className="text-button text-center text-(--color-body) border border-(--color-hairline-on-dark) py-3 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="text-button text-center bg-(--color-primary) text-(--color-on-primary) py-3 rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
