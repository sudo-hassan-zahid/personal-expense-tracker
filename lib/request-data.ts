import { cache } from "react";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase";

type Cookie = {
  name: string;
  value: string;
};

export type RequestProfile = {
  id: string;
  theme: string | null;
  show_cursor_trail: boolean | null;
  currency: string | null;
  pagination_enabled: boolean | null;
  enable_status_tracking: boolean | null;
  name: string | null;
} | null;

function hasSupabaseAuthCookie(allCookies: { name: string }[]) {
  return allCookies.some((cookie) => cookie.name.startsWith("sb-"));
}

export const getRequestAuth = cache(async () => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll() as Cookie[];

  if (!hasSupabaseAuthCookie(allCookies)) {
    return { allCookies, user: null };
  }

  const supabase = await createClient(allCookies);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { allCookies, user };
});

export const getRequestProfile = cache(async (): Promise<RequestProfile> => {
  const { allCookies, user } = await getRequestAuth();
  if (!user) return null;

  const supabase = await createClient(allCookies);
  const { data, error } = await supabase
    .from("profiles")
    .select("id, theme, show_cursor_trail, currency, pagination_enabled, enable_status_tracking, name")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
});
