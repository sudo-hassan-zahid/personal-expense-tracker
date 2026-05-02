import { createClient } from "@/lib/supabase";
import { addExpense } from "@/actions/expense";
import { addIncome } from "@/actions/income";
import { getCategories } from "@/actions/category";
import { getProfile } from "@/actions/profile";
import { formatCurrency } from "@/lib/currency";
import { format, startOfMonth, endOfMonth, formatISO } from "date-fns";
import { getTodayPKT, getCurrentPKTDate } from "@/lib/date-utils";
import { ArrowUpRight, ArrowDownRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { CategorySelect } from "@/components/CategorySelect";
import { CurrencySelector } from "@/components/CurrencySelector";
import { ActionForm } from "@/components/ActionForm";
import { DeleteButton } from "@/components/DeleteButton";
import { DashboardChart } from "@/components/DashboardChart";
import { TransactionList } from "@/components/TransactionList";
import { DatePicker } from "@/components/ui/DatePicker";
import { TransactionFilter } from "@/components/TransactionFilter";

export default async function DashboardPage(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const filterType = searchParams?.type as string | undefined;
  const filterCategory = searchParams?.category as string | undefined;

  const supabase = await createClient();

  // Date filtering for current month in PKT
  const todayPKT = getCurrentPKTDate();
  const monthStart = formatISO(startOfMonth(todayPKT));
  const monthEnd = formatISO(endOfMonth(todayPKT));

  // Fetch data
  const { data: expenses } = await supabase
    .from("expenses")
    .select("*")
    .gte("date", monthStart)
    .lte("date", monthEnd)
    .order("date", { ascending: false });

  const { data: incomes } = await supabase
    .from("incomes")
    .select("*")
    .gte("date", monthStart)
    .lte("date", monthEnd)
    .order("date", { ascending: false });

  const expensesList = expenses || [];
  const incomesList = incomes || [];

  // Fetch user categories and profile
  const [expenseCategories, incomeCategories, profile] = await Promise.all([
    getCategories("expense"),
    getCategories("income"),
    getProfile(),
  ]);

  const currency = profile?.currency || "USD";
  const paginationEnabled = profile?.pagination_enabled ?? true;

  // Calculate totals
  const totalExpenses = expensesList.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalIncome = incomesList.reduce((acc, curr) => acc + Number(curr.amount), 0);
  const netBalance = totalIncome - totalExpenses;

  // Combine transactions
  const allTransactions = [
    ...expensesList.map((e) => ({ ...e, type: "expense" as const })),
    ...incomesList.map((i) => ({ ...i, type: "income" as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const ITEMS_PER_PAGE = parseInt((searchParams?.limit as string) || "10");

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 py-[40px] flex flex-col gap-8 flex-1">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-(--color-surface-card-dark) p-6 rounded-xl border border-(--color-hairline-on-dark)">
          <div className="text-body-md text-(--color-muted) mb-2">Net Balance</div>
          <div className="text-number-display text-(--color-on-dark) text-center">
            {formatCurrency(netBalance, currency)}
          </div>
        </div>
        <div className="bg-(--color-surface-card-dark) p-6 rounded-xl border border-(--color-hairline-on-dark)">
          <div className="text-body-md text-(--color-muted) mb-2">Total Income</div>
          <div className="text-number-display text-(--color-trading-up) text-center">
            {formatCurrency(totalIncome, currency)}
          </div>
        </div>
        <div className="bg-(--color-surface-card-dark) p-6 rounded-xl border border-(--color-hairline-on-dark)">
          <div className="text-body-md text-(--color-muted) mb-2">Total Expenses</div>
          <div className="text-number-display text-(--color-trading-down) text-center">
            {formatCurrency(totalExpenses, currency)}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <DashboardChart transactions={allTransactions} currency={currency} />

      {/* 8/4 Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col - 8 - Transactions Table */}
        <div className="lg:col-span-8 bg-(--color-surface-card-dark) rounded-xl border border-(--color-hairline-on-dark) p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-title-lg text-(--color-on-dark)">Recent Transactions</h2>
            <TransactionFilter defaultType={filterType || "all"} />
          </div>
          
          <TransactionList 
            initialTransactions={allTransactions} 
            currency={currency}
            paginationEnabled={paginationEnabled}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>

        {/* Right Col - 4 - Actions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Add Expense Card */}
          <div className="bg-(--color-surface-card-dark) rounded-xl p-6 text-(--color-on-dark) border border-(--color-hairline-on-dark)">
            <h2 className="text-title-md mb-4">Quick Add Expense</h2>
            <ActionForm action={addExpense} successMessage="Expense added successfully" className="flex flex-col gap-4">
              <div>
                <label className="block text-body-sm mb-1 text-(--color-muted)">Amount</label>
                <input required type="number" step="0.01" name="amount" className="w-full bg-transparent border border-(--color-hairline-on-dark) rounded-md px-3 py-2 text-number-md focus:border-(--color-primary) focus:outline-none" placeholder="0.00" />
              </div>
              <CategorySelect
                categories={expenseCategories}
                type="expense"
                name="category"
                label="Category"
              />
              <DatePicker 
                name="date" 
                defaultValue={getTodayPKT()} 
                label="Date"
              />
              <div>
                <label className="block text-body-sm mb-1 text-(--color-muted)">Note</label>
                <input type="text" name="note" className="w-full bg-transparent border border-(--color-hairline-on-dark) rounded-md px-3 py-2 text-body-md focus:border-(--color-primary) focus:outline-none" placeholder="Optional note" />
              </div>
              <button type="submit" className="w-full bg-(--color-primary) text-(--color-on-primary) text-button rounded-md py-3 mt-2 hover:bg-(--color-primary-active) transition-colors">
                Add Expense
              </button>
            </ActionForm>
          </div>

          {/* Add Income Card */}
          <div className="bg-(--color-surface-card-dark) rounded-xl p-6 text-(--color-on-dark) border border-(--color-hairline-on-dark)">
            <h2 className="text-title-md mb-4">Quick Add Income</h2>
            <ActionForm action={addIncome} successMessage="Income added successfully" className="flex flex-col gap-4">
              <div>
                <label className="block text-body-sm mb-1 text-(--color-muted)">Amount</label>
                <input required type="number" step="0.01" name="amount" className="w-full bg-transparent border border-(--color-hairline-on-dark) rounded-md px-3 py-2 text-number-md focus:border-(--color-primary) focus:outline-none" placeholder="0.00" />
              </div>
              <CategorySelect
                categories={incomeCategories}
                type="income"
                name="source"
                label="Source"
              />
              <DatePicker 
                name="date" 
                defaultValue={getTodayPKT()} 
                label="Date"
              />
              <div>
                <label className="block text-body-sm mb-1 text-(--color-muted)">Note</label>
                <input type="text" name="note" className="w-full bg-transparent border border-(--color-hairline-on-dark) rounded-md px-3 py-2 text-body-md focus:border-(--color-primary) focus:outline-none" placeholder="Optional note" />
              </div>
              <button type="submit" className="w-full bg-(--color-primary) text-(--color-on-primary) text-button rounded-md py-3 mt-2 hover:bg-(--color-primary-active) transition-colors">
                Add Income
              </button>
            </ActionForm>
          </div>
        </div>
      </div>
    </div>
  );
}
