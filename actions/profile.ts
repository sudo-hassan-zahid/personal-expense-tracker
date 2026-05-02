"use server";

import { createClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

export async function updateCurrency(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const currency = formData.get("currency") as string;

  const { error } = await supabase
    .from("profiles")
    .update({ currency, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating currency:", error);
    throw new Error("Failed to update currency");
  }

  revalidatePath("/dashboard");
}
