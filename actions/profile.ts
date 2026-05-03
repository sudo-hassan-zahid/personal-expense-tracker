/**
 * Server actions for profile.ts
 */
"use server";

import { createClient, getAuthenticatedClient } from "@/lib/supabase";
import { cookies } from "next/headers";
import { revalidateProfile } from "@/lib/revalidate";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getRequestAuth, getRequestProfile } from "@/lib/request-data";

type ProfileUpdate = {
  name: string;
  currency: string;
  theme: string;
  pagination_enabled: boolean;
  enable_status_tracking: boolean;
  show_cursor_trail: boolean;
  updated_at: string;
};

type AuthUpdate = {
  email?: string;
  password?: string;
};

function hasSupabaseAuthCookie(allCookies: { name: string }[]) {
  return allCookies.some((cookie) => cookie.name.startsWith("sb-"));
}

/**
 * Fetches the current user's profile from the database.
 * Accepts an optional pre-created supabase client to avoid redundant client creation.
 * Uses a cached inner function to ensure user-specific data isolation.
 * @returns The profile object or null if not found.
 */
export async function getProfile(client?: SupabaseClient) {
  if (!client) {
    return getRequestProfile();
  }

  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  if (!hasSupabaseAuthCookie(allCookies)) return null;

  const supabase = client;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return fetchProfile(user.id, allCookies);
}

/**
 * Inner function to fetch profile data directly from DB.
 */
async function fetchProfile(userId: string, cookieStore?: unknown) {
  if (!cookieStore) {
    const { allCookies } = await getRequestAuth();
    cookieStore = allCookies;
  }

  const supabase = await createClient(cookieStore);
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

    revalidateProfile(user.id);
    return { success: true };
  } catch (error) {
    console.error("Error updating currency:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update currency",
    };
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

    const updates: ProfileUpdate = {
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

    if (profileError) {
      console.error("Profile update error:", profileError);
      return { success: false, error: `Database error: ${profileError.message}` };
    }

    // Update Auth Email/Password if provided
    const authUpdates: AuthUpdate = {};
    if (email && email !== user.email) authUpdates.email = email;
    if (password) authUpdates.password = password;

    if (Object.keys(authUpdates).length > 0) {
      const { error: authError } = await supabase.auth.updateUser(authUpdates);
      if (authError) throw authError;
    }

    // Update theme cookie to ensure layout reflects change immediately
    if (theme) {
      const cookieStore = await cookies();
      cookieStore.set("theme", theme, { path: "/", maxAge: 31536000 });
    }

    revalidateProfile(user.id);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}

