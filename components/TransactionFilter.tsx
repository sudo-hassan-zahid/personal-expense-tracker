"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

export function TransactionFilter({ defaultType }: { defaultType: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-2">
      {isPending && <Loader2 size={16} className="animate-spin text-(--color-primary)" />}
      <select
        className={`bg-(--color-canvas-dark) text-(--color-on-dark) border border-(--color-hairline-on-dark) rounded px-2 py-1 text-body-sm focus:ring-1 focus:ring-(--color-primary) outline-none transition-all ${isPending ? "opacity-50" : ""}`}
        defaultValue={defaultType}
        disabled={isPending}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          if (e.target.value === "all") params.delete("type");
          else params.set("type", e.target.value);
          
          startTransition(() => {
            router.push(`?${params.toString()}`, { scroll: false });
          });
        }}
      >
        <option value="all">All Types</option>
        <option value="expense">Expenses</option>
        <option value="income">Income</option>
      </select>
    </div>
  );
}
