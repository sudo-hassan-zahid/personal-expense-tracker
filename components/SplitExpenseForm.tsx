"use client";

import { addSplitExpense } from "@/actions/expense";
import { ActionForm, SubmitButton } from "@/components/ActionForm";
import { getTodayPKT } from "@/lib/date-utils";
import type { Category } from "@/types";

export function SplitExpenseForm({ categories, currency }: { categories: Category[]; currency: string }) {
  return (
    <div className="bg-(--color-surface-card-dark) rounded-xl p-4 md:p-6 text-(--color-on-dark) border border-(--color-hairline-on-dark)">
      <h2 className="text-title-md mb-4">Split Expense</h2>
      <ActionForm action={addSplitExpense} successMessage="Split expense saved" className="grid gap-3">
        <input type="hidden" name="currency" value={currency} />
        <input name="date" type="date" defaultValue={getTodayPKT()} className="bg-transparent border border-(--color-hairline-on-dark) rounded-md px-3 py-2 text-body-md" />
        <input name="note" placeholder="Shared note" className="bg-transparent border border-(--color-hairline-on-dark) rounded-md px-3 py-2 text-body-md" />
        {[0, 1, 2].map((index) => (
          <div key={index} className="grid grid-cols-2 gap-2">
            <select name="split_category" className="bg-(--color-canvas-dark) border border-(--color-hairline-on-dark) rounded-md px-3 py-2 text-body-sm">
              <option value="">Category</option>
              {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
            </select>
            <input name="split_amount" type="number" min="0" step="0.01" placeholder="Amount" className="bg-transparent border border-(--color-hairline-on-dark) rounded-md px-3 py-2 text-number-md" />
          </div>
        ))}
        <SubmitButton className="w-full bg-(--color-primary) text-(--color-on-primary) text-button rounded-md py-3">Save Split</SubmitButton>
      </ActionForm>
    </div>
  );
}
