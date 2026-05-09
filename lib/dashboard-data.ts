/**
 * Utility/Hook: dashboard-data.ts
 */
import { createClient } from "@/lib/supabase";
import { cacheTag } from "next/cache";
import type { DashboardFilters } from "@/lib/dashboard-filters";
import { format } from "date-fns";

/**
 * Cached data fetcher for the dashboard.
 * Runs dashboard queries in parallel with a single Supabase client.
 * Cache is invalidated via revalidateTag("transactions"/"categories"/"profile").
 */
export async function getDashboardData(
  userId: string,
  cookieStore?: unknown,
  filters?: DashboardFilters
) {
  "use cache";
  cacheTag(
    `transactions-${userId}`,
    `categories-${userId}`,
    `profile-${userId}`,
    `planning-${userId}`
  );

  const supabase = await createClient(cookieStore);

  let expenseQuery = supabase
    .from("expenses")
    .select(
      "id, amount, category, date, note, status, created_at, updated_at, deleted_at, attachment_url, currency"
    )
    .eq("user_id", userId)
    .is("deleted_at", null);

  let incomeQuery = supabase
    .from("incomes")
    .select("id, amount, source, date, note, status, created_at, updated_at, deleted_at, currency")
    .eq("user_id", userId)
    .is("deleted_at", null);

  if (filters?.startDate) {
    expenseQuery = expenseQuery.gte("date", filters.startDate);
    incomeQuery = incomeQuery.gte("date", filters.startDate);
  }

  if (filters?.endDate) {
    expenseQuery = expenseQuery.lte("date", filters.endDate);
    incomeQuery = incomeQuery.lte("date", filters.endDate);
  }

  if (filters?.minAmount !== undefined) {
    expenseQuery = expenseQuery.gte("amount", filters.minAmount);
    incomeQuery = incomeQuery.gte("amount", filters.minAmount);
  }

  if (filters?.maxAmount !== undefined) {
    expenseQuery = expenseQuery.lte("amount", filters.maxAmount);
    incomeQuery = incomeQuery.lte("amount", filters.maxAmount);
  }

  if (filters?.search) {
    const escaped = filters.search.replaceAll("%", "\\%").replaceAll("_", "\\_");
    expenseQuery = expenseQuery.or(`note.ilike.%${escaped}%,category.ilike.%${escaped}%`);
    incomeQuery = incomeQuery.or(`note.ilike.%${escaped}%,source.ilike.%${escaped}%`);
  }

  // Keep independent dashboard reads parallel while avoiding duplicate category round trips.
  const [expensesRes, incomesRes, categoriesRes, profileRes, budgetsRes] = await Promise.all([
    expenseQuery.order("date", { ascending: false }).order("created_at", { ascending: false }),
    incomeQuery.order("date", { ascending: false }).order("created_at", { ascending: false }),
    supabase
      .from("categories")
      .select("id, name, type, parent_id")
      .eq("user_id", userId)
      .in("type", ["expense", "income"])
      .order("type", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("profiles")
      .select(
        "id, currency, pagination_enabled, enable_status_tracking, theme, show_cursor_trail, name"
      )
      .eq("id", userId)
      .maybeSingle(),
    supabase
      .from("monthly_budgets")
      .select("id, category, month, limit_amount, alert_threshold, rollover_amount")
      .eq("user_id", userId)
      .eq("month", format(new Date(), "yyyy-MM-01"))
      .order("category"),
  ]);

  const categories = categoriesRes.data || [];

  return {
    expenses: expensesRes.data || [],
    incomes: incomesRes.data || [],
    expenseCategories: categories.filter((category) => category.type === "expense"),
    incomeCategories: categories.filter((category) => category.type === "income"),
    profile: profileRes.data,
    budgets: budgetsRes.data || [],
  };
}
