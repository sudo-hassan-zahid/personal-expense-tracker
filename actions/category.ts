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

export async function deleteCategory(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("categories").delete().match({ id });

  if (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }

  revalidatePath("/dashboard");
}
