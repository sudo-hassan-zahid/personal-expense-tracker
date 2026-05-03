"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, Search, SlidersHorizontal, X } from "lucide-react";
import type { DashboardFilters, DashboardPeriod } from "@/lib/dashboard-filters";

function currentMonthValue(filters: DashboardFilters) {
  return filters.startDate?.slice(0, 7) || new Date().toISOString().slice(0, 7);
}

export function DashboardPeriodControls({ filters }: { filters: DashboardFilters }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [period, setPeriod] = useState<DashboardPeriod>(filters.period);
  const [month, setMonth] = useState(currentMonthValue(filters));
  const [start, setStart] = useState(filters.startDate || "");
  const [end, setEnd] = useState(filters.endDate || "");
  const [min, setMin] = useState(filters.minAmount?.toString() || "");
  const [max, setMax] = useState(filters.maxAmount?.toString() || "");
  const [q, setQ] = useState(filters.search || "");

  const hasFilters = useMemo(
    () => filters.period !== "this-month" || !!filters.minAmount || !!filters.maxAmount || !!q,
    [filters, q]
  );

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("month");
    params.delete("start");
    params.delete("end");
    params.set("period", period);

    if (period === "custom") {
      if (start) params.set("start", start);
      if (end) params.set("end", end);
    }

    if (period === "this-month" && month) {
      params.set("month", month);
    }

    min ? params.set("min", min) : params.delete("min");
    max ? params.set("max", max) : params.delete("max");
    q.trim() ? params.set("q", q.trim()) : params.delete("q");
    router.push(`/dashboard?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["period", "month", "start", "end", "min", "max", "q"].forEach((key) => params.delete(key));
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <section className="bg-(--color-surface-card-dark) rounded-xl border border-(--color-hairline-on-dark) p-4 md:p-5 animate-slide-up">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_auto] gap-4 items-end">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" aria-label="Dashboard period">
          {[
            ["this-month", "Month"],
            ["last-30", "30 Days"],
            ["all", "All"],
            ["custom", "Custom"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setPeriod(value as DashboardPeriod)}
              className={`h-10 rounded-lg border text-body-sm transition-colors ${
                period === value
                  ? "bg-(--color-primary) border-(--color-primary) text-(--color-on-primary)"
                  : "border-(--color-hairline-on-dark) text-(--color-muted) hover:text-(--color-on-dark)"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          <label className="flex flex-col gap-1 text-caption text-(--color-muted)">
            <span className="flex items-center gap-1">
              <CalendarDays size={14} /> Month
            </span>
            <input
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              disabled={period !== "this-month"}
              className="h-10 bg-(--color-canvas-dark) border border-(--color-hairline-on-dark) rounded-lg px-3 text-body-sm text-(--color-on-dark) disabled:opacity-50"
            />
          </label>
          <label className="flex flex-col gap-1 text-caption text-(--color-muted)">
            Start
            <input
              type="date"
              value={start}
              onChange={(event) => setStart(event.target.value)}
              disabled={period !== "custom"}
              className="h-10 bg-(--color-canvas-dark) border border-(--color-hairline-on-dark) rounded-lg px-3 text-body-sm text-(--color-on-dark) disabled:opacity-50"
            />
          </label>
          <label className="flex flex-col gap-1 text-caption text-(--color-muted)">
            End
            <input
              type="date"
              value={end}
              onChange={(event) => setEnd(event.target.value)}
              disabled={period !== "custom"}
              className="h-10 bg-(--color-canvas-dark) border border-(--color-hairline-on-dark) rounded-lg px-3 text-body-sm text-(--color-on-dark) disabled:opacity-50"
            />
          </label>
          <label className="flex flex-col gap-1 text-caption text-(--color-muted)">
            Min
            <input
              type="number"
              min="0"
              value={min}
              onChange={(event) => setMin(event.target.value)}
              className="h-10 bg-(--color-canvas-dark) border border-(--color-hairline-on-dark) rounded-lg px-3 text-body-sm text-(--color-on-dark)"
            />
          </label>
          <label className="flex flex-col gap-1 text-caption text-(--color-muted)">
            Max
            <input
              type="number"
              min="0"
              value={max}
              onChange={(event) => setMax(event.target.value)}
              className="h-10 bg-(--color-canvas-dark) border border-(--color-hairline-on-dark) rounded-lg px-3 text-body-sm text-(--color-on-dark)"
            />
          </label>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
          <label className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-muted)" />
            <input
              type="search"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Search"
              className="h-10 w-full bg-(--color-canvas-dark) border border-(--color-hairline-on-dark) rounded-lg pl-9 pr-3 text-body-sm text-(--color-on-dark)"
            />
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={applyFilters}
              className="h-10 flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-(--color-primary) text-(--color-on-primary) px-4 text-button"
            >
              <SlidersHorizontal size={16} /> Apply
            </button>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-(--color-hairline-on-dark) text-(--color-muted) hover:text-(--color-on-dark)"
                aria-label="Clear dashboard filters"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
