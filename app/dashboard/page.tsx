import { getDashboardData } from "@/lib/dashboard-data";
import { DashboardContent } from "@/components/DashboardContent";
import { getRequestAuth, getRequestProfile } from "@/lib/request-data";
import { parseDashboardFilters } from "@/lib/dashboard-filters";
import { redirect } from "next/navigation";

export default async function DashboardPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // searchParams is dynamic — must be outside of 'use cache'
  const searchParams = await props.searchParams;
  const filterType = searchParams?.type as string | undefined;
  const filterStatus = searchParams?.status as string | undefined;

  const { allCookies, user } = await getRequestAuth();
  const userId = user?.id ?? "";
  const requestProfile = await getRequestProfile();
  const dashboardFilters = parseDashboardFilters(
    searchParams,
    "this-month",
    requestProfile?.auto_carry_forward_balance ?? false
  );

  // Cached data fetching — all 5 queries run in parallel, result is cached
  // Pass cookies explicitly to avoid dynamic access error
  const {
    expenses,
    incomes,
    expenseCategories,
    incomeCategories,
    profile,
    budgets,
    openingBalance,
    availableMonths,
  } = await getDashboardData(userId, allCookies, dashboardFilters, {
    type: filterType,
    status: filterStatus,
  });

  const requestedMonth = searchParams?.month;
  const selectedMonth = dashboardFilters.month || dashboardFilters.startDate?.slice(0, 7);
  if (
    !requestedMonth &&
    dashboardFilters.period === "this-month" &&
    selectedMonth &&
    availableMonths.length > 0 &&
    !availableMonths.includes(selectedMonth)
  ) {
    const params = new URLSearchParams();
    Object.entries(searchParams ?? {}).forEach(([key, value]) => {
      if (!value || key === "period" || key === "start" || key === "end" || key === "page") {
        return;
      }
      params.set(key, Array.isArray(value) ? value[0] : value);
    });
    params.set("month", availableMonths[0]);
    redirect(`/dashboard?${params.toString()}`);
  }

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
      budgets={budgets}
      currency={currency}
      paginationEnabled={paginationEnabled}
      isStatusTrackingEnabled={isStatusTrackingEnabled}
      itemsPerPage={ITEMS_PER_PAGE}
      filterType={filterType}
      filterStatus={filterStatus}
      isWideView={isWideView}
      searchParams={searchParams ?? {}}
      dashboardFilters={dashboardFilters}
      openingBalance={openingBalance}
      availableMonths={availableMonths}
    />
  );
}
