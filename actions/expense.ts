"use server";

import { createClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function addExpense(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const amount = parseFloat(formData.get("amount") as string);
  const category = formData.get("category") as string;
  const date = formData.get("date") as string;
  const note = formData.get("note") as string;

  const { error } = await supabase.from("expenses").insert({
    user_id: user.id,
    amount,
    category,
    date,
    note,
  });

  if (error) {
    console.error("Error adding expense:", error);
    throw new Error("Failed to add expense");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/expenses");
}

export async function deleteExpense(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("expenses").delete().match({ id });

  if (error) {
    console.error("Error deleting expense:", error);
    throw new Error("Failed to delete expense");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/expenses");
}
