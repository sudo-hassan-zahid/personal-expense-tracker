"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export function FullscreenModal({
  title,
  children,
  onClose,
  footer,
  widthClassName = "max-w-3xl",
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  widthClassName?: string;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[10000] flex min-h-screen items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        aria-label="Close modal backdrop"
        className="absolute inset-0 bg-black/45 backdrop-blur-xl"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex h-[min(92vh,820px)] w-full ${widthClassName} flex-col overflow-hidden rounded-xl border border-(--color-hairline-on-dark) bg-(--color-surface-card-dark) shadow-2xl`}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-(--color-hairline-on-dark) px-4 py-3 sm:px-5">
          <h2 className="min-w-0 truncate text-title-md text-(--color-on-dark)">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-(--color-muted) transition-colors hover:bg-(--color-surface-elevated-dark) hover:text-(--color-on-dark)"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">{children}</div>
        {footer && (
          <footer className="shrink-0 border-t border-(--color-hairline-on-dark) px-4 py-3 sm:px-5">
            {footer}
          </footer>
        )}
      </section>
    </div>
  );
}
