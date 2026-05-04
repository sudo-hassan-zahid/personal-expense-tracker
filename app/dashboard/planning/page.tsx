import { getCategories } from "@/actions/category";
import { getPlanningData } from "@/actions/planning";
import { getProfile } from "@/actions/profile";
import { PlanningPanel } from "@/components/PlanningPanel";

export const metadata = {
  title: "Planning | Expense Tracker",
  description: "Budgets, savings goals, recurring transactions, and imports",
};

export default async function PlanningPage() {
  const [planning, expenses, incomes, profile] = await Promise.all([
    getPlanningData(),
    getCategories("expense"),
    getCategories("income"),
    getProfile(),
  ]);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-6 py-6 md:py-10 flex flex-col gap-6 flex-1">
      <div>
        <h1 className="text-display-sm">Planning</h1>
        <p className="text-body-md text-(--color-muted)">
          Budgets, goals, recurring transactions, and spreadsheet imports.
        </p>
      </div>
      <PlanningPanel
        budgets={planning.budgets}
        goals={planning.goals}
        recurring={planning.recurring}
        expenseCategories={expenses}
        incomeCategories={incomes}
        month={planning.month}
        currency={profile?.currency || "USD"}
      />
    </div>
  );
}
