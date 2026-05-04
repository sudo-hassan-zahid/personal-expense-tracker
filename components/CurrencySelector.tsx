/**
 * Component: CurrencySelector.tsx
 */
"use client";

import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { updateCurrency } from "@/actions/profile";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function CurrencySelector({ currentCurrency }: { currentCurrency: string }) {
  const router = useRouter();
  const [, startRefreshTransition] = useTransition();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currentCurrency);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextCurrency = e.target.value;
    const previousCurrency = selectedCurrency;

    setSelectedCurrency(nextCurrency);
    setIsSubmitting(true);
    const toastId = toast.loading(`Switching currency to ${nextCurrency}...`);

    try {
      const formData = new FormData();
      formData.set("currency", nextCurrency);
      const result = await updateCurrency(formData);

      if (result?.error) {
        setSelectedCurrency(previousCurrency);
        toast.error(result.error, { id: toastId });
        return;
      }

      toast.success(`Currency set to ${nextCurrency}`, { id: toastId });
      startRefreshTransition(() => router.refresh());
    } catch (error) {
      setSelectedCurrency(previousCurrency);
      toast.error(error instanceof Error ? error.message : "Failed to update currency", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <select
      value={selectedCurrency}
      onChange={handleChange}
      disabled={isSubmitting}
      className="form-control px-3 py-2 text-body-md md:px-2 md:py-1 md:text-body-sm disabled:cursor-wait"
    >
      {SUPPORTED_CURRENCIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.symbol} {c.code}
        </option>
      ))}
    </select>
  );
}
