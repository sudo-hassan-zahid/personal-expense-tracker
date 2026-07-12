/**
 * Component: DeleteConfirmationModal.tsx
 */
"use client";

import { AlertCircle } from "lucide-react";
import { FullscreenModal } from "./ui/FullscreenModal";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  description?: string;
  isDeleting: boolean;
  confirmLabel?: string;
  loadingLabel?: string;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this? This action cannot be undone.",
  isDeleting,
  confirmLabel = "Delete",
  loadingLabel = "Deleting...",
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <FullscreenModal
      title={title}
      onClose={onClose}
      widthClassName="max-w-md"
      footer={
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-xl border border-(--color-hairline-on-dark) px-4 py-2 text-(--color-on-dark) transition-colors hover:bg-(--color-surface-elevated-dark) disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex flex-1 items-center justify-center rounded-xl bg-red-500 px-4 py-2 text-white shadow-lg shadow-red-500/20 transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            {isDeleting ? loadingLabel : confirmLabel}
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-4 py-3 text-center">
        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
          <AlertCircle size={24} />
        </div>
        <p className="text-body-sm text-(--color-muted)">{description}</p>
      </div>
    </FullscreenModal>
  );
}
