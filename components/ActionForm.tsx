/**
 * Component: ActionForm.tsx
 */
"use client";
import { toast } from "sonner";
import { ReactNode, useRef, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { LoadingSpinner } from "./ui/LoadingSpinner";

import { useRouter } from "next/navigation";

type ActionResult = void | { error?: string; success?: boolean; imported?: number };

export function SubmitButton({
  children,
  className = "",
  loadingText,
}: {
  children: ReactNode;
  className?: string;
  loadingText?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`relative flex items-center justify-center gap-2 transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-70 ${className}`}
    >
      {pending ? (
        <>
          <LoadingSpinner size={18} />
          <span>{loadingText || "Processing..."}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function ActionForm({
  action,
  successMessage,
  children,
  className,
  onSuccess,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  successMessage: string;
  children: ReactNode;
  className?: string;
  onSuccess?: (formData: FormData) => void;
}) {
  const router = useRouter();
  const [, startRefreshTransition] = useTransition();
  const slowToastRef = useRef<string | number | null>(null);

  return (
    <form
      action={async (formData) => {
        const slowToastTimer = window.setTimeout(() => {
          slowToastRef.current = toast.loading("Still working...", {
            description: "Waiting on the database. Your click was received.",
          });
        }, 600);

        try {
          const result = await action(formData);
          window.clearTimeout(slowToastTimer);

          if (result?.error) {
            toast.error(result.error, slowToastRef.current ? { id: slowToastRef.current } : {});
          } else {
            toast.success(
              successMessage,
              slowToastRef.current ? { id: slowToastRef.current } : {}
            );
            startRefreshTransition(() => router.refresh());
            if (onSuccess) onSuccess(formData);
          }
        } catch (error) {
          window.clearTimeout(slowToastTimer);
          toast.error(
            error instanceof Error ? error.message : "An error occurred",
            slowToastRef.current ? { id: slowToastRef.current } : {}
          );
        } finally {
          slowToastRef.current = null;
        }
      }}
      className={className}
    >
      {children}
    </form>
  );
}
