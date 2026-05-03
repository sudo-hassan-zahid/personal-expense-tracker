/**
 * Utility/Hook: supabase.ts
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type Cookie = {
  name: string;
  value: string;
};

type CookieStoreLike = {
  getAll(): Cookie[];
  set?: (name: string, value: string, options?: Record<string, unknown>) => void;
};

function isCookieStoreLike(value: unknown): value is CookieStoreLike {
  return typeof value === "object" && value !== null && "getAll" in value;
}

export async function createClient(cookieStore?: unknown) {
  const effectiveCookies = cookieStore || (await cookies());

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return isCookieStoreLike(effectiveCookies)
            ? effectiveCookies.getAll()
            : (effectiveCookies as Cookie[]);
        },
        setAll(cookiesToSet) {
          if (isCookieStoreLike(effectiveCookies) && typeof effectiveCookies.set === "function") {
            try {
              const setCookie = effectiveCookies.set;
              cookiesToSet.forEach(({ name, value, options }) =>
                setCookie(name, value, options)
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

