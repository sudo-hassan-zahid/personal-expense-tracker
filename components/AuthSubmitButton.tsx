"use client";

import { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export function AuthSubmitButton({
  children,
  pendingText,
}: {
  children: ReactNode;
  pendingText: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-gradient-to-r from-blue-500 to-indigo-600 py-3 px-4 text-button text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-(--color-canvas-dark) transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 disabled:hover:scale-100"
    >
      {pending ? (
        <>
          <LoadingSpinner size={18} />
          <span>{pendingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
