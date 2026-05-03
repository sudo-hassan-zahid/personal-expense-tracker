/**
 * Component: TransactionFilter.tsx
 */
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { HelpTip } from "./HelpTip";

export function TransactionFilter({
  defaultType,
  defaultStatus,
  showStatusFilter = false,
}: {
  defaultType: string;
  defaultStatus?: string;
  showStatusFilter?: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete(key);
    else params.set(key, value);

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-caption text-(--color-muted) mr-1">Filter by:</span>
      <HelpTip label="Transaction filters help">
        Narrow the table by transaction type or status without changing the saved data.
      </HelpTip>
      {isPending && <Loader2 size={16} className="animate-spin text-(--color-primary)" />}

      <select
        className={`form-control form-control-compact ${isPending ? "opacity-50" : ""}`}
        defaultValue={defaultType}
        disabled={isPending}
        onChange={(e) => updateFilter("type", e.target.value)}
      >
        <option value="all">All Types</option>
        <option value="expense">Expenses</option>
        <option value="income">Income</option>
      </select>

      {showStatusFilter && (
        <select
          className={`form-control form-control-compact ${isPending ? "opacity-50" : ""}`}
          defaultValue={defaultStatus || "all"}
          disabled={isPending}
          onChange={(e) => updateFilter("status", e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="done">Done</option>
          <option value="pending">Pending</option>
        </select>
      )}
    </div>
  );
}

