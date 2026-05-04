"use server";

import { addMonths, addWeeks, addYears, format } from "date-fns";
import { getAuthenticatedClient } from "@/lib/supabase";
import { revalidatePlanning, revalidateTransactions } from "@/lib/revalidate";
import { validateRequiredText } from "@/lib/form-validation";

function positiveNumber(formData: FormData, key: string, label: string) {
  const value = Number(formData.get(key));
  if (!Number.isFinite(value) || value <= 0)
    return { error: `${label} must be greater than zero.` };
  return { value };
}

export async function getPlanningData() {
  const { supabase, user } = await getAuthenticatedClient();
  const month = format(new Date(), "yyyy-MM-01");

  const [budgets, goals, recurring] = await Promise.all([
    supabase
      .from("monthly_budgets")
      .select("id, category, month, limit_amount, alert_threshold, rollover_amount")
      .eq("user_id", user.id)
      .eq("month", month)
      .order("category"),
    supabase
      .from("savings_goals")
      .select("id, name, target_amount, current_amount, target_date")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("recurring_transactions")
      .select("id, type, amount, category_or_source, note, frequency, next_date, end_date, status")
      .eq("user_id", user.id)
      .order("next_date", { ascending: true }),
  ]);

  return {
    budgets: budgets.data || [],
    goals: goals.data || [],
    recurring: recurring.data || [],
    month,
  };
}

export async function saveBudget(formData: FormData) {
  const { supabase, user } = await getAuthenticatedClient();
  const category = validateRequiredText(formData.get("category"), "Category");
  const amount = positiveNumber(formData, "limit_amount", "Budget");
  const threshold = Number(formData.get("alert_threshold") || 80) / 100;
  const rollover = Number(formData.get("rollover_amount") || 0);
  const month = String(formData.get("month") || format(new Date(), "yyyy-MM-01"));

  if (!category.ok) return { error: category.error };
  if ("error" in amount) return amount;
  if (!Number.isFinite(threshold) || threshold <= 0 || threshold > 1) {
    return { error: "Alert threshold must be between 1 and 100." };
  }
  if (!Number.isFinite(rollover) || rollover < 0) return { error: "Rollover cannot be negative." };

  const { error } = await supabase.from("monthly_budgets").upsert(
    {
      user_id: user.id,
      category: category.value,
      month,
      limit_amount: amount.value,
      alert_threshold: threshold,
      rollover_amount: rollover,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,category,month" }
  );

  if (error) return { error: "Failed to save budget." };
  revalidatePlanning();
  return { success: true };
}

export async function deleteBudget(id: string) {
  const { supabase, user } = await getAuthenticatedClient();
  const { error } = await supabase
    .from("monthly_budgets")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error("Failed to delete budget");
  revalidatePlanning();
}

export async function saveSavingsGoal(formData: FormData) {
  const { supabase, user } = await getAuthenticatedClient();
  const name = validateRequiredText(formData.get("name"), "Goal name");
  const target = positiveNumber(formData, "target_amount", "Target amount");
  const current = Number(formData.get("current_amount") || 0);
  const targetDate = String(formData.get("target_date") || "") || null;

  if (!name.ok) return { error: name.error };
  if ("error" in target) return target;
  if (!Number.isFinite(current) || current < 0)
    return { error: "Current amount cannot be negative." };

  const { error } = await supabase.from("savings_goals").insert({
    user_id: user.id,
    name: name.value,
    target_amount: target.value,
    current_amount: current,
    target_date: targetDate,
  });

  if (error) return { error: "Failed to save savings goal." };
  revalidatePlanning();
  return { success: true };
}

export async function deleteSavingsGoal(id: string) {
  const { supabase, user } = await getAuthenticatedClient();
  const { error } = await supabase
    .from("savings_goals")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error("Failed to delete savings goal");
  revalidatePlanning();
}

export async function saveRecurringTransaction(formData: FormData) {
  const { supabase, user } = await getAuthenticatedClient();
  const type = String(formData.get("type")) === "income" ? "income" : "expense";
  const amount = positiveNumber(formData, "amount", "Amount");
  const category = validateRequiredText(formData.get("category_or_source"), "Category or source");
  const frequency = String(formData.get("frequency"));
  const nextDate = String(formData.get("next_date") || "");
  const endDate = String(formData.get("end_date") || "") || null;

  if ("error" in amount) return amount;
  if (!category.ok) return { error: category.error };
  if (!["weekly", "monthly", "yearly"].includes(frequency))
    return { error: "Choose a valid frequency." };
  if (!nextDate) return { error: "Next date is required." };

  const { error } = await supabase.from("recurring_transactions").insert({
    user_id: user.id,
    type,
    amount: amount.value,
    category_or_source: category.value,
    note: String(formData.get("note") || ""),
    frequency,
    next_date: nextDate,
    end_date: endDate,
  });

  if (error) return { error: "Failed to save recurring transaction." };
  revalidatePlanning();
  return { success: true };
}

export async function deleteRecurringTransaction(id: string) {
  const { supabase, user } = await getAuthenticatedClient();
  const { error } = await supabase
    .from("recurring_transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error("Failed to delete recurring transaction");
  revalidatePlanning();
}

export async function postDueRecurringTransactions() {
  const { supabase, user } = await getAuthenticatedClient();
  const today = format(new Date(), "yyyy-MM-dd");
  const { data, error } = await supabase
    .from("recurring_transactions")
    .select("id, type, amount, category_or_source, note, frequency, next_date, end_date")
    .eq("user_id", user.id)
    .eq("status", "active")
    .lte("next_date", today);

  if (error) return { error: "Failed to load recurring transactions." };

  for (const item of data || []) {
    const table = item.type === "income" ? "incomes" : "expenses";
    const payload =
      item.type === "income"
        ? {
            user_id: user.id,
            amount: item.amount,
            source: item.category_or_source,
            date: item.next_date,
            note: item.note || "",
          }
        : {
            user_id: user.id,
            amount: item.amount,
            category: item.category_or_source,
            date: item.next_date,
            note: item.note || "",
          };
    await supabase.from(table).insert(payload);

    const current = new Date(`${item.next_date}T00:00:00`);
    const next =
      item.frequency === "weekly"
        ? addWeeks(current, 1)
        : item.frequency === "yearly"
          ? addYears(current, 1)
          : addMonths(current, 1);
    await supabase
      .from("recurring_transactions")
      .update({ next_date: format(next, "yyyy-MM-dd"), updated_at: new Date().toISOString() })
      .eq("id", item.id)
      .eq("user_id", user.id);
  }

  revalidateTransactions();
  revalidatePlanning();
  return { success: true };
}
