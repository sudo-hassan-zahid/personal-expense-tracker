"use client";

import { addSplitExpense } from "@/actions/expense";
import { ActionForm, SubmitButton } from "@/components/ActionForm";
import { getTodayPKT } from "@/lib/date-utils";
import { CategorySelect } from "@/components/CategorySelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { HelpLabel, HelpTip } from "@/components/HelpTip";
import type { Category } from "@/types";

export function SplitExpenseForm({ categories, currency }: { categories: Category[]; currency: string }) {
  return (
    <div className="bg-(--color-surface-card-dark) rounded-xl p-4 md:p-6 text-(--color-on-dark) border border-(--color-hairline-on-dark)">
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-title-md">Split Expense</h2>
        <HelpTip label="Split expense help">
          Break one shared purchase into separate category amounts while keeping a shared note and date.
        </HelpTip>
      </div>
      <ActionForm action={addSplitExpense} successMessage="Split expense saved" className="grid gap-3">
        <input type="hidden" name="currency" value={currency} />
        <DatePicker
          name="date"
          defaultValue={getTodayPKT()}
          label="Date"
          help="The day this shared expense happened."
        />
        <HelpLabel help="Optional description shared by every split row." className="mb-[-0.25rem]">
          Shared note
        </HelpLabel>
        <input name="note" placeholder="Shared note" className="form-control text-body-md" />
        {[0, 1, 2].map((index) => (
          <div key={index} className="grid grid-cols-1 gap-2 rounded-lg border border-(--color-hairline-on-dark) p-3">
            <CategorySelect
              categories={categories}
              type="expense"
              name="split_category"
              label={`Split ${index + 1} category`}
              required={index < 2}
              help="The category for this part of the shared expense."
            />
            <label className="block">
              <HelpLabel help="The amount assigned to this split line." className="mb-1">
                Split {index + 1} amount
              </HelpLabel>
              <input
                name="split_amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                required={index < 2}
                className="form-control w-full text-body-md"
              />
            </label>
          </div>
        ))}
        <SubmitButton className="w-full bg-(--color-primary) text-(--color-on-primary) text-button rounded-md py-3">Save Split</SubmitButton>
      </ActionForm>
    </div>
  );
}
