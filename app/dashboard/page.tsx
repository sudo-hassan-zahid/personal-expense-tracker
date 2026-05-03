import { createClient } from "@/lib/supabase";
import { getDashboardData } from "@/lib/dashboard-data";
import { cookies } from "next/headers";
import { DashboardContent } from "@/components/DashboardContent";

export default async function DashboardPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // searchParams is dynamic — must be outside of 'use cache'
  const searchParams = await props.searchParams;
  const filterType = searchParams?.type as string | undefined;
  const filterStatus = searchParams?.status as string | undefined;

  // Get cookies outside of 'use cache' scope
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const supabase = await createClient(allCookies);
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id ?? "";

  // Cached data fetching — all 5 queries run in parallel, result is cached
  // Pass cookies explicitly to avoid dynamic access error
  const { expenses, incomes, expenseCategories, incomeCategories, profile } =
    await getDashboardData(userId, allCookies);

  const currency = profile?.currency || "USD";
  const paginationEnabled = profile?.pagination_enabled ?? true;
  const isStatusTrackingEnabled = profile?.enable_status_tracking ?? false;
  const ITEMS_PER_PAGE = parseInt((searchParams?.limit as string) || "10");
  const isWideView = searchParams?.view === "wide";

  return (
    <DashboardContent
      expenses={expenses}
      incomes={incomes}
      expenseCategories={expenseCategories}
      incomeCategories={incomeCategories}
      profile={profile}
      currency={currency}
      paginationEnabled={paginationEnabled}
      isStatusTrackingEnabled={isStatusTrackingEnabled}
      itemsPerPage={ITEMS_PER_PAGE}
      filterType={filterType}
      filterStatus={filterStatus}
      isWideView={isWideView}
      searchParams={searchParams ?? {}}
    />
  );
}

