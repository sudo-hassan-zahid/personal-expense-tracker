"use client";

import { useMemo } from "react";
import { Trash2, Repeat, Target, WalletCards, Upload, Play } from "lucide-react";
import { toast } from "sonner";
import { ActionForm, SubmitButton } from "@/components/ActionForm";
import { deleteBudget, deleteRecurringTransaction, deleteSavingsGoal, postDueRecurringTransactions, saveBudget, saveRecurringTransaction, saveSavingsGoal } from "@/actions/planning";
import { importTransactions } from "@/actions/import";
import { formatCurrency } from "@/lib/currency";
import { DatePicker } from "@/components/ui/DatePicker";
import type { Category, MonthlyBudget, RecurringTransaction, SavingsGoal } from "@/types";

export function PlanningPanel({
  budgets,
  goals,
  recurring,
  expenseCategories,
  incomeCategories,
  month,
  currency,
}: {
  budgets: MonthlyBudget[];
  goals: SavingsGoal[];
  recurring: RecurringTransaction[];
  expenseCategories: Category[];
  incomeCategories: Category[];
  month: string;
  currency: string;
}) {
  const allCategoryNames = useMemo(
    () => [...expenseCategories.map((c) => c.name), ...incomeCategories.map((c) => c.name)],
    [expenseCategories, incomeCategories]
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <section className="xl:col-span-4 bg-(--color-surface-card-dark) rounded-xl border border-(--color-hairline-on-dark) p-5">
        <div className="flex items-center gap-2 mb-4">
          <WalletCards size={18} className="text-(--color-primary)" />
          <h2 className="text-title-md">Budgets</h2>
        </div>
        <ActionForm action={saveBudget} successMessage="Budget saved" className="grid gap-3">
          <input type="hidden" name="month" value={month} />
          <select name="category" required className="form-control">
            <option value="">Category</option>
            {expenseCategories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
          </select>
          <input required name="limit_amount" type="number" min="0" step="0.01" placeholder="Monthly limit" className="form-control" />
          <input name="rollover_amount" type="number" min="0" step="0.01" placeholder="Rollover amount" className="form-control" />
          <input name="alert_threshold" type="number" min="1" max="100" defaultValue="80" placeholder="Alert %" className="form-control" />
          <SubmitButton className="bg-(--color-primary) text-(--color-on-primary) rounded-lg py-2 text-button">Save Budget</SubmitButton>
        </ActionForm>
        <div className="mt-5 grid gap-2">
          {budgets.length === 0 ? <p className="text-body-sm text-(--color-muted)">No budgets for this month.</p> : budgets.map((budget) => (
            <div key={budget.id} className="flex items-center justify-between gap-3 border border-(--color-hairline-on-dark) rounded-lg p-3">
              <div>
                <div className="text-body-sm text-(--color-on-dark)">{budget.category}</div>
                <div className="text-caption text-(--color-muted)">
                  {formatCurrency(Number(budget.limit_amount) + Number(budget.rollover_amount || 0), currency)} available
                </div>
              </div>
              <button onClick={async () => { await deleteBudget(budget.id); toast.success("Budget deleted"); }} className="p-2 text-(--color-muted) hover:text-(--color-trading-down)"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="xl:col-span-4 bg-(--color-surface-card-dark) rounded-xl border border-(--color-hairline-on-dark) p-5">
        <div className="flex items-center gap-2 mb-4">
          <Target size={18} className="text-(--color-primary)" />
          <h2 className="text-title-md">Savings Goals</h2>
        </div>
        <ActionForm action={saveSavingsGoal} successMessage="Goal saved" className="grid gap-3">
          <input required name="name" placeholder="Goal name" className="form-control" />
          <input required name="target_amount" type="number" min="0" step="0.01" placeholder="Target amount" className="form-control" />
          <input name="current_amount" type="number" min="0" step="0.01" placeholder="Current amount" className="form-control" />
          <DatePicker name="target_date" label="Target date" />
          <SubmitButton className="bg-(--color-primary) text-(--color-on-primary) rounded-lg py-2 text-button">Save Goal</SubmitButton>
        </ActionForm>
        <div className="mt-5 grid gap-2">
          {goals.length === 0 ? <p className="text-body-sm text-(--color-muted)">No savings goals yet.</p> : goals.map((goal) => {
            const pct = Math.min(100, (Number(goal.current_amount) / Number(goal.target_amount)) * 100);
            return (
              <div key={goal.id} className="border border-(--color-hairline-on-dark) rounded-lg p-3">
                <div className="flex justify-between gap-3">
                  <span className="text-body-sm">{goal.name}</span>
                  <button onClick={async () => { await deleteSavingsGoal(goal.id); toast.success("Goal deleted"); }} className="text-(--color-muted) hover:text-(--color-trading-down)"><Trash2 size={16} /></button>
                </div>
                <div className="mt-2 h-2 bg-(--color-canvas-dark) rounded-full overflow-hidden"><div className="h-full bg-(--color-primary)" style={{ width: `${pct}%` }} /></div>
                <div className="mt-1 text-caption text-(--color-muted)">{formatCurrency(Number(goal.current_amount), currency)} of {formatCurrency(Number(goal.target_amount), currency)}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="xl:col-span-4 bg-(--color-surface-card-dark) rounded-xl border border-(--color-hairline-on-dark) p-5">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Repeat size={18} className="text-(--color-primary)" />
            <h2 className="text-title-md">Recurring</h2>
          </div>
          <button
            onClick={async () => {
              const result = await postDueRecurringTransactions();
              if (result?.error) toast.error(result.error);
              else toast.success("Due recurring items posted");
            }}
            className="p-2 rounded-lg border border-(--color-hairline-on-dark) text-(--color-muted) hover:text-(--color-on-dark)"
            title="Post due recurring transactions"
          >
            <Play size={16} />
          </button>
        </div>
        <ActionForm action={saveRecurringTransaction} successMessage="Recurring item saved" className="grid gap-3">
          <select name="type" className="form-control"><option value="expense">Expense</option><option value="income">Income</option></select>
          <input required name="amount" type="number" min="0" step="0.01" placeholder="Amount" className="form-control" />
          <select name="category_or_source" required className="form-control">
            <option value="">Category or source</option>
            {allCategoryNames.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
          <select name="frequency" className="form-control"><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select>
          <DatePicker name="next_date" label="Next date" />
          <input name="note" placeholder="Note" className="form-control" />
          <SubmitButton className="bg-(--color-primary) text-(--color-on-primary) rounded-lg py-2 text-button">Save Recurring</SubmitButton>
        </ActionForm>
        <div className="mt-5 grid gap-2">
          {recurring.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 border border-(--color-hairline-on-dark) rounded-lg p-3">
              <div className="min-w-0">
                <div className="text-body-sm truncate">{item.category_or_source}</div>
                <div className="text-caption text-(--color-muted)">{item.frequency} from {item.next_date}</div>
              </div>
              <button onClick={async () => { await deleteRecurringTransaction(item.id); toast.success("Recurring item deleted"); }} className="p-2 text-(--color-muted) hover:text-(--color-trading-down)"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </section>

      <section className="xl:col-span-12 bg-(--color-surface-card-dark) rounded-xl border border-(--color-hairline-on-dark) p-5">
        <div className="flex items-center gap-2 mb-4">
          <Upload size={18} className="text-(--color-primary)" />
          <h2 className="text-title-md">CSV and Bank Statement Import</h2>
        </div>
        <ActionForm action={importTransactions} successMessage="Import completed" className="flex flex-col md:flex-row gap-3">
          <input required name="file" type="file" accept=".csv,text/csv" className="form-control flex-1" />
          <SubmitButton className="bg-(--color-primary) text-(--color-on-primary) rounded-lg px-5 py-2 text-button">Import CSV</SubmitButton>
        </ActionForm>
      </section>
    </div>
  );
}
