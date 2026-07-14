export function TharvionMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" fill="none">
      <path d="M24 3 43 14v20L24 45 5 34V14L24 3Z" fill="currentColor" opacity=".14" />
      <path d="m11 17 13-8 13 8-5 3-8-5-8 5-5-3Z" fill="currentColor" />
      <path d="M20.5 19.5 24 17l3.5 2.5V34L24 39l-3.5-5V19.5Z" fill="currentColor" />
      <path d="m10 23 6 3v8l8 5-5 3-9-5V23Zm28 0-6 3v8l-8 5 5 3 9-5V23Z" fill="currentColor" opacity=".72" />
    </svg>
  );
}

export function TharvionLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 text-(--color-primary)">
      <TharvionMark className="h-8 w-8 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5" />
      {!compact && (
        <span className="text-[19px] font-bold uppercase tracking-[0.16em] text-(--color-on-dark)">
          Thar<span className="text-(--color-primary)">vion</span>
        </span>
      )}
    </span>
  );
}
