/**
 * Server actions for expense.ts
 */
"use server";

import { getAuthenticatedClient } from "@/lib/supabase";
import { revalidateTransactions } from "@/lib/revalidate";
import { validateRequiredText, validateTransactionInput } from "@/lib/form-validation";
import { logError } from "@/lib/logger";

/**
 * Adds a new expense record to the database.
 * @param formData - The form data containing amount, category, date, and note.
 */
export async function addExpense(formData: FormData) {
  try {
    const { supabase, user } = await getAuthenticatedClient();
    const transaction = validateTransactionInput(formData);
    const category = validateRequiredText(formData.get("category"), "Category");

    if (!transaction.ok) return { error: transaction.error };
    if (!category.ok) return { error: category.error };

    const { data: duplicate } = await supabase
      .from("expenses")
      .select("id")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .eq("amount", transaction.value.amount)
      .eq("category", category.value)
      .eq("date", transaction.value.date)
      .limit(1)
      .maybeSingle();

    if (duplicate) {
      return {
        error: "This expense looks like a duplicate. Adjust it or edit the existing record.",
      };
    }

    let attachmentUrl: string | null = null;
    const attachment = formData.get("attachment");
    if (attachment instanceof File && attachment.size > 0) {
      const safeName = attachment.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `${user.id}/${crypto.randomUUID()}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from("transaction-attachments")
        .upload(path, attachment);
      if (uploadError) return { error: "Failed to upload attachment." };
      attachmentUrl = path;
    }

    const currency = String(formData.get("currency") || "USD");
    const { error } = await supabase.from("expenses").insert({
      user_id: user.id,
      amount: transaction.value.amount,
      category: category.value,
      date: transaction.value.date,
      note: transaction.value.note,
      status: transaction.value.status,
      attachment_url: attachmentUrl,
      currency,
    });

    if (error) {
      console.error("Error adding expense:", error);
      return { error: "Failed to add expense." };
    }

    revalidateTransactions(user.id);
    return { success: true };
  } catch (error) {
    logError("Error adding expense", error);
    return { error: error instanceof Error ? error.message : "Failed to add expense." };
  }
}

/**
 * Deletes an expense record by its ID.
 * @param id - The UUID of the expense to delete.
 */
export async function deleteExpense(id: string) {
  try {
    const { supabase, user } = await getAuthenticatedClient();
    const { error } = await supabase
      .from("expenses")
      .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting expense:", error);
      throw new Error("Failed to delete expense");
    }

    revalidateTransactions(user.id);
  } catch (error) {
    logError("Error deleting expense", error, { id });
    throw new Error(error instanceof Error ? error.message : "Failed to delete expense");
  }
}

/**
 * Updates an existing expense record.
 * @param id - The UUID of the expense to update.
 * @param formData - The form data containing updated fields (amount, category, date, note, status).
 */
export async function updateExpense(id: string, formData: FormData) {
  try {
    const { supabase, user } = await getAuthenticatedClient();
    const transaction = validateTransactionInput(formData);
    const category = validateRequiredText(formData.get("category"), "Category");

    if (!transaction.ok) return { error: transaction.error };
    if (!category.ok) return { error: category.error };

    const { error } = await supabase
      .from("expenses")
      .update({
        amount: transaction.value.amount,
        category: category.value,
        date: transaction.value.date,
        note: transaction.value.note,
        status: transaction.value.status,
        currency: String(formData.get("currency") || "USD"),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating expense:", error);
      return { error: "Failed to update expense." };
    }

    revalidateTransactions(user.id);
    return { success: true };
  } catch (error) {
    logError("Error updating expense", error, { id });
    return { error: error instanceof Error ? error.message : "Failed to update expense." };
  }
}

export async function addSplitExpense(formData: FormData) {
  const { supabase, user } = await getAuthenticatedClient();
  const date = String(formData.get("date") || "");
  const note = String(formData.get("note") || "");
  const currency = String(formData.get("currency") || "USD");
  const categories = formData.getAll("split_category").map(String);
  const amounts = formData.getAll("split_amount").map((value) => Number(value));

  const rows = categories
    .map((category, index) => ({
      user_id: user.id,
      amount: amounts[index],
      category: category.trim(),
      date,
      note,
      currency,
      status: "done",
    }))
    .filter((row) => row.category && Number.isFinite(row.amount) && row.amount > 0 && row.date);

  if (rows.length < 2) return { error: "Add at least two valid split lines." };

  const { error } = await supabase.from("expenses").insert(rows);
  if (error) return { error: "Failed to save split expense." };

  revalidateTransactions(user.id);
  return { success: true };
}

export async function bulkUpdateExpenses(ids: string[], updates: Record<string, string>) {
  const { supabase, user } = await getAuthenticatedClient();
  const payload = { ...updates, updated_at: new Date().toISOString() };
  const { error } = await supabase
    .from("expenses")
    .update(payload)
    .in("id", ids)
    .eq("user_id", user.id);
  if (error) throw new Error("Failed to bulk update expenses");
  revalidateTransactions(user.id);
}
