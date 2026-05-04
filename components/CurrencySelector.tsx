/**
 * Component: CurrencySelector.tsx
 */
"use client";

import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { updateCurrency } from "@/actions/profile";
import { useState } from "react";

export function CurrencySelector({ currentCurrency }: { currentCurrency: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("currency", e.target.value);
      await updateCurrency(formData);
    } catch (error) {
      console.error("Failed to update currency:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <select
      value={currentCurrency}
      onChange={handleChange}
      disabled={isSubmitting}
      className="form-control px-3 py-2 text-body-md md:px-2 md:py-1 md:text-body-sm"
    >
      {SUPPORTED_CURRENCIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.symbol} {c.code}
        </option>
      ))}
    </select>
  );
}
