/**
 * Server actions for expense.ts
 */
"use server";

import { createClient, getAuthenticatedClient } from "@/lib/supabase";
import { revalidateTag, revalidatePath } from "next/cache";
import { revalidateAll } from "@/lib/revalidate";

/**
 * Adds a new expense record to the database.
 * @param formData - The form data containing amount, category, date, and note.
 */
export async function addExpense(formData: FormData) {
  const { supabase, user } = await getAuthenticatedClient();

  const amount = parseFloat(formData.get("amount") as string);
  const category = formData.get("category") as string;
  const date = formData.get("date") as string;
  const note = formData.get("note") as string;

  const status = (formData.get("status") as string) || "done";
  const { error } = await supabase.from("expenses").insert({
    user_id: user.id,
    amount,
    category,
    date,
    note,
    status,
  });

  if (error) {
    console.error("Error adding expense:", error);
    throw new Error("Failed to add expense");
  }

  revalidateAll();
}

/**
 * Deletes an expense record by its ID.
 * @param id - The UUID of the expense to delete.
 */
export async function deleteExpense(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("expenses").delete().match({ id });

  if (error) {
    console.error("Error deleting expense:", error);
    throw new Error("Failed to delete expense");
  }

  revalidateAll();
}

/**
 * Updates an existing expense record.
 * @param id - The UUID of the expense to update.
 * @param formData - The form data containing updated fields (amount, category, date, note, status).
 */
export async function updateExpense(id: string, formData: FormData) {
  const supabase = await createClient();
  const amount = parseFloat(formData.get("amount") as string);
  const category = formData.get("category") as string;
  const date = formData.get("date") as string;
  const note = formData.get("note") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase
    .from("expenses")
    .update({ amount, category, date, note, status })
    .match({ id });

  if (error) {
    console.error("Error updating expense:", error);
    throw new Error("Failed to update expense");
  }

  revalidateAll();
}

