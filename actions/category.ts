/**
 * Server actions for category.ts
 */
"use server";

import { getAuthenticatedClient } from "@/lib/supabase";
import { revalidateCategories, revalidateTransactions } from "@/lib/revalidate";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase";
import { getRequestAuth } from "@/lib/request-data";

/**
 * Fetches categories for a given type.
 * Accepts an optional pre-created supabase client to avoid redundant client creation
 * when called alongside other queries (e.g. in dashboard Promise.all).
 */
export async function getCategories(type: "expense" | "income", client?: SupabaseClient) {
  if (!client) {
    const categories = await getUserCategories();
    return categories.filter((category) => category.type === type);
  }

  const supabase = client || (await createClient());

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, type, parent_id")
    .eq("type", type)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
}

export async function getUserCategories(client?: SupabaseClient, userId?: string) {
  const auth = client && userId ? null : await getRequestAuth();
  const effectiveUserId = userId || auth?.user?.id;

  if (!effectiveUserId) return [];

  const supabase = client || (await createClient(auth?.allCookies));

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, type, parent_id")
    .eq("user_id", effectiveUserId)
    .in("type", ["expense", "income"])
    .order("type", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
}

export async function addCategory(formData: FormData) {
  const { supabase, user } = await getAuthenticatedClient();

  const name = (formData.get("name") as string).trim();
  const type = formData.get("type") as "expense" | "income";
  const parentId = formData.get("parent_id") as string | null;

  if (!name) {
    throw new Error("Category name is required");
  }

  const { error } = await supabase.from("categories").insert({
    user_id: user.id,
    name,
    type,
    parent_id: parentId || null,
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("Category already exists");
    }
    console.error("Error adding category:", error);
    throw new Error("Failed to add category");
  }

  revalidateCategories(user.id);
}

export async function updateCategory(id: string, name: string) {
  const { supabase, user } = await getAuthenticatedClient();
  const nextName = name.trim();

  // 1. Get current category name and type
  const { data: category, error: fetchError } = await supabase
    .from("categories")
    .select("name, type")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !category) {
    throw new Error("Category not found");
  }

  const oldName = category.name;
  const type = category.type;

  // 2. Update the category name
  const { error } = await supabase
    .from("categories")
    .update({ name: nextName })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    if (error.code === "23505") {
      throw new Error("A category with this name already exists");
    }
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }

  // 3. Propagate name change to linked transactions (since they use text links)
  if (oldName !== nextName) {
    if (type === "expense") {
      await supabase
        .from("expenses")
        .update({ category: nextName })
        .eq("user_id", user.id)
        .eq("category", oldName);
    } else {
      await supabase
        .from("incomes")
        .update({ source: nextName })
        .eq("user_id", user.id)
        .eq("source", oldName);
    }
    revalidateTransactions(user.id);
  }

  revalidateCategories(user.id);
}

export async function deleteCategory(id: string) {
  const { supabase, user } = await getAuthenticatedClient();

  // Get category details first
  const { data: category, error: fetchError } = await supabase
    .from("categories")
    .select("name, type")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !category) {
    throw new Error("Category not found");
  }

  // Check if linked to expenses or incomes
  if (category.type === "expense") {
    const { count, error: checkError } = await supabase
      .from("expenses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("category", category.name);

    if (checkError) throw checkError;
    if (count && count > 0) {
      throw new Error(`Cannot delete: This category is linked to ${count} record(s)`);
    }
  } else {
    const { count, error: checkError } = await supabase
      .from("incomes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("source", category.name);

    if (checkError) throw checkError;
    if (count && count > 0) {
      throw new Error(`Cannot delete: This source is linked to ${count} record(s)`);
    }
  }

  const { error } = await supabase.from("categories").delete().eq("id", id).eq("user_id", user.id);

  if (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }

  revalidateCategories(user.id);
}
