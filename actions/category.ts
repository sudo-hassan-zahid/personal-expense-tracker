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
