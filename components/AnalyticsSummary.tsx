import { BarChart3, Gauge, Landmark, Trophy } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import {
  getAverageDailySpend,
  getCompletedTransactions,
  getTopExpenseCategories,
  summarizeCashFlow,
} from "@/lib/analytics";
import type { Transaction } from "@/types";

export function AnalyticsSummary({
  transactions,
  currency,
  enableStatusTracking,
}: {
  transactions: Transaction[];
  currency: string;
  enableStatusTracking: boolean;
}) {
  const completed = getCompletedTransactions(transactions, enableStatusTracking);
  const cashFlow = summarizeCashFlow(completed);
  const topCategories = getTopExpenseCategories(completed);
  const averageDailySpend = getAverageDailySpend(completed);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up stagger-4">
      <div className="bg-(--color-surface-card-dark) p-5 rounded-xl border border-(--color-hairline-on-dark)">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-title-sm text-(--color-on-dark)">Cash Flow</h2>
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
          <h2 className="text-title-sm text-(--color-on-dark)">Top Spending</h2>
          <Trophy size={18} className="text-(--color-primary)" />
        </div>
        <div className="flex flex-col gap-3">
          {topCategories.length === 0 ? (
            <p className="text-body-sm text-(--color-muted)">No expense categories yet.</p>
          ) : (
            topCategories.map((category) => (
              <div key={category.name} className="flex items-center justify-between gap-4">
                <span className="text-body-sm text-(--color-on-dark) truncate">{category.name}</span>
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
          <h2 className="text-title-sm text-(--color-on-dark)">Daily Pace</h2>
          <Gauge size={18} className="text-(--color-primary)" />
        </div>
        <div className="text-number-display text-(--color-on-dark)">
          {formatCurrency(averageDailySpend, currency)}
        </div>
        <div className="mt-2 flex items-center gap-2 text-caption text-(--color-muted)">
          <BarChart3 size={14} />
          Average expense per active day
        </div>
      </div>
    </section>
  );
}
