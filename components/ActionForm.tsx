/**
 * Component: ActionForm.tsx
 */
"use client";
import { toast } from "sonner";
import { ReactNode } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton({ children }: { children: ReactNode }) {
  const { pending } = useFormStatus();
  return <div className={pending ? "opacity-50 pointer-events-none" : ""}>{children}</div>;
}

export function ActionForm({
  action,
  successMessage,
  children,
  className,
}: {
  action: (formData: FormData) => Promise<void>;
  successMessage: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <form
      action={async (formData) => {
        try {
          await action(formData);
          toast.success(successMessage);
        } catch (error: any) {
          toast.error(error.message || "An error occurred");
        }
      }}
      className={className}
    >
      <SubmitButton>{children}</SubmitButton>
    </form>
  );
}

