/**
 * Utility/Hook: supabase.ts
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient(cookieStore?: unknown) {
  const effectiveCookies = (cookieStore as any) || (await cookies());

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return typeof effectiveCookies.getAll === "function"
            ? effectiveCookies.getAll()
            : effectiveCookies;
        },
        setAll(cookiesToSet) {
          if (typeof effectiveCookies.set === "function") {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                effectiveCookies.set(name, value, options)
              );
            } catch {
              // Ignore set errors in server components
            }
          }
        },
      },
    }
  );
}

/**
 * Returns an authenticated Supabase client and the current user in a single call.
 * Avoids the pattern of creating a client + calling getUser() separately in every action.
 * Throws if no user is authenticated.
 */
export async function getAuthenticatedClient() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error("Unauthorized");
  }
  return { supabase, user };
}

