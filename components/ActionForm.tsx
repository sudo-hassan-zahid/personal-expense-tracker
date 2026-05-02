"use client";

import { toast } from "sonner";
import { ReactNode } from "react";

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
      {children}
    </form>
  );
}
