/**
 * Page/Route: route.ts
 */
import { createClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

/**
 * Auth callback handler for Supabase email confirmation, password reset, etc.
 * Supabase redirects here with a `code` query param after the user clicks
 * the confirmation link in their email. We exchange the code for a session.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If code exchange fails, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=Could not verify email`);
}
