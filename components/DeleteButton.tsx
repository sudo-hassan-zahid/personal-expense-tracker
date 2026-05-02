"use client";

import { toast } from "sonner";
import { ReactNode, useState } from "react";
import { AlertCircle } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await action();
      toast.success(successMessage);
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button 
        type="button" 
        onClick={() => setIsOpen(true)}
        className={className}
      >
        {children}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-(--color-surface-card-dark) border border-(--color-hairline-on-dark) rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-title-md text-(--color-on-dark) mb-2">Confirm Deletion</h3>
                <p className="text-body-sm text-(--color-muted)">
                  Are you sure you want to delete this? This action cannot be undone.
                </p>
              </div>
              <div className="flex w-full gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 rounded-xl border border-(--color-hairline-on-dark) text-(--color-on-dark) hover:bg-(--color-surface-elevated-dark) transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 disabled:opacity-50 flex items-center justify-center"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
