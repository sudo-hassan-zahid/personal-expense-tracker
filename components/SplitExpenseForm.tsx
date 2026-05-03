"use client";

import { addSplitExpense } from "@/actions/expense";
import { ActionForm, SubmitButton } from "@/components/ActionForm";
import { getTodayPKT } from "@/lib/date-utils";
import { CategorySelect } from "@/components/CategorySelect";
import { DatePicker } from "@/components/ui/DatePicker";
import type { Category } from "@/types";

export function SplitExpenseForm({ categories, currency }: { categories: Category[]; currency: string }) {
  return (
    <div className="bg-(--color-surface-card-dark) rounded-xl p-4 md:p-6 text-(--color-on-dark) border border-(--color-hairline-on-dark)">
      <h2 className="text-title-md mb-4">Split Expense</h2>
      <ActionForm action={addSplitExpense} successMessage="Split expense saved" className="grid gap-3">
        <input type="hidden" name="currency" value={currency} />
        <DatePicker name="date" defaultValue={getTodayPKT()} label="Date" />
        <input name="note" placeholder="Shared note" className="bg-transparent border border-(--color-hairline-on-dark) rounded-md px-3 py-2 text-body-md" />
        {[0, 1, 2].map((index) => (
          <div key={index} className="grid grid-cols-1 gap-2 rounded-lg border border-(--color-hairline-on-dark) p-3">
            <CategorySelect
              categories={categories}
              type="expense"
              name="split_category"
              label={`Split ${index + 1} category`}
              required={index < 2}
            />
            <label className="block">
              <span className="block text-body-sm mb-1 text-(--color-muted)">
                Split {index + 1} amount
              </span>
              <input
                name="split_amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                required={index < 2}
                className="w-full bg-transparent border border-(--color-hairline-on-dark) rounded-md px-3 py-2 text-body-md text-(--color-on-dark) focus:border-(--color-primary) focus:outline-none"
              />
            </label>
          </div>
        ))}
        <SubmitButton className="w-full bg-(--color-primary) text-(--color-on-primary) text-button rounded-md py-3">Save Split</SubmitButton>
      </ActionForm>
    </div>
  );
}
