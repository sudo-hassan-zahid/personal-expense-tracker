import { TopNavClient } from "./TopNavClient";
import { getRequestAuth } from "@/lib/request-data";
import { getUserCategories } from "@/actions/category";
import type { RequestProfile } from "@/lib/request-data";

export async function TopNav({
  activeTheme,
  profile,
}: {
  activeTheme: "light" | "dark";
  profile: RequestProfile;
}) {
  const { user } = await getRequestAuth();
  const categories = user ? await getUserCategories() : [];
  const expenseCategories = categories.filter((category) => category.type === "expense");
  const incomeCategories = categories.filter((category) => category.type === "income");

  return (
    <TopNavClient
      user={user}
      activeTheme={activeTheme}
      expenseCategories={expenseCategories}
      incomeCategories={incomeCategories}
      currency={profile?.currency || "USD"}
    />
  );
}
