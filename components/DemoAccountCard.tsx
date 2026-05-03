import React from "react";

export function DemoAccountCard() {
  return (
    <div className="mt-8">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-(--color-hairline-on-dark)" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-(--color-canvas-dark) px-4 text-(--color-muted) font-medium">
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
