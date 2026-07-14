import { getPlanningPageData } from "@/actions/planning";
import { PlanningPanel } from "@/components/PlanningPanel";

export const metadata = {
  title: "Planning",
  description: "Budgets, savings goals, recurring transactions, and imports",
};

export default async function PlanningPage() {
  const { planning, expenseCategories, incomeCategories, profile } = await getPlanningPageData();

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
        expenseCategories={expenseCategories}
        incomeCategories={incomeCategories}
        month={planning.month}
        currency={profile?.currency || "USD"}
      />
    </div>
  );
}
