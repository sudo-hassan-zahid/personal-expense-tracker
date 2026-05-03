"use client";

import { HelpCircle } from "lucide-react";
import type { ReactNode } from "react";

export function HelpTip({
  label,
  children,
  className = "",
}: {
  label: string;
  children: string;
  className?: string;
}) {
  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        aria-label={label}
        className="group/help inline-flex h-5 w-5 items-center justify-center rounded-full border border-(--color-hairline-on-dark) bg-(--color-canvas-dark)/40 text-(--color-muted) transition-colors hover:border-(--color-primary)/70 hover:text-(--color-primary) focus-visible:border-(--color-primary) focus-visible:text-(--color-primary) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-primary)/30"
      >
        <HelpCircle size={13} strokeWidth={2.2} />
        <span className="pointer-events-none absolute bottom-full left-1/2 z-[10020] mb-2 w-64 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-lg border border-(--color-hairline-on-dark) bg-(--color-surface-elevated-dark) px-3 py-2 text-left text-caption font-normal leading-relaxed text-(--color-body) opacity-0 shadow-2xl shadow-black/30 transition-opacity duration-150 group-hover/help:opacity-100 group-focus-visible/help:opacity-100">
          {children}
        </span>
      </button>
    </span>
  );
}

export function HelpLabel({
  children,
  help,
  label,
  className = "",
}: {
  children: ReactNode;
  help: string;
  label?: string;
  className?: string;
}) {
  const helpLabel = label || (typeof children === "string" ? children : "Field");

  return (
    <div className={`flex items-center gap-1.5 text-body-sm text-(--color-muted) ${className}`}>
      <span>{children}</span>
      <HelpTip label={`${helpLabel} help`}>{help}</HelpTip>
    </div>
  );
}
