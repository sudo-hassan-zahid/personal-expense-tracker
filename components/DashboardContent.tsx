"use client";

import { useMemo, useOptimistic } from "react";
import dynamic from "next/dynamic";
import { formatCurrency } from "@/lib/currency";
import { getTodayPKT } from "@/lib/date-utils";
import { addExpense } from "@/actions/expense";
import { addIncome } from "@/actions/income";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import Link from "next/link";
import { CategorySelect } from "./CategorySelect";
import { ActionForm, SubmitButton } from "./ActionForm";
import { TransactionList } from "./TransactionList";
import { DatePicker } from "./ui/DatePicker";
import { TransactionFilter } from "./TransactionFilter";
import { Expense, Income, Category } from "@/types";
import type { MonthlyBudget } from "@/types";
import { FirstRunGuide } from "./FirstRunGuide";
import { HelpLabel, HelpTip } from "./HelpTip";

const DashboardChart = dynamic(
  () => import("./DashboardChart").then((module) => ({ default: module.DashboardChart })),
  {
    loading: () => (
      <div className="w-full h-[380px] bg-(--color-surface-card-dark) rounded-2xl border border-(--color-hairline-on-dark) animate-pulse" />
    ),
  }
);

const SplitExpenseForm = dynamic(
  () => import("./SplitExpenseForm").then((module) => ({ default: module.SplitExpenseForm })),
  {
    loading: () => (
      <div className="min-h-[220px] rounded-xl border border-(--color-hairline-on-dark) bg-(--color-surface-card-dark) animate-pulse" />
    ),
  }
);

const AnalyticsSummary = dynamic(
  () => import("./AnalyticsSummary").then((module) => ({ default: module.AnalyticsSummary })),
  {
    loading: () => (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="h-[170px] rounded-xl border border-(--color-hairline-on-dark) bg-(--color-surface-card-dark) animate-pulse"
          />
        ))}
      </div>
    ),
  }
);

const BudgetProgress = dynamic(
  () => import("./BudgetProgress").then((module) => ({ default: module.BudgetProgress })),
  {
    loading: () => (
      <div className="h-[180px] rounded-xl border border-(--color-hairline-on-dark) bg-(--color-surface-card-dark) animate-pulse" />
    ),
  }
);

interface DashboardContentProps {
  expenses: Expense[];
  incomes: Income[];
  expenseCategories: Category[];
  incomeCategories: Category[];
  profile: DashboardProfile | null;
  budgets: MonthlyBudget[];
  currency: string;
  paginationEnabled: boolean;
  isStatusTrackingEnabled: boolean;
  itemsPerPage: number;
  filterType?: string;
  filterStatus?: string;
  isWideView: boolean;
  searchParams: Record<string, string | string[] | undefined>;
}

type DashboardProfile = {
  enable_status_tracking?: boolean | null;
};

type OptimisticTransaction =
  | { action: "delete"; id: string }
  | {
      action: "add";
      data: (Expense & { type: "expense" }) | (Income & { type: "income" });
    };

export function DashboardContent({
  expenses: initialExpenses,
  incomes: initialIncomes,
  expenseCategories,
  incomeCategories,
  profile,
  budgets,
  currency,
  paginationEnabled,
  isStatusTrackingEnabled,
  itemsPerPage,
  filterType,
  filterStatus,
  isWideView,
  searchParams,
}: DashboardContentProps) {
  const initialTransactions = useMemo(
    () => [
      ...initialExpenses.map((e) => ({ ...e, type: "expense" as const })),
      ...initialIncomes.map((i) => ({ ...i, type: "income" as const })),
    ],
    [initialExpenses, initialIncomes]
  );

  // Optimistic state for ALL transactions
  const [optimisticTransactions, addOptimisticTransaction] = useOptimistic(
    initialTransactions,
    (state, newTransaction: OptimisticTransaction) => {
      if (newTransaction.action === "delete") {
        return state.filter((t) => t.id !== newTransaction.id);
      }
      if (newTransaction.action === "add") {
        return [newTransaction.data, ...state].sort((a, b) => {
          const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
          if (dateDiff !== 0) return dateDiff;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
      }
      return state;
    }
  );

  const allTransactions = useMemo(() => {
    return optimisticTransactions
      .filter((t) => {
        if (filterType && filterType !== "all" && t.type !== filterType) return false;
        if (filterStatus && filterStatus !== "all" && (t.status || "done") !== filterStatus) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateDiff !== 0) return dateDiff;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [optimisticTransactions, filterType, filterStatus]);

  const { totalExpenses, totalIncome } = useMemo(() => {
    return allTransactions.reduce(
      (totals, transaction) => {
        if (isStatusTrackingEnabled && transaction.status !== "done") return totals;
        const amount = Number(transaction.amount);
        if (transaction.type === "expense") totals.totalExpenses += amount;
        else totals.totalIncome += amount;
        return totals;
      },
      { totalExpenses: 0, totalIncome: 0 }
    );
  }, [allTransactions, isStatusTrackingEnabled]);

  const netBalance = totalIncome - totalExpenses;
  const initialSearch =
    (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q)?.trim() || "";
  const isFirstRun = initialExpenses.length === 0 && initialIncomes.length === 0;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 py-6 md:py-[40px] flex flex-col gap-6 md:gap-8 flex-1">
      {isFirstRun && <FirstRunGuide />}

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-(--color-surface-card-dark) p-4 md:p-6 rounded-xl border border-(--color-hairline-on-dark) animate-slide-up stagger-1">
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-body-sm md:text-body-md text-(--color-muted) mb-2">
            <span>Net Balance</span>
            <HelpTip label="Net balance help">
              Income minus completed expenses for the current view.
            </HelpTip>
          </div>
          <div className="text-display-sm md:text-number-display text-(--color-on-dark) text-center">
            {formatCurrency(netBalance, currency)}
          </div>
        </div>
        <div className="bg-(--color-surface-card-dark) p-4 md:p-6 rounded-xl border border-(--color-hairline-on-dark) animate-slide-up stagger-2">
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-body-sm md:text-body-md text-(--color-muted) mb-2">
            <span>Total Income</span>
            <HelpTip label="Total income help">
              Sum of income transactions. Pending items are ignored when status tracking is on.
            </HelpTip>
          </div>
          <div className="text-display-sm md:text-number-display text-(--color-trading-up) text-center">
            {formatCurrency(totalIncome, currency)}
          </div>
        </div>
        <div className="bg-(--color-surface-card-dark) p-4 md:p-6 rounded-xl border border-(--color-hairline-on-dark) animate-slide-up stagger-3">
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-body-sm md:text-body-md text-(--color-muted) mb-2">
            <span>Total Expenses</span>
            <HelpTip label="Total expenses help">
              Sum of expense transactions. Pending items are ignored when status tracking is on.
            </HelpTip>
          </div>
          <div className="text-display-sm md:text-number-display text-(--color-trading-down) text-center">
            {formatCurrency(totalExpenses, currency)}
          </div>
        </div>
      </div>

      {!isFirstRun && (
        <>
          <DashboardChart
            transactions={allTransactions}
            currency={currency}
            enableStatusTracking={profile?.enable_status_tracking ?? false}
          />

          <AnalyticsSummary
            transactions={allTransactions}
            currency={currency}
            enableStatusTracking={isStatusTrackingEnabled}
          />

          <BudgetProgress budgets={budgets} expenses={initialExpenses} currency={currency} />
        </>
      )}

      {/* 8/4 or 12 Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col - 8 or 12 - Transactions Table */}
        <div
          className={`${isWideView ? "lg:col-span-12" : "lg:col-span-8"} bg-(--color-surface-card-dark) rounded-xl border border-(--color-hairline-on-dark) p-4 md:p-6 animate-slide-up stagger-5 transition-all duration-300`}
        >
          <div className="flex flex-col gap-4 mb-6 md:flex-row md:justify-between md:items-center">
            <div className="flex w-full items-start justify-between gap-3 md:w-auto md:items-center md:justify-start">
              <div className="flex min-w-0 items-center gap-2">
                <h2 className="text-title-md md:text-title-lg text-(--color-on-dark)">
                  Recent Transactions
                </h2>
                <HelpTip label="Recent transactions help">
                  Review, search, filter, edit, attach, or delete your income and expense records.
                </HelpTip>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Link
                  href={`/dashboard/export?${(() => {
                    const params = new URLSearchParams();
                    if (searchParams) {
                      Object.entries(searchParams).forEach(([key, value]) => {
                        if (value) params.set(key, Array.isArray(value) ? value[0] : value);
                      });
                    }
                    return params.toString();
                  })()}`}
                  className="p-2 hover:bg-(--color-canvas-dark) rounded-lg transition-colors text-(--color-muted) hover:text-(--color-on-dark) border border-transparent hover:border-(--color-hairline-on-dark)"
                  title="Export CSV"
                >
                  <Download size={16} />
                </Link>
                <Link
                  href={`/dashboard?${(() => {
                    const params = new URLSearchParams();
                    if (searchParams) {
                      Object.entries(searchParams).forEach(([key, value]) => {
                        if (value) params.set(key, Array.isArray(value) ? value[0] : value);
                      });
                    }
                    params.set("view", isWideView ? "standard" : "wide");
                    return params.toString();
                  })()}`}
                  className="hidden sm:flex p-2 hover:bg-(--color-canvas-dark) rounded-lg transition-colors text-(--color-muted) hover:text-(--color-on-dark) border border-transparent hover:border-(--color-hairline-on-dark)"
                  title={isWideView ? "Standard View" : "Expand Table"}
                >
                  {isWideView ? (
                    <div className="flex items-center gap-2 text-caption font-medium uppercase tracking-wider">
                      <ChevronLeft size={16} />
                      Collapse
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-caption font-medium uppercase tracking-wider">
                      Expand
                      <ChevronRight size={16} />
                    </div>
                  )}
                </Link>
              </div>
            </div>
            <TransactionFilter
              defaultType={filterType || "all"}
              defaultStatus={filterStatus || "all"}
              showStatusFilter={isStatusTrackingEnabled}
            />
          </div>

          <TransactionList
            key={initialSearch}
            initialTransactions={allTransactions}
            currency={currency}
            paginationEnabled={paginationEnabled}
            itemsPerPage={itemsPerPage}
            expenseCategories={expenseCategories}
            incomeCategories={incomeCategories}
            enableStatusTracking={isStatusTrackingEnabled}
            isWideView={isWideView}
            onOptimisticDelete={(id) => addOptimisticTransaction({ action: "delete", id })}
            initialSearch={initialSearch}
            isFirstRun={isFirstRun}
          />
        </div>

        {/* Right Col - 4 - Actions (Stacked below in wide view) */}
        <div
          className={`${isWideView ? "lg:col-span-12 grid grid-cols-1 md:grid-cols-2" : "lg:col-span-4 flex flex-col"} gap-6 animate-slide-up stagger-5 transition-all duration-300`}
        >
          {/* Add Expense Card */}
          <div
            id="quick-add-expense"
            className="bg-(--color-surface-card-dark) rounded-xl p-4 md:p-6 text-(--color-on-dark) border border-(--color-hairline-on-dark)"
          >
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-title-md">Quick Add Expense</h2>
              <HelpTip label="Quick add expense help">
                Add money you spent without leaving the dashboard.
              </HelpTip>
            </div>
            <ActionForm
              action={addExpense}
              onSuccess={(formData) => {
                const amount = parseFloat(formData?.get("amount") as string);
                const category = formData?.get("category") as string;
                const date = formData?.get("date") as string;
                const note = formData?.get("note") as string;
                const status = (formData?.get("status") as string) || "done";

                addOptimisticTransaction({
                  action: "add",
                  data: {
                    id: `temp-${Date.now()}`,
                    amount,
                    category,
                    date,
                    note,
                    status,
                    type: "expense",
                    created_at: new Date().toISOString(),
                  },
                });
              }}
              successMessage="Expense added successfully"
              className="flex flex-col gap-4"
            >
              <div>
                <HelpLabel
                  help="The expense value in your selected profile currency."
                  className="mb-1"
                >
                  Amount
                </HelpLabel>
                <input
                  required
                  type="number"
                  step="0.01"
                  name="amount"
                  className="form-control w-full text-number-md"
                  placeholder="0.00"
                />
              </div>
              <CategorySelect
                categories={expenseCategories}
                type="expense"
                name="category"
                label="Category"
                help="The spending bucket for this expense, used in reports and budgets."
              />
              <DatePicker
                name="date"
                defaultValue={getTodayPKT()}
                label="Date"
                help="The day the expense happened."
              />
              <div>
                <HelpLabel
                  help="Optional detail that makes this transaction easier to search later."
                  className="mb-1"
                >
                  Note
                </HelpLabel>
                <input
                  type="text"
                  name="note"
                  className="form-control w-full text-body-md"
                  placeholder="Optional note"
                />
              </div>
              {isStatusTrackingEnabled && (
                <div>
                  <HelpLabel
                    help="Done counts in totals now. Pending keeps the item visible but out of summaries."
                    className="mb-1"
                  >
                    Status
                  </HelpLabel>
                  <select
                    name="status"
                    defaultValue="done"
                    className="form-control w-full text-body-md"
                  >
                    <option value="done">Done</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              )}
              <SubmitButton
                className="w-full bg-(--color-primary) text-(--color-on-primary) text-button rounded-md py-3 mt-2 hover:bg-(--color-primary-active) transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-(--color-primary)/20"
                loadingText="Adding..."
              >
                Add Expense
              </SubmitButton>
            </ActionForm>
          </div>

          {/* Add Income Card */}
          <div
            id="quick-add-income"
            className="bg-(--color-surface-card-dark) rounded-xl p-4 md:p-6 text-(--color-on-dark) border border-(--color-hairline-on-dark)"
          >
            <div className="mb-4 flex items-center gap-2">
              <h2 className="text-title-md">Quick Add Income</h2>
              <HelpTip label="Quick add income help">
                Add salary, freelance payments, refunds, or any money coming in.
              </HelpTip>
            </div>
            <ActionForm
              action={addIncome}
              onSuccess={(formData) => {
                const amount = parseFloat(formData?.get("amount") as string);
                const source = formData?.get("source") as string;
                const date = formData?.get("date") as string;
                const note = formData?.get("note") as string;
                const status = (formData?.get("status") as string) || "done";

                addOptimisticTransaction({
                  action: "add",
                  data: {
                    id: `temp-${Date.now()}`,
                    amount,
                    source,
                    date,
                    note,
                    status,
                    type: "income",
                    created_at: new Date().toISOString(),
                  },
                });
              }}
              successMessage="Income added successfully"
              className="flex flex-col gap-4"
            >
              <div>
                <HelpLabel
                  help="The income value in your selected profile currency."
                  className="mb-1"
                >
                  Amount
                </HelpLabel>
                <input
                  required
                  type="number"
                  step="0.01"
                  name="amount"
                  className="form-control w-full text-number-md"
                  placeholder="0.00"
                />
              </div>
              <CategorySelect
                categories={incomeCategories}
                type="income"
                name="source"
                label="Source"
                help="Where this money came from, used in income reports and filters."
              />
              <DatePicker
                name="date"
                defaultValue={getTodayPKT()}
                label="Date"
                help="The day the income was received or recorded."
              />
              <div>
                <HelpLabel
                  help="Optional context, invoice reference, or reminder for this income."
                  className="mb-1"
                >
                  Note
                </HelpLabel>
                <input
                  type="text"
                  name="note"
                  className="form-control w-full text-body-md"
                  placeholder="Optional note"
                />
              </div>
              {isStatusTrackingEnabled && (
                <div>
                  <HelpLabel
                    help="Done counts in totals now. Pending keeps the item visible but out of summaries."
                    className="mb-1"
                  >
                    Status
                  </HelpLabel>
                  <select
                    name="status"
                    defaultValue="done"
                    className="form-control w-full text-body-md"
                  >
                    <option value="done">Done</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              )}
              <SubmitButton
                className="w-full bg-(--color-primary) text-(--color-on-primary) text-button rounded-md py-3 mt-2 hover:bg-(--color-primary-active) transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-(--color-primary)/20"
                loadingText="Adding..."
              >
                Add Income
              </SubmitButton>
            </ActionForm>
          </div>

          <SplitExpenseForm categories={expenseCategories} currency={currency} />
        </div>
      </div>
    </div>
  );
}
