"use server";

import { getAuthenticatedClient } from "@/lib/supabase";
import { revalidateAll } from "@/lib/revalidate";

export async function deleteAccountData(formData: FormData) {
  const confirmation = String(formData.get("confirmation") || "");
  if (confirmation !== "DELETE") return { error: "Type DELETE to confirm account data deletion." };

  const { supabase, user } = await getAuthenticatedClient();
  await Promise.all([
    supabase.from("monthly_budgets").delete().eq("user_id", user.id),
    supabase.from("savings_goals").delete().eq("user_id", user.id),
    supabase.from("recurring_transactions").delete().eq("user_id", user.id),
    supabase.from("categories").delete().eq("user_id", user.id),
    supabase.from("expenses").delete().eq("user_id", user.id),
    supabase.from("incomes").delete().eq("user_id", user.id),
  ]);

  revalidateAll();
  return { success: true };
}
