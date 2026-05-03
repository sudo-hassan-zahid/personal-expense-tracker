import { getDashboardData } from "@/lib/dashboard-data";
import { parseDashboardFilters } from "@/lib/dashboard-filters";
import { getRequestAuth } from "@/lib/request-data";

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  const { allCookies, user } = await getRequestAuth();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());
  const filters = parseDashboardFilters(params);
  const { expenses, incomes } = await getDashboardData(user.id, allCookies, filters);

  const rows = [
    ["type", "date", "amount", "category_or_source", "status", "note", "created_at"],
    ...expenses.map((expense) => [
      "expense",
      expense.date,
      expense.amount,
      expense.category,
      expense.status || "done",
      expense.note || "",
      expense.created_at,
    ]),
    ...incomes.map((income) => [
      "income",
      income.date,
      income.amount,
      income.source,
      income.status || "done",
      income.note || "",
      income.created_at,
    ]),
  ];

  const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="transactions-${new Date()
        .toISOString()
        .slice(0, 10)}.csv"`,
    },
  });
}
