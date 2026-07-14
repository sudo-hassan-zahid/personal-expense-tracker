/**
 * Component: DemoAccountCard.tsx
 */
"use client";

import React, { useState } from "react";
import { login } from "@/app/login/actions";
import { Check, Clipboard, UserRound, Zap } from "lucide-react";

export function DemoAccountCard() {
  const [isPending, setIsPending] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  return (
    <div id="demo-account" className="mt-8 scroll-mt-24 rounded-xl border border-(--color-primary)/30 bg-(--color-primary)/5 p-4 shadow-[0_0_40px_rgba(252,213,53,.04)]">
      <div className="relative pb-1">
        <div className="absolute inset-x-0 top-3 flex items-center">
          <div className="w-full border-t border-(--color-hairline-on-dark)" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-(--color-surface-card-dark) px-3 text-(--color-muted) font-medium flex items-center gap-2">
            <UserRound size={16} />
            <span className="rounded-full border border-(--color-primary)/25 bg-(--color-primary)/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-(--color-primary)">
              Demo
            </span>
            Not sure yet? Take a look around.
          </span>
        </div>
        <p className="mt-3 text-center text-body-sm text-(--color-muted) max-w-[290px] mx-auto">
          See Tharvion with realistic sample data. Use the credentials below or enter instantly—no account required.
        </p>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3">
        <div className="rounded-xl p-3 border border-(--color-hairline-on-dark) bg-(--color-surface-card-dark) flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-(--color-muted) font-semibold">
            Email
          </span>
          <div className="flex justify-between items-center">
            <span className="text-body-sm text-(--color-on-dark)">demo@test.com</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText("demo@test.com");
                setCopiedEmail(true);
                setTimeout(() => setCopiedEmail(false), 2000);
              }}
              className="text-(--color-muted) hover:text-(--color-primary) transition-colors flex items-center gap-1.5"
              title="Copy email"
            >
              {copiedEmail ? (
                <span className="text-[10px] text-green-400 font-medium animate-pulse">
                  Copied!
                </span>
              ) : null}
              {copiedEmail ? (
                <Check size={14} className="text-green-400" />
              ) : (
                <Clipboard size={14} />
              )}
            </button>
          </div>
        </div>
        <div className="rounded-xl p-3 border border-(--color-hairline-on-dark) bg-(--color-surface-card-dark) flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-(--color-muted) font-semibold">
            Password
          </span>
          <div className="flex justify-between items-center">
            <span className="text-body-sm text-(--color-on-dark)">12345678</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText("12345678");
                setCopiedPassword(true);
                setTimeout(() => setCopiedPassword(false), 2000);
              }}
              className="text-(--color-muted) hover:text-(--color-primary) transition-colors flex items-center gap-1.5"
              title="Copy password"
            >
              {copiedPassword ? (
                <span className="text-[10px] text-green-400 font-medium animate-pulse">
                  Copied!
                </span>
              ) : null}
              {copiedPassword ? (
                <Check size={14} className="text-green-400" />
              ) : (
                <Clipboard size={14} />
              )}
            </button>
          </div>
        </div>
        <button
          disabled={isPending}
          onClick={async () => {
            setIsPending(true);
            try {
              const formData = new FormData();
              formData.append("email", "demo@test.com");
              formData.append("password", "12345678");
              await login(formData);
            } finally {
              setIsPending(false);
            }
          }}
          className="mt-3 flex w-full justify-center rounded-xl border border-(--color-hairline-on-dark) bg-(--color-surface-elevated-dark) py-3 px-4 text-button text-(--color-on-dark) hover:bg-(--color-surface-card-dark) transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-(--color-primary) border-t-transparent rounded-full animate-spin" />
          ) : (
            <Zap size={16} className="text-(--color-primary)" />
          )}
          {isPending ? "Opening demo..." : "Enter the demo account"}
        </button>
      </div>
    </div>
  );
}
