import { createClient } from "@/lib/supabase";
import { addExpense } from "@/actions/expense";
import { addIncome } from "@/actions/income";
import { getCategories } from "@/actions/category";
import { getProfile } from "@/actions/profile";
import { formatCurrency } from "@/lib/currency";
import { format, startOfMonth, endOfMonth, formatISO } from "date-fns";
import { ArrowUpRight, ArrowDownRight, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { deleteExpense } from "@/actions/expense";
import { deleteIncome } from "@/actions/income";
import { CategorySelect } from "@/components/CategorySelect";
import { CurrencySelector } from "@/components/CurrencySelector";

export default async function DashboardPage(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const filterType = searchParams?.type as string | undefined;
  const filterCategory = searchParams?.category as string | undefined;

  const supabase = await createClient();

  // Date filtering for current month
  const today = new Date();
  const monthStart = formatISO(startOfMonth(today));
  const monthEnd = formatISO(endOfMonth(today));

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

  // Combine and sort recent transactions
  let allTransactions = [
    ...expensesList.map((e) => ({ ...e, type: "expense" as const })),
    ...incomesList.map((i) => ({ ...i, type: "income" as const })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (filterType && filterType !== "all") {
    allTransactions = allTransactions.filter((t) => t.type === filterType);
  }

  if (filterCategory && filterCategory !== "all") {
    allTransactions = allTransactions.filter((t) => 
      (t.type === "income" ? (t as { source: string }).source : (t as { category: string }).category).toLowerCase() === filterCategory.toLowerCase()
    );
  }

  const ITEMS_PER_PAGE = 10;
  const currentPage = parseInt((searchParams?.page as string) || "1");
  const totalPages = Math.max(1, Math.ceil(allTransactions.length / ITEMS_PER_PAGE));
  
  let displayedTransactions = allTransactions;
  if (paginationEnabled) {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    displayedTransactions = allTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 py-[40px] flex flex-col gap-8 flex-1">
      {/* Currency Selector */}
      <div className="flex items-center justify-end gap-3">
        <span className="text-body-sm text-(--color-muted)">Currency:</span>
        <CurrencySelector currentCurrency={currency} />
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-(--color-surface-card-dark) p-6 rounded-xl border border-(--color-hairline-on-dark)">
          <div className="text-body-md text-(--color-muted) mb-2">Net Balance</div>
          <div className="text-number-display text-(--color-on-dark)">
            {formatCurrency(netBalance, currency)}
          </div>
        </div>
        <div className="bg-(--color-surface-card-dark) p-6 rounded-xl border border-(--color-hairline-on-dark)">
          <div className="text-body-md text-(--color-muted) mb-2">Total Income</div>
          <div className="text-number-display text-(--color-trading-up)">
            {formatCurrency(totalIncome, currency)}
          </div>
        </div>
        <div className="bg-(--color-surface-card-dark) p-6 rounded-xl border border-(--color-hairline-on-dark)">
          <div className="text-body-md text-(--color-muted) mb-2">Total Expenses</div>
          <div className="text-number-display text-(--color-trading-down)">
            {formatCurrency(totalExpenses, currency)}
          </div>
        </div>
      </div>

      {/* 8/4 Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col - 8 - Transactions Table */}
        <div className="lg:col-span-8 bg-(--color-surface-card-dark) rounded-xl border border-(--color-hairline-on-dark) p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-title-lg text-(--color-on-dark)">Recent Transactions</h2>
            <form className="flex gap-2 text-body-sm">
              <select name="type" className="bg-(--color-canvas-dark) text-(--color-on-dark) border border-(--color-hairline-on-dark) rounded px-2 py-1" defaultValue={filterType || "all"}>
                <option value="all">All Types</option>
                <option value="expense">Expenses</option>
                <option value="income">Income</option>
              </select>
              <button type="submit" className="bg-(--color-surface-elevated-dark) text-(--color-on-dark) px-3 py-1 rounded hover:bg-(--color-primary) hover:text-(--color-on-primary) transition-colors">Apply</button>
            </form>
          </div>
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-5 text-caption text-(--color-muted) pb-3 border-b border-(--color-hairline-on-dark)">
              <div className="col-span-2">Type / Note</div>
              <div>Date</div>
              <div className="text-right">Amount</div>
              <div className="text-right">Action</div>
            </div>
            {displayedTransactions.length === 0 && (
              <div className="py-8 text-center text-body-md text-(--color-muted)">
                No transactions found.
              </div>
            )}
            {displayedTransactions.map((t) => (
              <div key={t.id + t.type} className="grid grid-cols-5 items-center py-3 border-b border-(--color-hairline-on-dark) hover:bg-(--color-surface-elevated-dark) transition-colors px-2 -mx-2 rounded-md">
                <div className="col-span-2 flex items-center gap-3">
                  {t.type === "income" ? (
                    <div className="w-8 h-8 rounded-full bg-(--color-trading-up)/10 flex items-center justify-center text-(--color-trading-up)">
                      <ArrowUpRight size={16} />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-(--color-trading-down)/10 flex items-center justify-center text-(--color-trading-down)">
                      <ArrowDownRight size={16} />
                    </div>
                  )}
                  <div>
                    <div className="text-body-md text-(--color-on-dark)">
                      {t.type === "income" ? (t as { source: string }).source : (t as { category: string }).category}
                    </div>
                    <div className="text-caption text-(--color-muted)">
                      {t.note || "No note"}
                    </div>
                  </div>
                </div>
                <div className="text-number-sm text-(--color-muted)">
                  {format(new Date(t.date), "MMM d, yyyy")}
                </div>
                <div className={`text-number-md text-right ${t.type === 'income' ? 'text-(--color-trading-up)' : 'text-(--color-trading-down)'}`}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(Number(t.amount), currency).replace(/^[^\d]*/, '')}
                </div>
                <div className="text-right flex justify-end">
                  <form action={async () => {
                    "use server";
                    if (t.type === "income") await deleteIncome(t.id);
                    else await deleteExpense(t.id);
                  }}>
                    <button type="submit" className="p-2 text-(--color-muted) hover:text-(--color-trading-down) transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {paginationEnabled && totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-(--color-hairline-on-dark)">
              <div className="text-caption text-(--color-muted)">
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, allTransactions.length)} of {allTransactions.length} entries
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard?page=${Math.max(1, currentPage - 1)}${filterType ? `&type=${filterType}` : ''}${filterCategory ? `&category=${filterCategory}` : ''}`}
                  className={`p-2 rounded border border-(--color-hairline-on-dark) ${currentPage === 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-(--color-surface-elevated-dark) text-(--color-on-dark)'}`}
                >
                  <ChevronLeft size={16} />
                </Link>
                <div className="text-body-sm text-(--color-on-dark) px-4">
                  Page {currentPage} of {totalPages}
                </div>
                <Link
                  href={`/dashboard?page=${Math.min(totalPages, currentPage + 1)}${filterType ? `&type=${filterType}` : ''}${filterCategory ? `&category=${filterCategory}` : ''}`}
                  className={`p-2 rounded border border-(--color-hairline-on-dark) ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : 'hover:bg-(--color-surface-elevated-dark) text-(--color-on-dark)'}`}
                >
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Col - 4 - Actions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Add Expense Card */}
          <div className="bg-(--color-canvas-light) rounded-xl p-6 text-(--color-ink) border border-(--color-hairline-on-light)">
            <h2 className="text-title-md mb-4">Quick Add Expense</h2>
            <form action={addExpense} className="flex flex-col gap-4">
              <div>
                <label className="block text-body-sm mb-1 text-(--color-body-on-light)">Amount</label>
                <input required type="number" step="0.01" name="amount" className="w-full bg-transparent border border-(--color-hairline-on-light) rounded-md px-3 py-2 text-number-md focus:border-(--color-primary) focus:outline-none" placeholder="0.00" />
              </div>
              <CategorySelect
                categories={expenseCategories}
                type="expense"
                name="category"
                label="Category"
              />
              <div>
                <label className="block text-body-sm mb-1 text-(--color-body-on-light)">Date</label>
                <input required type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-transparent border border-(--color-hairline-on-light) rounded-md px-3 py-2 text-body-md focus:border-(--color-primary) focus:outline-none" />
              </div>
              <div>
                <label className="block text-body-sm mb-1 text-(--color-body-on-light)">Note</label>
                <input type="text" name="note" className="w-full bg-transparent border border-(--color-hairline-on-light) rounded-md px-3 py-2 text-body-md focus:border-(--color-primary) focus:outline-none" placeholder="Optional note" />
              </div>
              <button type="submit" className="w-full bg-(--color-primary) text-(--color-on-primary) text-button rounded-md py-3 mt-2 hover:bg-(--color-primary-active) transition-colors">
                Add Expense
              </button>
            </form>
          </div>

          {/* Add Income Card */}
          <div className="bg-(--color-canvas-light) rounded-xl p-6 text-(--color-ink) border border-(--color-hairline-on-light)">
            <h2 className="text-title-md mb-4">Quick Add Income</h2>
            <form action={addIncome} className="flex flex-col gap-4">
              <div>
                <label className="block text-body-sm mb-1 text-(--color-body-on-light)">Amount</label>
                <input required type="number" step="0.01" name="amount" className="w-full bg-transparent border border-(--color-hairline-on-light) rounded-md px-3 py-2 text-number-md focus:border-(--color-primary) focus:outline-none" placeholder="0.00" />
              </div>
              <CategorySelect
                categories={incomeCategories}
                type="income"
                name="source"
                label="Source"
              />
              <div>
                <label className="block text-body-sm mb-1 text-(--color-body-on-light)">Date</label>
                <input required type="date" name="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-transparent border border-(--color-hairline-on-light) rounded-md px-3 py-2 text-body-md focus:border-(--color-primary) focus:outline-none" />
              </div>
              <div>
                <label className="block text-body-sm mb-1 text-(--color-body-on-light)">Note</label>
                <input type="text" name="note" className="w-full bg-transparent border border-(--color-hairline-on-light) rounded-md px-3 py-2 text-body-md focus:border-(--color-primary) focus:outline-none" placeholder="Optional note" />
              </div>
              <button type="submit" className="w-full bg-(--color-surface-card-dark) text-(--color-on-dark) text-button rounded-md py-3 mt-2 hover:bg-(--color-surface-elevated-dark) transition-colors">
                Add Income
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
