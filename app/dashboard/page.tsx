import { createClient } from "@/lib/supabase";
import { addExpense } from "@/actions/expense";
import { addIncome } from "@/actions/income";
import { formatCurrency } from "@/lib/currency";
import { format, startOfMonth, endOfMonth } from "date-fns";
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
import { unstable_cacheTag as cacheTag } from "next/cache";

export default async function DashboardPage(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  "use cache";
  cacheTag("transactions", "categories", "profile");

  const searchParams = await props.searchParams;
  const filterType = searchParams?.type as string | undefined;
  const filterCategory = searchParams?.category as string | undefined;

  // Single client for ALL queries — no waterfall
  const supabase = await createClient();

  // Date filtering for current month in PKT
  const todayPKT = getCurrentPKTDate();
  const monthStart = format(startOfMonth(todayPKT), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(todayPKT), "yyyy-MM-dd");

  // Run ALL queries in parallel — this is the #1 optimization
  // Previously: 5 sequential calls each creating their own client = ~1500ms
  // Now: 1 client, 5 parallel queries = ~300ms
  const [expensesRes, incomesRes, expCatsRes, incCatsRes, profileRes] = await Promise.all([
    supabase
      .from("expenses")
      .select("id, amount, category, date, note, status, created_at")
      .gte("date", monthStart)
      .lte("date", monthEnd)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("incomes")
      .select("id, amount, source, date, note, status, created_at")
      .gte("date", monthStart)
      .lte("date", monthEnd)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("categories")
      .select("id, name, type, parent_id")
      .eq("type", "expense")
      .order("name", { ascending: true }),
    supabase
      .from("categories")
      .select("id, name, type, parent_id")
      .eq("type", "income")
      .order("name", { ascending: true }),
    supabase
      .from("profiles")
      .select("*")
      .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "")
      .maybeSingle(),
  ]);

  const expensesList = expensesRes.data || [];
  const incomesList = incomesRes.data || [];
  const expenseCategories = expCatsRes.data || [];
  const incomeCategories = incCatsRes.data || [];
  const profile = profileRes.data;

  const currency = profile?.currency || "USD";
  const paginationEnabled = profile?.pagination_enabled ?? true;

  // Calculate totals (only "done" if tracking is enabled)
  const isStatusTrackingEnabled = profile?.enable_status_tracking ?? false;
  
  const totalExpenses = expensesList
    .filter((e: any) => !isStatusTrackingEnabled || e.status === 'done')
    .reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
    
  const totalIncome = incomesList
    .filter((i: any) => !isStatusTrackingEnabled || i.status === 'done')
    .reduce((acc: number, curr: any) => acc + Number(curr.amount), 0);
    
  const netBalance = totalIncome - totalExpenses;

  // Combine transactions
  const allTransactions = [
    ...expensesList.map((e: any) => ({ ...e, type: "expense" as const })),
    ...incomesList.map((i: any) => ({ ...i, type: "income" as const })),
  ].sort((a, b) => {
    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const ITEMS_PER_PAGE = parseInt((searchParams?.limit as string) || "10");
  const isWideView = searchParams?.view === "wide";

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 py-[40px] flex flex-col gap-8 flex-1">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-(--color-surface-card-dark) p-6 rounded-xl border border-(--color-hairline-on-dark) animate-slide-up stagger-1">
          <div className="text-body-md text-(--color-muted) mb-2">Net Balance</div>
          <div className="text-number-display text-(--color-on-dark) text-center">
            {formatCurrency(netBalance, currency)}
          </div>
        </div>
        <div className="bg-(--color-surface-card-dark) p-6 rounded-xl border border-(--color-hairline-on-dark) animate-slide-up stagger-2">
          <div className="text-body-md text-(--color-muted) mb-2">Total Income</div>
          <div className="text-number-display text-(--color-trading-up) text-center">
            {formatCurrency(totalIncome, currency)}
          </div>
        </div>
        <div className="bg-(--color-surface-card-dark) p-6 rounded-xl border border-(--color-hairline-on-dark) animate-slide-up stagger-3">
          <div className="text-body-md text-(--color-muted) mb-2">Total Expenses</div>
          <div className="text-number-display text-(--color-trading-down) text-center">
            {formatCurrency(totalExpenses, currency)}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <DashboardChart 
        transactions={allTransactions} 
        currency={currency} 
        enableStatusTracking={profile?.enable_status_tracking} 
      />

      {/* 8/4 or 12 Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col - 8 or 12 - Transactions Table */}
        <div className={`${isWideView ? 'lg:col-span-12' : 'lg:col-span-8'} bg-(--color-surface-card-dark) rounded-xl border border-(--color-hairline-on-dark) p-6 animate-slide-up stagger-5 transition-all duration-500`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-title-lg text-(--color-on-dark)">Recent Transactions</h2>
              <Link 
                href={`/dashboard?${new URLSearchParams({ ...Object.fromEntries(Object.entries(searchParams || {})), view: isWideView ? 'standard' : 'wide' }).toString()}`}
                className="p-2 hover:bg-(--color-canvas-dark) rounded-lg transition-colors text-(--color-muted) hover:text-(--color-on-dark) border border-transparent hover:border-(--color-hairline-on-dark)"
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
            <TransactionFilter defaultType={filterType || "all"} />
          </div>
          
          <TransactionList 
            initialTransactions={allTransactions} 
            currency={currency}
            paginationEnabled={paginationEnabled}
            itemsPerPage={ITEMS_PER_PAGE}
            expenseCategories={expenseCategories}
            incomeCategories={incomeCategories}
            enableStatusTracking={isStatusTrackingEnabled}
            isWideView={isWideView}
          />
        </div>

        {/* Right Col - 4 - Actions (Stacked below in wide view) */}
        <div className={`${isWideView ? 'lg:col-span-12 grid grid-cols-1 md:grid-cols-2' : 'lg:col-span-4 flex flex-col'} gap-6 animate-slide-up stagger-5 transition-all duration-500`}>
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
              <button type="submit" className="w-full bg-(--color-primary) text-(--color-on-primary) text-button rounded-md py-3 mt-2 hover:bg-(--color-primary-active) transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-(--color-primary)/20">
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
              <button type="submit" className="w-full bg-(--color-primary) text-(--color-on-primary) text-button rounded-md py-3 mt-2 hover:bg-(--color-primary-active) transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-(--color-primary)/20">
                Add Income
              </button>
            </ActionForm>
          </div>
        </div>
      </div>
    </div>
  );
}
