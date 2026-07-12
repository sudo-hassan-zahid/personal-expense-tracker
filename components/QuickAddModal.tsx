"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { addExpense } from "@/actions/expense";
import { addIncome } from "@/actions/income";
import { ActionForm, SubmitButton } from "@/components/ActionForm";
import { CategorySelect } from "@/components/CategorySelect";
import { DatePicker } from "@/components/ui/DatePicker";
import { FullscreenModal } from "@/components/ui/FullscreenModal";
import { RichDescriptionEditor } from "@/components/RichDescriptionEditor";
import { getTodayPKT } from "@/lib/date-utils";
import type { Category } from "@/types";

export function QuickAddModal({
  expenseCategories,
  incomeCategories,
  currency,
}: {
  expenseCategories: Category[];
  incomeCategories: Category[];
  currency: string;
}) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"expense" | "income">("expense");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center gap-2 rounded-lg bg-(--color-primary) px-4 text-button text-(--color-on-primary)"
      >
        <Plus size={16} /> Quick Add
      </button>
      {open && (
        <FullscreenModal title="Quick Add" onClose={() => setOpen(false)} widthClassName="max-w-2xl">
          <div className="flex flex-col gap-4">
            <div className="mb-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => setType("expense")}
                className={`h-10 rounded-lg border text-button transition-colors ${type === "expense" ? "border-(--color-primary) bg-(--color-primary) text-(--color-on-primary)" : "border-(--color-hairline-on-dark) text-(--color-on-dark) hover:bg-(--color-surface-elevated-dark)"}`}
              >
                Expense
              </button>
              <button
                onClick={() => setType("income")}
                className={`h-10 rounded-lg border text-button transition-colors ${type === "income" ? "border-(--color-primary) bg-(--color-primary) text-(--color-on-primary)" : "border-(--color-hairline-on-dark) text-(--color-on-dark) hover:bg-(--color-surface-elevated-dark)"}`}
              >
                Income
              </button>
            </div>
            <ActionForm
              action={type === "expense" ? addExpense : addIncome}
              clearOnSubmit
              successMessage={`${type === "expense" ? "Expense" : "Income"} added`}
              className="grid gap-3"
              onSuccess={() => setOpen(false)}
            >
              <input type="hidden" name="currency" value={currency} />
              <input
                required
                autoFocus
                name="amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="Amount"
                className="form-control"
              />
              {type === "expense" ? (
                <CategorySelect
                  categories={expenseCategories}
                  type="expense"
                  name="category"
                  label="Category"
                />
              ) : (
                <CategorySelect
                  categories={incomeCategories}
                  type="income"
                  name="source"
                  label="Source"
                />
              )}
              <DatePicker name="date" defaultValue={getTodayPKT()} label="Date" />
              <input name="note" placeholder="Note" className="form-control" />
              <RichDescriptionEditor />
              {type === "expense" && (
                <input name="attachment" type="file" className="form-control" />
              )}
              <SubmitButton className="bg-(--color-primary) text-(--color-on-primary) rounded-lg py-3 text-button">
                Save
              </SubmitButton>
            </ActionForm>
          </div>
        </FullscreenModal>
      )}
    </>
  );
}
