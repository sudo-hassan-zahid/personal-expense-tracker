/**
 * Component: DashboardChart.tsx
 */
"use client";

import { useState, useMemo, useEffect, memo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfDay,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { formatCurrency } from "@/lib/currency";
import { HelpTip } from "./HelpTip";
import { DateRangePicker } from "./ui/DateRangePicker";
import { Transaction } from "@/types";

const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

type ChartDatum = {
  date: string;
  income: number;
  expense: number;
  displayDate: string;
};

type SummaryTotals = {
  filteredIncome: number;
  filteredExpense: number;
  matchingTransactions: number;
  selectedCategoryLabel: string | null;
  selectedCategoryTotal: number;
};

type ChartGranularity = "day" | "week" | "month";

function isTransactionType(value: string): value is "all" | "income" | "expense" {
  return value === "all" || value === "income" || value === "expense";
}

function getChartGranularity(start: Date, end: Date): ChartGranularity {
  const daySpan = differenceInCalendarDays(end, start);

  if (daySpan > 180) return "month";
  if (daySpan > 45) return "week";
  return "day";
}

function buildBuckets(start: Date, end: Date, granularity: ChartGranularity): ChartDatum[] {
  if (granularity === "month") {
    return eachMonthOfInterval({ start, end }).map((date) => ({
      date: format(date, "yyyy-MM-01"),
      income: 0,
      expense: 0,
      displayDate: format(date, "MMM yyyy"),
    }));
  }

  if (granularity === "week") {
    return eachWeekOfInterval(
      { start, end },
      {
        weekStartsOn: 1,
      }
    ).map((date) => ({
      date: format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd"),
      income: 0,
      expense: 0,
      displayDate: format(date, "MMM d"),
    }));
  }

  return eachDayOfInterval({ start, end }).map((date) => ({
    date: format(date, "yyyy-MM-dd"),
    income: 0,
    expense: 0,
    displayDate: format(date, "MMM dd"),
  }));
}

function getBucketKey(dateValue: string, granularity: ChartGranularity) {
  const date = parseISO(dateValue.includes("T") ? dateValue : `${dateValue}T00:00:00`);

  if (granularity === "month") return format(date, "yyyy-MM-01");
  if (granularity === "week") return format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd");
  return format(date, "yyyy-MM-dd");
}

/**
 * Component for rendering the transaction history chart and summary statistics.
 */
export const DashboardChart = memo(
  ({
    transactions,
    currency,
    enableStatusTracking,
  }: {
    transactions: Transaction[];
    currency: string;
    enableStatusTracking?: boolean;
  }) => {
    const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
      start: startOfMonth(new Date()),
      end: new Date(),
    });
    const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true);
    }, []);

    const categories = useMemo(() => {
      const categoryMap = transactions.reduce((acc, transaction) => {
        const categoryName =
          transaction.type === "income" ? transaction.source : transaction.category;
        if (!categoryName) return acc;

        const normalizedName = categoryName.toLowerCase();
        if (!acc.has(normalizedName)) {
          acc.set(normalizedName, categoryName);
        }

        return acc;
      }, new Map<string, string>());

      return Array.from(categoryMap.entries())
        .sort((a, b) => a[1].localeCompare(b[1]))
        .map(([value, label]) => ({ value, label }));
    }, [transactions]);

    const selectedCategoryLabel =
      filterCategory === "all"
        ? null
        : categories.find((category) => category.value === filterCategory)?.label || filterCategory;

    const { chartData, summaryTotals } = useMemo(() => {
      try {
        const { start: startDate, end: endDate } = dateRange;
        if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          return {
            chartData: [],
            summaryTotals: {
              filteredIncome: 0,
              filteredExpense: 0,
              matchingTransactions: 0,
              selectedCategoryLabel,
              selectedCategoryTotal: 0,
            },
          };
        }

        const rangeStart = startOfDay(startDate).getTime();
        const rangeEnd = endOfDay(endDate).getTime();
        const granularity = getChartGranularity(startDate, endDate);
        const chartDataMap = new Map<string, ChartDatum>();
        const summary: SummaryTotals = {
          filteredIncome: 0,
          filteredExpense: 0,
          matchingTransactions: 0,
          selectedCategoryLabel,
          selectedCategoryTotal: 0,
        };

        buildBuckets(startDate, endDate, granularity).forEach((bucket) => {
          chartDataMap.set(bucket.date, bucket);
        });

        for (const transaction of transactions) {
          if (enableStatusTracking && transaction.status !== "done") continue;
          if (filterType !== "all" && transaction.type !== filterType) continue;

          if (filterCategory !== "all") {
            const categoryName =
              transaction.type === "income" ? transaction.source : transaction.category;
            if (categoryName?.toLowerCase() !== filterCategory.toLowerCase()) continue;
          }

          const transactionTime = new Date(transaction.date).getTime();
          if (transactionTime < rangeStart || transactionTime > rangeEnd) continue;

          const amount = Number(transaction.amount);
          const bucketKey = getBucketKey(transaction.date, granularity);
          const entry = chartDataMap.get(bucketKey);
          summary.matchingTransactions += 1;

          if (transaction.type === "income") {
            summary.filteredIncome += amount;
            if (entry) entry.income += amount;
          } else {
            summary.filteredExpense += amount;
            if (entry) entry.expense += amount;
          }

          if (selectedCategoryLabel) {
            summary.selectedCategoryTotal += amount;
          }
        }

        return {
          chartData: Array.from(chartDataMap.values()),
          summaryTotals: summary,
        };
      } catch (error) {
        console.error("Error processing chart data:", error);
        return {
          chartData: [],
          summaryTotals: {
            filteredIncome: 0,
            filteredExpense: 0,
            matchingTransactions: 0,
            selectedCategoryLabel,
            selectedCategoryTotal: 0,
          },
        };
      }
    }, [
      dateRange,
      enableStatusTracking,
      filterCategory,
      filterType,
      selectedCategoryLabel,
      transactions,
    ]);

    return (
      <div className="w-full bg-(--color-surface-card-dark) p-4 md:p-8 rounded-2xl border border-(--color-hairline-on-dark) flex flex-col gap-8 shadow-2xl relative overflow-hidden animate-slide-up">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 animate-slide-up stagger-1">
          <div>
            <h2 className="text-[20px] md:text-[24px] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 font-bold mb-1">
              Cash Flow Overview
            </h2>
            <p className="text-caption text-(--color-muted)">
              Income and expense trends for the selected period
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 p-1.5 bg-(--color-canvas-dark)/50 backdrop-blur-md border border-(--color-hairline-on-dark) rounded-xl">
            <DateRangePicker
              onRangeChange={(start, end) => setDateRange({ start, end })}
              className="border-none bg-transparent"
            />

            <div className="w-px h-6 bg-(--color-hairline-on-dark)" />

            <select
              value={filterType}
              onChange={(e) => {
                if (isTransactionType(e.target.value)) setFilterType(e.target.value);
              }}
              className="form-control border-none px-3 py-2"
            >
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>

            <div className="w-px h-6 bg-(--color-hairline-on-dark)" />

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="form-control border-none px-3 py-2 capitalize"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 relative z-10">
          <div className="rounded-xl border border-(--color-hairline-on-dark) bg-(--color-canvas-dark)/35 p-4">
            <div className="mb-1 flex items-center gap-2 text-caption text-(--color-muted)">
              <span>Filtered Spend</span>
              <HelpTip label="Filtered spend help">
                Total expenses for the current chart date range, type, category, and status filters.
              </HelpTip>
            </div>
            <div className="text-title-md text-(--color-trading-down)">
              {formatCurrency(summaryTotals.filteredExpense, currency)}
            </div>
          </div>
          <div className="rounded-xl border border-(--color-hairline-on-dark) bg-(--color-canvas-dark)/35 p-4">
            <div className="mb-1 flex items-center gap-2 text-caption text-(--color-muted)">
              <span>Filtered Income</span>
              <HelpTip label="Filtered income help">
                Total income for the current chart date range, type, category, and status filters.
              </HelpTip>
            </div>
            <div className="text-title-md text-(--color-trading-up)">
              {formatCurrency(summaryTotals.filteredIncome, currency)}
            </div>
          </div>
          <div className="rounded-xl border border-(--color-hairline-on-dark) bg-(--color-canvas-dark)/35 p-4">
            <div className="mb-1 flex items-center gap-2 text-caption text-(--color-muted)">
              <span>
                {selectedCategoryLabel ? `${selectedCategoryLabel} Total` : "Matching Rows"}
              </span>
              <HelpTip label="Chart filtered total help">
                When a category or source is selected, this shows its total in the chart view.
                Otherwise it shows how many transactions match the current chart filters.
              </HelpTip>
            </div>
            <div className="text-title-md text-(--color-on-dark)">
              {selectedCategoryLabel
                ? formatCurrency(summaryTotals.selectedCategoryTotal, currency)
                : `${summaryTotals.matchingTransactions} transaction${summaryTotals.matchingTransactions === 1 ? "" : "s"}`}
            </div>
          </div>
        </div>

        <div
          className="h-[280px] md:h-[380px] min-h-[280px] md:min-h-[380px] w-full relative z-10 animate-slide-up stagger-2 min-w-0"
          role="region"
          aria-label="Cashflow analytics chart"
          title="Cashflow Analytics Chart"
        >
          {chartData.length === 0 ? (
            <div className="h-full w-full flex flex-col items-center justify-center text-(--color-muted) text-body-md border border-dashed border-(--color-hairline-on-dark) rounded-xl bg-(--color-canvas-dark)/20 animate-fade-in transition-all duration-500">
              <div className="text-4xl mb-2 opacity-50">[]</div>
              No data for selected filters.
            </div>
          ) : isMounted ? (
            <ResponsiveContainer
              width="100%"
              height="100%"
              minWidth={0}
              minHeight={0}
              initialDimension={{ width: 800, height: 380 }}
              debounce={10}
            >
              <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="4 4"
                  vertical={false}
                  stroke="var(--color-hairline-on-dark)"
                  opacity={0.4}
                />
                <XAxis
                  dataKey="displayDate"
                  stroke="var(--color-muted)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={15}
                  tick={{ fill: "var(--color-muted)" }}
                />
                <YAxis
                  stroke="var(--color-muted)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => compactNumberFormatter.format(Number(value) || 0)}
                  dx={-10}
                  tick={{ fill: "var(--color-muted)" }}
                />

                <Tooltip
                  cursor={{
                    stroke: "var(--color-primary)",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                    fill: "transparent",
                  }}
                  contentStyle={{
                    backgroundColor: "rgba(23, 23, 23, 0.85)",
                    border: "1px solid var(--color-hairline-on-dark)",
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                    backdropFilter: "blur(12px)",
                  }}
                  itemStyle={{ fontWeight: 600 }}
                  labelStyle={{ color: "var(--color-muted)", marginBottom: "4px" }}
                  formatter={(value: unknown) => [
                    formatCurrency(Number(value) || 0, currency),
                    undefined,
                  ]}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }} iconType="circle" />

                {(filterType === "all" || filterType === "income") && (
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#10b981"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    name="Income"
                    activeDot={{
                      r: 6,
                      strokeWidth: 2,
                      stroke: "#10b981",
                      fill: "var(--color-canvas-dark)",
                    }}
                    isAnimationActive={true}
                    animationDuration={500}
                    animationBegin={100}
                    animationEasing="ease-in-out"
                  />
                )}
                {(filterType === "all" || filterType === "expense") && (
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorExpense)"
                    name="Expense"
                    activeDot={{
                      r: 6,
                      strokeWidth: 2,
                      stroke: "#ef4444",
                      fill: "var(--color-canvas-dark)",
                    }}
                    isAnimationActive={true}
                    animationDuration={500}
                    animationBegin={200}
                    animationEasing="ease-in-out"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full bg-(--color-canvas-dark)/10 animate-pulse rounded-xl" />
          )}
        </div>
      </div>
    );
  }
);

DashboardChart.displayName = "DashboardChart";
