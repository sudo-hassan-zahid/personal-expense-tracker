/**
 * Page/Route: page.tsx
 */
import { getCategories } from "@/actions/category";
import { CategoryManager } from "@/components/CategoryManager";

export const metadata = {
  title: "Categories | Expense Tracker",
  description: "Manage your expense and income categories",
};

export default async function CategoriesPage() {
  const [expenses, incomes] = await Promise.all([
    getCategories("expense"),
    getCategories("income"),
  ]);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-6 py-[40px] flex flex-col gap-8 flex-1">
      <div className="flex flex-col gap-2">
        <h1 className="text-display-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
          Categories Management
        </h1>
        <p className="text-body-md text-(--color-muted)">
          Organize your finances by creating and managing your custom categories.
        </p>
      </div>

      <CategoryManager initialExpenses={expenses} initialIncomes={incomes} />
    </div>
  );
}

