/**
 * Component: TopNav.tsx
 */
import { createClient } from "@/lib/supabase";
import { cookies } from "next/headers";
import { TopNavClient } from "./TopNavClient";

function hasSupabaseAuthCookie(allCookies: { name: string }[]) {
  return allCookies.some((cookie) => cookie.name.startsWith("sb-"));
}

export async function TopNav({ activeTheme }: { activeTheme: "light" | "dark" }) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  if (!hasSupabaseAuthCookie(allCookies)) {
    return <TopNavClient user={null} activeTheme={activeTheme} />;
  }

  const supabase = await createClient(allCookies);
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  return <TopNavClient user={user} activeTheme={activeTheme} />;
}

