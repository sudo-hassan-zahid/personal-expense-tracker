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
      className="bg-(--color-canvas-dark) text-(--color-body) border border-(--color-hairline-on-dark) rounded-md px-3 md:px-2 py-2 md:py-1 text-body-md md:text-body-sm focus:border-(--color-primary) focus:outline-none disabled:opacity-50"
    >
      {SUPPORTED_CURRENCIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.symbol} {c.code}
        </option>
      ))}
    </select>
  );
}
