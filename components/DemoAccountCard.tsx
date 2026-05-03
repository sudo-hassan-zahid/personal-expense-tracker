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
    </div>
  );
}
