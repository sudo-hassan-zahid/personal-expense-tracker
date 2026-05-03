/**
 * Utility/Hook: dashboard-data.ts
 */
import { createClient } from "@/lib/supabase";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { getCurrentPKTDate } from "@/lib/date-utils";
import { cacheTag } from "next/cache";

/**
 * Cached data fetcher for the dashboard.
 * Runs dashboard queries in parallel with a single Supabase client.
 * Cache is invalidated via revalidateTag("transactions"/"categories"/"profile").
 */
export async function getDashboardData(userId: string, cookieStore?: unknown) {
  "use cache";
  cacheTag("transactions", "categories", "profile", `profile-${userId}`, userId);

  const supabase = await createClient(cookieStore);

  // Date filtering for current month in PKT
  const todayPKT = getCurrentPKTDate();
  const monthStart = format(startOfMonth(todayPKT), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(todayPKT), "yyyy-MM-dd");

  // Keep independent dashboard reads parallel while avoiding duplicate category round trips.
  const [expensesRes, incomesRes, categoriesRes, profileRes] = await Promise.all([
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
      .in("type", ["expense", "income"])
      .order("type", { ascending: true })
      .order("name", { ascending: true }),
    supabase
      .from("profiles")
      .select("id, currency, pagination_enabled, enable_status_tracking, theme, show_cursor_trail, name")
      .eq("id", userId)
      .maybeSingle(),
  ]);

  const categories = categoriesRes.data || [];

  return {
    expenses: expensesRes.data || [],
    incomes: incomesRes.data || [],
    expenseCategories: categories.filter((category) => category.type === "expense"),
    incomeCategories: categories.filter((category) => category.type === "income"),
    profile: profileRes.data,
  };
}

