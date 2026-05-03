/**
 * Utility/Hook: dashboard-data.ts
 */
import { createClient } from "@/lib/supabase";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { getCurrentPKTDate } from "@/lib/date-utils";
import { cacheTag } from "next/cache";

/**
 * Cached data fetcher for the dashboard.
 * Runs all 5 queries in parallel with a single Supabase client.
 * Cache is invalidated via revalidateTag("transactions"/"categories"/"profile").
 */
export async function getDashboardData(cookieStore?: unknown) {
  "use cache";
  cacheTag("transactions", "categories", "profile");

  const supabase = await createClient(cookieStore);

  // Date filtering for current month in PKT
  const todayPKT = getCurrentPKTDate();
  const monthStart = format(startOfMonth(todayPKT), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(todayPKT), "yyyy-MM-dd");

  // Get user first (needed for profile query)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id ?? "";

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
      .select("id, currency, pagination_enabled, enable_status_tracking, theme, show_cursor_trail, name")
      .eq("id", userId)
      .maybeSingle(),
  ]);

  return {
    expenses: expensesRes.data || [],
    incomes: incomesRes.data || [],
    expenseCategories: expCatsRes.data || [],
    incomeCategories: incCatsRes.data || [],
    profile: profileRes.data,
  };
}

