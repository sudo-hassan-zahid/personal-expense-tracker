import React from "react";

export function DemoAccountCard() {
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
            Try Demo Account
          </span>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4">
        <div className="glass-dark rounded-xl p-4 border border-(--color-hairline-on-dark) flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-(--color-muted) font-semibold">
            Email
          </span>
          <span className="text-body-sm text-(--color-on-dark)">demo@test.com</span>
        </div>
        <div className="glass-dark rounded-xl p-4 border border-(--color-hairline-on-dark) flex flex-col gap-1">
          <span className="text-[10px] uppercase tracking-wider text-(--color-muted) font-semibold">
            Password
          </span>
          <span className="text-body-sm text-(--color-on-dark)">12345678</span>
        </div>
      </div>
    </div>
  );
}
