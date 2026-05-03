/**
 * Server actions for income.ts
 */
"use server";

import { getAuthenticatedClient } from "@/lib/supabase";
import { revalidateTransactions } from "@/lib/revalidate";
import { validateRequiredText, validateTransactionInput } from "@/lib/form-validation";

/**
 * Adds a new income record to the database.
 * @param formData - The form data containing amount, source, date, and note.
 */
export async function addIncome(formData: FormData) {
  try {
    const { supabase, user } = await getAuthenticatedClient();
    const transaction = validateTransactionInput(formData);
    const source = validateRequiredText(formData.get("source"), "Source");

    if (!transaction.ok) return { error: transaction.error };
    if (!source.ok) return { error: source.error };

    const { data: duplicate } = await supabase
      .from("incomes")
      .select("id")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .eq("amount", transaction.value.amount)
      .eq("source", source.value)
      .eq("date", transaction.value.date)
      .limit(1)
      .maybeSingle();

    if (duplicate) {
      return { error: "This income looks like a duplicate. Adjust it or edit the existing record." };
    }

    const currency = String(formData.get("currency") || "USD");
    const { error } = await supabase.from("incomes").insert({
      user_id: user.id,
      amount: transaction.value.amount,
      source: source.value,
      date: transaction.value.date,
      note: transaction.value.note,
      status: transaction.value.status,
      currency,
    });

    if (error) {
      console.error("Error adding income:", error);
      return { error: "Failed to add income." };
    }

    revalidateTransactions();
    return { success: true };
  } catch (error) {
    console.error("Error adding income:", error);
    return { error: error instanceof Error ? error.message : "Failed to add income." };
  }
}

/**
 * Deletes an income record by its ID.
 * @param id - The UUID of the income to delete.
 */
export async function deleteIncome(id: string) {
  const { supabase, user } = await getAuthenticatedClient();
  const { error } = await supabase
    .from("incomes")
    .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting income:", error);
    throw new Error("Failed to delete income");
  }

  revalidateTransactions();
}

/**
 * Updates an existing income record.
 * @param id - The UUID of the income to update.
 * @param formData - The form data containing updated fields (amount, source, date, note, status).
 */
export async function updateIncome(id: string, formData: FormData) {
  try {
    const { supabase, user } = await getAuthenticatedClient();
    const transaction = validateTransactionInput(formData);
    const source = validateRequiredText(formData.get("source"), "Source");

    if (!transaction.ok) return { error: transaction.error };
    if (!source.ok) return { error: source.error };

    const { error } = await supabase
      .from("incomes")
      .update({
        amount: transaction.value.amount,
        source: source.value,
        date: transaction.value.date,
        note: transaction.value.note,
        status: transaction.value.status,
        currency: String(formData.get("currency") || "USD"),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating income:", error);
      return { error: "Failed to update income." };
    }

    revalidateTransactions();
    return { success: true };
  } catch (error) {
    console.error("Error updating income:", error);
    return { error: error instanceof Error ? error.message : "Failed to update income." };
  }
}

export async function bulkUpdateIncomes(ids: string[], updates: Record<string, string>) {
  const { supabase, user } = await getAuthenticatedClient();
  const payload = { ...updates, updated_at: new Date().toISOString() };
  const { error } = await supabase
    .from("incomes")
    .update(payload)
    .in("id", ids)
    .eq("user_id", user.id);
  if (error) throw new Error("Failed to bulk update incomes");
  revalidateTransactions();
}

