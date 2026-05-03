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
import { format, parseISO, eachDayOfInterval, startOfMonth, startOfDay, endOfDay } from "date-fns";
import { formatCurrency } from "@/lib/currency";
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
  displayDate?: string;
};

function isTransactionType(value: string): value is "all" | "income" | "expense" {
  return value === "all" || value === "income" || value === "expense";
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
      const cats = transactions.reduce((acc, t) => {
        const c = t.type === "income" ? t.source : t.category;
        if (c) acc.add(c.toLowerCase());
        return acc;
      }, new Set<string>());
      return Array.from(cats).sort();
    }, [transactions]);

    const chartData = useMemo(() => {
      try {
        let filtered = transactions;
        const { start: startDate, end: endDate } = dateRange;
        if (!startDate || !endDate || isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          return [];
        }

        // Generate all days in range
        const allDays = eachDayOfInterval({ start: startDate, end: endDate });
        const chartDataMap = new Map<string, ChartDatum>();

        allDays.forEach((day) => {
          const d = format(day, "yyyy-MM-dd");
          chartDataMap.set(d, { date: d, income: 0, expense: 0 });
        });

        // Pre-filter by our precise date range
        filtered = filtered.filter((t) => {
          const tDate = new Date(t.date);
          return tDate >= startOfDay(startDate) && tDate <= endOfDay(endDate);
        });

        // Type filter
        if (filterType !== "all") {
          filtered = filtered.filter((t) => t.type === filterType);
        }

        // Category filter
        if (filterCategory !== "all") {
          filtered = filtered.filter((t) => {
            const c = t.type === "income" ? t.source : t.category;
            return c?.toLowerCase() === filterCategory.toLowerCase();
          });
        }

        // Status filter: If enabled, only show completed transactions
        const transactionsToProcess = enableStatusTracking
          ? filtered.filter((t) => t.status === "done")
          : filtered;

        transactionsToProcess.forEach((t) => {
          const dateKey = t.date.includes("T") ? t.date.split("T")[0] : t.date;

          if (chartDataMap.has(dateKey)) {
            const entry = chartDataMap.get(dateKey);
            if (!entry) return;
            if (t.type === "income") entry.income += Number(t.amount);
            else entry.expense += Number(t.amount);
          }
        });

        return Array.from(chartDataMap.values())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((d) => ({
            ...d,
            displayDate: format(parseISO(d.date), "MMM dd"),
          }));
      } catch (error) {
        console.error("Error processing chart data:", error);
        return [];
      }
    }, [transactions, dateRange, filterType, filterCategory, enableStatusTracking]);

    return (
      <div className="w-full bg-(--color-surface-card-dark) p-4 md:p-8 rounded-2xl border border-(--color-hairline-on-dark) flex flex-col gap-8 shadow-2xl relative overflow-hidden animate-slide-up">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 animate-slide-up stagger-1">
          <div>
            <h2 className="text-[20px] md:text-[24px] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 font-bold mb-1">
              Financial Performance Analytics
            </h2>
            <p className="text-caption text-(--color-muted)">
              Interactive visualization of your financial trends
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
              className="bg-transparent hover:bg-(--color-surface-elevated-dark) transition-colors rounded-lg px-3 py-2 text-body-sm text-(--color-on-dark) focus:outline-none cursor-pointer border-none"
            >
              <option value="all" className="bg-(--color-surface-elevated-dark)">
                All Types
              </option>
              <option value="income" className="bg-(--color-surface-elevated-dark)">
                Income Only
              </option>
              <option value="expense" className="bg-(--color-surface-elevated-dark)">
                Expense Only
              </option>
            </select>

            <div className="w-px h-6 bg-(--color-hairline-on-dark)" />

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-transparent hover:bg-(--color-surface-elevated-dark) transition-colors rounded-lg px-3 py-2 text-body-sm text-(--color-on-dark) focus:outline-none cursor-pointer capitalize border-none"
            >
              <option value="all" className="bg-(--color-surface-elevated-dark)">
                All Categories
              </option>
              {categories.map((c) => (
                <option key={c} value={c} className="bg-(--color-surface-elevated-dark)">
                  {c}
                </option>
              ))}
            </select>
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
              <div className="text-4xl mb-2 opacity-50">📊</div>
              No data for selected filters.
            </div>
          ) : isMounted ? (
            <>
              {/* 
                ResponsiveContainer is wrapped in a div with fixed height to prevent 
                the 'width(-1) and height(-1)' warning. Added minWidth/minHeight 
                and debounce to ensure stable rendering during layout transitions.
              */}
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0} debounce={10}>
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
                    tickFormatter={(val) => compactNumberFormatter.format(val)}
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
            </>
          ) : (
            <div className="h-full w-full bg-(--color-canvas-dark)/10 animate-pulse rounded-xl" />
          )}
        </div>
      </div>
    );
  }
);

DashboardChart.displayName = "DashboardChart";

