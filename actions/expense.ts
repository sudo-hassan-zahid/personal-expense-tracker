/**
 * Server actions for expense.ts
 */
"use server";

import { getAuthenticatedClient } from "@/lib/supabase";
import { revalidateTransactions } from "@/lib/revalidate";
import { validateRequiredText, validateTransactionInput } from "@/lib/form-validation";

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

    const { error } = await supabase.from("expenses").insert({
      user_id: user.id,
      amount: transaction.value.amount,
      category: category.value,
      date: transaction.value.date,
      note: transaction.value.note,
      status: transaction.value.status,
    });

    if (error) {
      console.error("Error adding expense:", error);
      return { error: "Failed to add expense." };
    }

    revalidateTransactions();
    return { success: true };
  } catch (error) {
    console.error("Error adding expense:", error);
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
    const { error } = await supabase.from("expenses").delete().eq("id", id).eq("user_id", user.id);

    if (error) {
      console.error("Error deleting expense:", error);
      throw new Error("Failed to delete expense");
    }

    revalidateTransactions();
  } catch (error) {
    console.error("Error deleting expense:", error);
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
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating expense:", error);
      return { error: "Failed to update expense." };
    }

    revalidateTransactions();
    return { success: true };
  } catch (error) {
    console.error("Error updating expense:", error);
    return { error: error instanceof Error ? error.message : "Failed to update expense." };
  }
}

