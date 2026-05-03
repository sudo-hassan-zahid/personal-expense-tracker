"use client";

import React, { useState } from "react";
import { login } from "@/app/login/actions";

export function DemoAccountCard() {
  const [isPending, setIsPending] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  return (
    <div className="mt-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-(--color-hairline-on-dark)" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-(--color-canvas-dark) px-4 text-(--color-muted) font-medium flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/20 uppercase tracking-tighter font-bold">
              Demo
            </span>
            Try Demo Account
          </span>
        </div>
        <p className="mt-3 text-center text-body-sm text-(--color-muted) max-w-[280px] mx-auto">
          Explore the dashboard and features with our pre-configured demo account.
        </p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4">
        <div className="glass-dark rounded-xl p-4 border border-(--color-hairline-on-dark) flex flex-col gap-1">
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
                <span className="text-[10px] text-green-400 font-medium animate-pulse">Copied!</span>
              ) : null}
              <svg
                className={`w-3.5 h-3.5 ${copiedEmail ? "text-green-400" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {copiedEmail ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        <div className="glass-dark rounded-xl p-4 border border-(--color-hairline-on-dark) flex flex-col gap-1">
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
                <span className="text-[10px] text-green-400 font-medium animate-pulse">Copied!</span>
              ) : null}
              <svg
                className={`w-3.5 h-3.5 ${copiedPassword ? "text-green-400" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {copiedPassword ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                )}
              </svg>
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
          className="mt-6 flex w-full justify-center rounded-xl border border-(--color-hairline-on-dark) bg-(--color-surface-elevated-dark) py-3 px-4 text-button text-(--color-on-dark) hover:bg-(--color-surface-card-dark) transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] gap-2 items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <div className="w-4 h-4 border-2 border-(--color-primary) border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              className="w-4 h-4 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          )}
          {isPending ? "Connecting..." : "Quick Access"}
        </button>
      </div>
    </div>
  );
}
