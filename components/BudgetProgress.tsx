import { AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import type { Expense, MonthlyBudget } from "@/types";

export function BudgetProgress({
  budgets,
  expenses,
  currency,
}: {
  budgets: MonthlyBudget[];
  expenses: Expense[];
  currency: string;
}) {
  if (budgets.length === 0) return null;

  return (
    <section className="bg-(--color-surface-card-dark) rounded-xl border border-(--color-hairline-on-dark) p-5 animate-slide-up stagger-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-title-md">Budget Progress</h2>
        <AlertTriangle size={18} className="text-(--color-primary)" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {budgets.map((budget) => {
          const spent = expenses
            .filter((expense) => expense.category === budget.category)
            .reduce((sum, expense) => sum + Number(expense.amount), 0);
          const limit = Number(budget.limit_amount) + Number(budget.rollover_amount || 0);
          const threshold = Number(budget.alert_threshold);
          const pct = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
          const isOver = spent > limit;
          const isAlerting = spent / limit >= threshold;

          return (
            <div key={budget.id} className="border border-(--color-hairline-on-dark) rounded-lg p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-body-sm text-(--color-on-dark) truncate">{budget.category}</span>
                <span className={`text-caption ${isOver ? "text-(--color-trading-down)" : isAlerting ? "text-(--color-primary)" : "text-(--color-muted)"}`}>
                  {isOver ? "Over" : isAlerting ? "Alert" : "On track"}
                </span>
              </div>
              <div className="mt-3 h-2 bg-(--color-canvas-dark) rounded-full overflow-hidden">
                <div
                  className={`h-full ${isOver ? "bg-(--color-trading-down)" : isAlerting ? "bg-(--color-primary)" : "bg-(--color-trading-up)"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-caption text-(--color-muted)">
                <span>{formatCurrency(spent, currency)} used</span>
                <span>{formatCurrency(Math.max(0, limit - spent), currency)} left</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
