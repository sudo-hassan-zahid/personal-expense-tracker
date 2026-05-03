/**
 * Component: ActionForm.tsx
 */
"use client";
import { toast } from "sonner";
import { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { LoadingSpinner } from "./ui/LoadingSpinner";

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
  action: (formData: FormData) => Promise<any>;
  successMessage: string;
  children: ReactNode;
  className?: string;
  onSuccess?: () => void;
}) {
  return (
    <form
      action={async (formData) => {
        try {
          const result = await action(formData);
          if (result && (result as any).error) {
            toast.error((result as any).error);
          } else {
            toast.success(successMessage);
            if (onSuccess) onSuccess();
          }
        } catch (error: any) {
          toast.error(error.message || "An error occurred");
        }
      }}
      className={className}
    >
      {children}
    </form>
  );
}

