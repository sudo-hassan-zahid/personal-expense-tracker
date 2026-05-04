/**
 * Page/Route: actions.ts
 */
"use server";

import { createClient } from "@/lib/supabase";
import { getSiteUrl } from "@/lib/url";
import { redirect } from "next/navigation";

export async function sendPasswordReset(formData: FormData) {
  const email = (formData.get("email") as string).trim();
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/reset-password`,
  });

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    `/login?message=${encodeURIComponent("Password reset email sent. Check your inbox.")}`
  );
}
