"use client";

import { toast } from "sonner";
import { ReactNode } from "react";

export function DeleteButton({
  action,
  successMessage,
  children,
  className,
}: {
  action: () => Promise<void>;
  successMessage: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <form
      action={async () => {
        try {
          await action();
          toast.success(successMessage);
        } catch (error: any) {
          toast.error(error.message || "An error occurred");
        }
      }}
    >
      <button type="submit" className={className}>
        {children}
      </button>
    </form>
  );
}
