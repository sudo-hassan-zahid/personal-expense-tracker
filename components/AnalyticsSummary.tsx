"use client";

import { useMemo } from "react";
import { BarChart3, Gauge, Landmark, Trophy } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { HelpTip } from "./HelpTip";
import type { Transaction } from "@/types";

function getAnalytics(transactions: Transaction[], enableStatusTracking: boolean) {
  const topCategoryTotals = new Map<string, number>();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
  let inflow = 0;
  let outflow = 0;
  let expenseMinDate = Number.POSITIVE_INFINITY;
  let expenseMaxDate = Number.NEGATIVE_INFINITY;
  let currentIncome = 0;
  let currentExpense = 0;

  for (const transaction of transactions) {
    if (enableStatusTracking && transaction.status !== "done") continue;

    const amount = Number(transaction.amount);
    const transactionDate = new Date(transaction.date);
    const year = transactionDate.getFullYear();

    if (transaction.type === "income") {
      inflow += amount;
      if (year === currentYear) currentIncome += amount;
      continue;
    }

    outflow += amount;
    if (year === currentYear) currentExpense += amount;
    topCategoryTotals.set(transaction.category, (topCategoryTotals.get(transaction.category) || 0) + amount);
    const time = transactionDate.getTime();
    if (time < expenseMinDate) expenseMinDate = time;
    if (time > expenseMaxDate) expenseMaxDate = time;
  }

  const activeExpenseDays =
    Number.isFinite(expenseMinDate) && Number.isFinite(expenseMaxDate)
      ? Math.max(
          1,
          Math.floor((expenseMaxDate - expenseMinDate) / (1000 * 60 * 60 * 24)) + 1
        )
      : 0;
  const averageDailySpend = activeExpenseDays > 0 ? outflow / activeExpenseDays : 0;

  return {
    cashFlow: { opening: 0, inflow, outflow, closing: inflow - outflow },
    topCategories: Array.from(topCategoryTotals.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3),
    averageDailySpend,
    forecast: averageDailySpend * daysInMonth,
    yearlyNet: currentIncome - currentExpense,
  };
}

export function AnalyticsSummary({
  transactions,
  currency,
  enableStatusTracking,
}: {
  transactions: Transaction[];
  currency: string;
  enableStatusTracking: boolean;
}) {
  const { cashFlow, topCategories, averageDailySpend, forecast, yearlyNet } = useMemo(
    () => getAnalytics(transactions, enableStatusTracking),
    [transactions, enableStatusTracking]
  );

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up stagger-4">
      <div className="bg-(--color-surface-card-dark) p-5 rounded-xl border border-(--color-hairline-on-dark)">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-title-sm text-(--color-on-dark)">Cash Flow</h2>
            <HelpTip label="Cash flow help">
              Shows inflow, outflow, opening balance, and closing balance from completed
              transactions.
            </HelpTip>
          </div>
          <Landmark size={18} className="text-(--color-primary)" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-caption text-(--color-muted)">Inflow</div>
            <div className="text-number-md text-(--color-trading-up)">
              {formatCurrency(cashFlow.inflow, currency)}
            </div>
          </div>
          <div>
            <div className="text-caption text-(--color-muted)">Outflow</div>
            <div className="text-number-md text-(--color-trading-down)">
              {formatCurrency(cashFlow.outflow, currency)}
            </div>
          </div>
          <div>
            <div className="text-caption text-(--color-muted)">Opening</div>
            <div className="text-number-md text-(--color-on-dark)">
              {formatCurrency(cashFlow.opening, currency)}
            </div>
          </div>
          <div>
            <div className="text-caption text-(--color-muted)">Closing</div>
            <div className="text-number-md text-(--color-on-dark)">
              {formatCurrency(cashFlow.closing, currency)}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-(--color-surface-card-dark) p-5 rounded-xl border border-(--color-hairline-on-dark)">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-title-sm text-(--color-on-dark)">Top Spending</h2>
            <HelpTip label="Top spending help">
              Ranks expense categories by total spend in the current transaction set.
            </HelpTip>
          </div>
          <Trophy size={18} className="text-(--color-primary)" />
        </div>
        <div className="flex flex-col gap-3">
          {topCategories.length === 0 ? (
            <p className="text-body-sm text-(--color-muted)">No expense categories yet.</p>
          ) : (
            topCategories.map((category) => (
              <div key={category.name} className="flex items-center justify-between gap-4">
                <span className="text-body-sm text-(--color-on-dark) truncate">
                  {category.name}
                </span>
                <span className="text-number-sm text-(--color-trading-down)">
                  {formatCurrency(category.amount, currency)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-(--color-surface-card-dark) p-5 rounded-xl border border-(--color-hairline-on-dark)">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-title-sm text-(--color-on-dark)">Daily Pace</h2>
            <HelpTip label="Daily pace help">
              Estimates average daily expense, monthly forecast, and current yearly net.
            </HelpTip>
          </div>
          <Gauge size={18} className="text-(--color-primary)" />
        </div>
        <div className="text-number-display text-(--color-on-dark)">
          {formatCurrency(averageDailySpend, currency)}
        </div>
        <div className="mt-2 flex items-center gap-2 text-caption text-(--color-muted)">
          <BarChart3 size={14} />
          Average expense per active day
        </div>
        <div className="mt-3 text-caption text-(--color-muted)">
          Forecast: {formatCurrency(forecast, currency)}
        </div>
        <div className="mt-1 text-caption text-(--color-muted)">
          This year net: {formatCurrency(yearlyNet, currency)}
        </div>
      </div>
    </section>
  );
}
