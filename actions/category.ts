"use server";

import { createClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getCategories(type: "expense" | "income") {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("type", type)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
}

export async function addCategory(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

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

  revalidatePath("/dashboard");
}

export async function updateCategory(id: string, name: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("categories")
    .update({ name, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/categories");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  
  // Get category details first
  const { data: category, error: fetchError } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !category) {
    throw new Error("Category not found");
  }

  // Check if linked to expenses or incomes
  if (category.type === "expense") {
    const { count, error: checkError } = await supabase
      .from("expenses")
      .select("*", { count: "exact", head: true })
      .eq("category", category.name);
    
    if (checkError) throw checkError;
    if (count && count > 0) {
      throw new Error(`Cannot delete: This category is linked to ${count} record(s)`);
    }
  } else {
    const { count, error: checkError } = await supabase
      .from("incomes")
      .select("*", { count: "exact", head: true })
      .eq("source", category.name);
    
    if (checkError) throw checkError;
    if (count && count > 0) {
      throw new Error(`Cannot delete: This source is linked to ${count} record(s)`);
    }
  }

  const { error } = await supabase.from("categories").delete().match({ id });

  if (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/categories");
}
