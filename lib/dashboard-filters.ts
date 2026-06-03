import { endOfMonth, format, startOfMonth, subDays } from "date-fns";
import { getCurrentPKTDate } from "@/lib/date-utils";

export type DashboardPeriod = "this-month" | "last-30" | "all" | "custom";

export type DashboardFilters = {
  period: DashboardPeriod;
  startDate?: string;
  endDate?: string;
  month?: string;
  carryForward?: boolean;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isValidDate(value: string | undefined) {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

function parseAmount(value: string | undefined) {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export function parseDashboardFilters(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  defaultPeriod: DashboardPeriod = "this-month",
  defaultCarryForward = false
): DashboardFilters {
  const today = getCurrentPKTDate();
  const requestedPeriod = firstParam(searchParams?.period) as DashboardPeriod | undefined;
  const month = firstParam(searchParams?.month);
  const start = firstParam(searchParams?.start);
  const end = firstParam(searchParams?.end);
  const requestedCarryForward = firstParam(searchParams?.carryForward);
  const carryForward = requestedCarryForward ? requestedCarryForward === "1" : defaultCarryForward;
  const rawSearch = firstParam(searchParams?.q)?.trim();
  const period: DashboardPeriod =
    requestedPeriod && ["this-month", "last-30", "all", "custom"].includes(requestedPeriod)
      ? requestedPeriod
      : defaultPeriod;

  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const monthDate = new Date(`${month}-01T00:00:00`);
    return {
      period: "custom",
      startDate: format(startOfMonth(monthDate), "yyyy-MM-dd"),
      endDate: format(endOfMonth(monthDate), "yyyy-MM-dd"),
      month,
      carryForward,
      minAmount: parseAmount(firstParam(searchParams?.min)),
      maxAmount: parseAmount(firstParam(searchParams?.max)),
      search: rawSearch || undefined,
    };
  }

  if (period === "all") {
    return {
      period,
      carryForward: false,
      minAmount: parseAmount(firstParam(searchParams?.min)),
      maxAmount: parseAmount(firstParam(searchParams?.max)),
      search: rawSearch || undefined,
    };
  }

  if (period === "last-30") {
    return {
      period,
      startDate: format(subDays(today, 29), "yyyy-MM-dd"),
      endDate: format(today, "yyyy-MM-dd"),
      carryForward: false,
      minAmount: parseAmount(firstParam(searchParams?.min)),
      maxAmount: parseAmount(firstParam(searchParams?.max)),
      search: rawSearch || undefined,
    };
  }

  if (period === "custom" && isValidDate(start) && isValidDate(end)) {
    return {
      period,
      startDate: start,
      endDate: end,
      carryForward,
      minAmount: parseAmount(firstParam(searchParams?.min)),
      maxAmount: parseAmount(firstParam(searchParams?.max)),
      search: rawSearch || undefined,
    };
  }

  return {
    period: "this-month",
    startDate: format(startOfMonth(today), "yyyy-MM-dd"),
    endDate: format(endOfMonth(today), "yyyy-MM-dd"),
    month: format(today, "yyyy-MM"),
    carryForward,
    minAmount: parseAmount(firstParam(searchParams?.min)),
    maxAmount: parseAmount(firstParam(searchParams?.max)),
    search: rawSearch || undefined,
  };
}

export function describeDashboardPeriod(filters: DashboardFilters) {
  if (filters.period === "all") return "All time";
  if (filters.startDate && filters.endDate) return `${filters.startDate} to ${filters.endDate}`;
  return "Selected period";
}
