"use client";

import dynamic from "next/dynamic";

/**
 * Client-side wrapper for heavy canvas components that need ssr: false.
 * Next.js 16 doesn't allow ssr: false in Server Components (layout.tsx),
 * so we wrap the dynamic imports in a Client Component boundary.
 */

const ParticleBackgroundLazy = dynamic(
  () => import("@/components/ui/ParticleBackground").then(m => ({ default: m.ParticleBackground })),
  { ssr: false }
);

const CursorTrailLazy = dynamic(
  () => import("@/components/ui/CursorTrail").then(m => ({ default: m.CursorTrail })),
  { ssr: false }
);

export function LazyParticleBackground() {
  return <ParticleBackgroundLazy />;
}

export function LazyCursorTrail() {
  return <CursorTrailLazy />;
}
