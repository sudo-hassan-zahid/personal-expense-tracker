"use client";

import { ReactNode } from "react";

/**
 * A simple button component for triggering deletion.
 * The actual confirmation logic is handled by the parent TransactionList
 * to ensure the modal is rendered correctly in the stacking context.
 */
export function DeleteButton({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}
