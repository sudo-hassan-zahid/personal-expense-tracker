/**
 * Component: EditTransactionModal.tsx
 */
"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import { ActionForm, SubmitButton } from "./ActionForm";
import { updateExpense, deleteExpense, addExpense } from "@/actions/expense";
import { updateIncome, deleteIncome, addIncome } from "@/actions/income";
import { Transaction, Category, Expense, Income } from "@/types";
import { CategorySelect } from "./CategorySelect";
import { DatePicker } from "./ui/DatePicker";
import { HelpLabel, HelpTip } from "./HelpTip";

/**
 * Modal component for editing an existing transaction (expense or income).
 * Handles type switching between income and expense, including data migration between tables.
 */
export function EditTransactionModal({
  transaction,
  expenseCategories,
  incomeCategories,
  onClose,
  showStatusTracking,
}: {
  transaction: Transaction;
  expenseCategories: Category[];
  incomeCategories: Category[];
  onClose: () => void;
  showStatusTracking: boolean;
}) {
  const [status, setStatus] = useState(transaction.status || "done");
  const [type, setType] = useState<"expense" | "income">(transaction.type);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-(--color-surface-card-dark)/80 backdrop-blur-2xl border border-(--color-hairline-on-dark) rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-(--color-hairline-on-dark)">
          <div className="flex items-center gap-2">
            <h2 className="text-title-md text-(--color-on-dark)">Edit Transaction</h2>
            <HelpTip label="Edit transaction help">
              Update the details for this record. Switching type moves it between income and
              expenses.
            </HelpTip>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-(--color-muted) hover:text-(--color-on-dark) transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <ActionForm
            action={async (formData) => {
              // If type changed, we need to delete from old table and insert into new
              if (type !== transaction.type) {
                // First delete from current table
                if (transaction.type === "income") {
                  await deleteIncome(transaction.id);
                  await addExpense(formData);
                } else {
                  await deleteExpense(transaction.id);
                  await addIncome(formData);
                }
              } else {
                // Normal update
                if (type === "income") {
                  await updateIncome(transaction.id, formData);
                } else {
                  await updateExpense(transaction.id, formData);
                }
              }
              onClose();
            }}
            successMessage="Transaction updated successfully!"
            className="flex flex-col gap-5"
          >
            {/* Type Switcher */}
            <div>
              <HelpLabel
                help="Switches whether this record is treated as income or an expense."
                className="mb-1"
              >
                Type
              </HelpLabel>
              <div className="flex gap-2 p-1 bg-(--color-canvas-dark)/50 rounded-lg border border-(--color-hairline-on-dark)">
                <button
                  type="button"
                  onClick={() => setType("income")}
                  className={`flex-1 py-1.5 rounded-md text-caption font-bold transition-all ${type === "income" ? "bg-green-500/20 text-green-500 border border-green-500/30" : "text-(--color-muted) hover:text-(--color-on-dark)"}`}
                >
                  INCOME
                </button>
                <button
                  type="button"
                  onClick={() => setType("expense")}
                  className={`flex-1 py-1.5 rounded-md text-caption font-bold transition-all ${type === "expense" ? "bg-red-500/20 text-red-500 border border-red-500/30" : "text-(--color-muted) hover:text-(--color-on-dark)"}`}
                >
                  EXPENSE
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <HelpLabel
                  help="The transaction value in your selected profile currency."
                  className="mb-1"
                >
                  Amount
                </HelpLabel>
                <input
                  required
                  type="number"
                  step="0.01"
                  name="amount"
                  defaultValue={transaction.amount}
                  className="form-control w-full text-number-md"
                />
              </div>

              <DatePicker
                name="date"
                defaultValue={transaction.date.split("T")[0]}
                label="Date"
                help="The day this transaction should appear under."
              />
            </div>

            <CategorySelect
              categories={type === "income" ? incomeCategories : expenseCategories}
              type={type}
              name={type === "income" ? "source" : "category"}
              label={type === "income" ? "Source" : "Category"}
              help={
                type === "income"
                  ? "Where the income came from, used for reports and filters."
                  : "The spending bucket for this expense, used for reports and budgets."
              }
              defaultValue={
                type === transaction.type
                  ? type === "income"
                    ? (transaction as Income).source
                    : (transaction as Expense).category
                  : ""
              }
            />

            <div>
              <HelpLabel
                help="Optional description that also helps search results."
                className="mb-1"
              >
                Note
              </HelpLabel>
              <input
                type="text"
                name="note"
                defaultValue={transaction.note}
                className="form-control w-full text-body-md"
              />
            </div>

            {showStatusTracking && (
              <div>
                <HelpLabel
                  help="Done counts in totals. Pending stays visible but is excluded from summaries."
                  className="mb-1"
                >
                  Status
                </HelpLabel>
                <input type="hidden" name="status" value={status} />
                <div className="flex gap-2 p-1 bg-(--color-canvas-dark)/50 rounded-lg border border-(--color-hairline-on-dark)">
                  <button
                    type="button"
                    onClick={() => setStatus("pending")}
                    className={`flex-1 py-1.5 rounded-md text-caption font-bold transition-all ${status === "pending" ? "bg-yellow-500/20 text-yellow-500 border border-yellow-500/30" : "text-(--color-muted) hover:text-(--color-on-dark)"}`}
                  >
                    PENDING
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus("done")}
                    className={`flex-1 py-1.5 rounded-md text-caption font-bold transition-all ${status === "done" ? "bg-green-500/20 text-green-500 border border-green-500/30" : "text-(--color-muted) hover:text-(--color-on-dark)"}`}
                  >
                    DONE
                  </button>
                </div>
              </div>
            )}

            <SubmitButton
              className="w-full bg-(--color-primary) text-(--color-on-primary) text-button rounded-xl py-4 mt-2 flex items-center justify-center gap-2 hover:bg-(--color-primary-active) transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-(--color-primary)/20"
              loadingText="Saving Changes..."
            >
              <Save size={18} />
              Save Changes
            </SubmitButton>
          </ActionForm>
        </div>
      </div>
    </div>
  );
}
