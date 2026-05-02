"use server";

import { createClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

/**
 * Fetches the current user's profile from the database.
 * @returns The profile object or null if not found.
 */
export async function getProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}

/**
 * Updates the user's currency preference.
 * @param formData - The form data containing the new currency code.
 */
export async function updateCurrency(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const currency = formData.get("currency") as string;

  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, currency, updated_at: new Date().toISOString() });

  if (error) {
    console.error("Error updating currency:", error);
    throw new Error("Failed to update currency");
  }

  revalidatePath("/dashboard");
}

/**
 * Updates the user's full profile including theme, pagination, and status tracking.
 * @param formData - The form data containing name, email, password, currency, theme, and feature toggles.
 */
export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const currency = formData.get("currency") as string;
  const theme = formData.get("theme") as string;
  const paginationEnabled = formData.get("pagination") === "on";
  const statusTrackingEnabled = formData.get("enable_status_tracking") === "on";
  const showCursorTrail = formData.get("show_cursor_trail") === "on";

  const updates: any = {
    name,
    currency,
    theme,
    pagination_enabled: paginationEnabled,
    enable_status_tracking: statusTrackingEnabled,
    show_cursor_trail: showCursorTrail,
    updated_at: new Date().toISOString()
  };

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({ id: user.id, ...updates });

  if (profileError) {
    console.error("Error updating profile:", profileError);
    throw new Error("Failed to update profile");
  }

  const authUpdates: any = {};
  if (email && email !== user.email) authUpdates.email = email;
  if (password) authUpdates.password = password;

  if (Object.keys(authUpdates).length > 0) {
    const { error: authError } = await supabase.auth.updateUser(authUpdates);
    if (authError) {
      console.error("Error updating auth:", authError);
      throw new Error("Failed to update credentials");
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
}
