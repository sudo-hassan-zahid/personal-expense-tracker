/**
 * Component: LazyEffects.tsx
 */
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/**
 * Client-side wrapper for heavy canvas components that need ssr: false.
 * Next.js 16 doesn't allow ssr: false in Server Components (layout.tsx),
 * so we wrap the dynamic imports in a Client Component boundary.
 */

const ParticleBackgroundLazy = dynamic(
  () =>
    import("@/components/ui/ParticleBackground").then((m) => ({ default: m.ParticleBackground })),
  { ssr: false, loading: () => null }
);

const CursorTrailLazy = dynamic(
  () => import("@/components/ui/CursorTrail").then((m) => ({ default: m.CursorTrail })),
  { ssr: false, loading: () => null }
);

function useIdleEffectsReady({ pointerOnly = false }: { pointerOnly?: boolean } = {}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasPrecisePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (reducedMotion || (pointerOnly && !hasPrecisePointer)) return;

    if ("requestIdleCallback" in window && "cancelIdleCallback" in window) {
      const idleId = window.requestIdleCallback(() => setReady(true), { timeout: 1600 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = globalThis.setTimeout(() => setReady(true), 900);
    return () => globalThis.clearTimeout(timeoutId);
  }, [pointerOnly]);

  return ready;
}

export function LazyParticleBackground() {
  const ready = useIdleEffectsReady();
  if (!ready) return null;

  return <ParticleBackgroundLazy />;
}

export function LazyCursorTrail() {
  const ready = useIdleEffectsReady({ pointerOnly: true });
  if (!ready) return null;

  return <CursorTrailLazy />;
}

