"use client";

import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { TharvionMark } from "./TharvionLogo";

const STORAGE_KEY = "tharvion:wealth-launch-seen";

export function WealthLaunch() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem(STORAGE_KEY)) return;
    const timer = window.setTimeout(() => setVisible(true), 250);
    return () => window.clearTimeout(timer);
  }, []);

  function close() {
    window.localStorage.setItem(STORAGE_KEY, "true");
    setLeaving(true);
    window.setTimeout(() => setVisible(false), 350);
  }

  if (!visible) return null;

  return (
    <div
      className={`wealth-launch fixed inset-0 z-[100] flex items-center justify-center bg-[#07090b]/95 px-6 backdrop-blur-xl ${leaving ? "wealth-launch-out" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="wealth-launch-title"
    >
      <button onClick={close} className="absolute right-5 top-5 rounded-full p-3 text-white/60 transition hover:bg-white/5 hover:text-white" aria-label="Skip intro">
        <X size={20} />
      </button>

      <div className="relative max-w-xl text-center">
        <div className="wealth-orbit mx-auto mb-9 flex h-40 w-40 items-center justify-center rounded-full border border-(--color-primary)/25">
          <div className="wealth-orbit-dot" />
          <div className="wealth-mark-launch rounded-[28px] bg-(--color-primary)/10 p-5 text-(--color-primary)">
            <TharvionMark className="h-20 w-20" />
          </div>
        </div>

        <p className="wealth-launch-copy text-caption uppercase tracking-[.32em] text-(--color-primary)">Your wealth journey starts now</p>
        <h1 id="wealth-launch-title" className="wealth-launch-copy mt-4 text-[38px] font-bold leading-tight tracking-[-.035em] text-white sm:text-[50px]">
          Small decisions.<br />Powerful direction.
        </h1>
        <p className="wealth-launch-copy mx-auto mt-5 max-w-md text-[16px] leading-7 text-[#929aa5]">
          You showed up for your future today. Let&apos;s turn clarity into momentum—one smart move at a time.
        </p>
        <button onClick={close} className="wealth-launch-copy group mx-auto mt-8 inline-flex h-12 items-center gap-2 rounded-lg bg-(--color-primary) px-7 text-button text-[#181a20] transition hover:bg-(--color-primary-active)">
          Enter my dashboard <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
