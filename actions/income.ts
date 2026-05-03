/**
 * Server actions for income.ts
 */
"use server";

import { createClient, getAuthenticatedClient } from "@/lib/supabase";
import { revalidateTag, revalidatePath } from "next/cache";
import { revalidateAll } from "@/lib/revalidate";

/**
 * Adds a new income record to the database.
 * @param formData - The form data containing amount, source, date, and note.
 */
export async function addIncome(formData: FormData) {
  const { supabase, user } = await getAuthenticatedClient();

  const amount = parseFloat(formData.get("amount") as string);
  const source = formData.get("source") as string;
  const date = formData.get("date") as string;
  const note = formData.get("note") as string;

  const status = (formData.get("status") as string) || "done";
  const { error } = await supabase.from("incomes").insert({
    user_id: user.id,
    amount,
    source,
    date,
    note,
    status,
  });

  if (error) {
    console.error("Error adding income:", error);
    throw new Error("Failed to add income");
  }

  revalidateAll();
}

/**
 * Deletes an income record by its ID.
 * @param id - The UUID of the income to delete.
 */
export async function deleteIncome(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("incomes").delete().match({ id });

  if (error) {
    console.error("Error deleting income:", error);
    throw new Error("Failed to delete income");
  }

  revalidateAll();
}

/**
 * Updates an existing income record.
 * @param id - The UUID of the income to update.
 * @param formData - The form data containing updated fields (amount, source, date, note, status).
 */
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

  revalidateAll();
}

