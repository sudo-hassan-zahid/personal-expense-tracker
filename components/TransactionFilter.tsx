"use client";
import { useRouter, useSearchParams } from "next/navigation";

export function TransactionFilter({ defaultType }: { defaultType: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <select 
      className="bg-(--color-canvas-dark) text-(--color-on-dark) border border-(--color-hairline-on-dark) rounded px-2 py-1 text-body-sm"
      defaultValue={defaultType}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams.toString());
        if (e.target.value === "all") params.delete("type");
        else params.set("type", e.target.value);
        router.push(`?${params.toString()}`, { scroll: false });
      }}
    >
      <option value="all">All Types</option>
      <option value="expense">Expenses</option>
      <option value="income">Income</option>
    </select>
  );
}
