/**
 * Server actions for profile.ts
 */
"use server";

import { createClient, getAuthenticatedClient } from "@/lib/supabase";
import { revalidateTag, revalidatePath, cacheTag } from "next/cache";
import { cookies } from "next/headers";
import { revalidateAll } from "@/lib/revalidate";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Fetches the current user's profile from the database.
 * Accepts an optional pre-created supabase client to avoid redundant client creation.
 * Uses a cached inner function to ensure user-specific data isolation.
 * @returns The profile object or null if not found.
 */
export async function getProfile(client?: SupabaseClient) {
  const supabase = client || (await createClient());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return getCachedProfile(user.id);
}

/**
 * Inner cached function to fetch profile data.
 * Keyed by userId to prevent cross-user data leakage.
 */
async function getCachedProfile(userId: string) {
  "use cache";
  cacheTag("profile");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "id, theme, show_cursor_trail, currency, pagination_enabled, enable_status_tracking, name"
    )
    .eq("id", userId)
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
  try {
    const { supabase, user } = await getAuthenticatedClient();
    const currency = formData.get("currency") as string;

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, currency, updated_at: new Date().toISOString() });

    if (error) throw error;

    revalidateAll();
    return { success: true };
  } catch (error: any) {
    console.error("Error updating currency:", error);
    return { success: false, error: error.message || "Failed to update currency" };
  }
}

/**
 * Updates the user's full profile including theme, pagination, and status tracking.
 * @param formData - The form data containing name, email, password, currency, theme, and feature toggles.
 */
export async function updateProfile(formData: FormData) {
  try {
    const { supabase, user } = await getAuthenticatedClient();

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
      updated_at: new Date().toISOString(),
    };

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...updates });

    if (profileError) throw profileError;

    const authUpdates: any = {};
    if (email && email !== user.email) authUpdates.email = email;
    if (password) authUpdates.password = password;

    // Update theme cookie to ensure layout reflects change immediately
    if (theme) {
      const cookieStore = await cookies();
      cookieStore.set("theme", theme, { path: "/", maxAge: 31536000 });
    }

    revalidateAll();
    return { success: true };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return { success: false, error: error.message || "Failed to update profile" };
  }
}

