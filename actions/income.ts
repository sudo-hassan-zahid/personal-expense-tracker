"use server";

import { createClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function addIncome(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const amount = parseFloat(formData.get("amount") as string);
  const source = formData.get("source") as string;
  const date = formData.get("date") as string;
  const note = formData.get("note") as string;

  const { error } = await supabase.from("incomes").insert({
    user_id: user.id,
    amount,
    source,
    date,
    note,
  });

  if (error) {
    console.error("Error adding income:", error);
    throw new Error("Failed to add income");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/income");
}

export async function deleteIncome(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("incomes").delete().match({ id });

  if (error) {
    console.error("Error deleting income:", error);
    throw new Error("Failed to delete income");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/income");
}

export async function updateIncome(id: string, formData: FormData) {
  const supabase = await createClient();
  const amount = parseFloat(formData.get("amount") as string);
  const source = formData.get("source") as string;
  const date = formData.get("date") as string;
  const note = formData.get("note") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase
    .from("incomes")
    .update({ amount, source, date, note, status })
    .match({ id });

  if (error) {
    console.error("Error updating income:", error);
    throw new Error("Failed to update income");
  }

  revalidatePath("/dashboard");
}
