import { TopNavClient } from "./TopNavClient";
import { getRequestAuth } from "@/lib/request-data";
import { getCategories } from "@/actions/category";
import { getProfile } from "@/actions/profile";

export async function TopNav({ activeTheme }: { activeTheme: "light" | "dark" }) {
  const { user } = await getRequestAuth();
  const [expenseCategories, incomeCategories, profile] = user
    ? await Promise.all([getCategories("expense"), getCategories("income"), getProfile()])
    : [[], [], null];

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

