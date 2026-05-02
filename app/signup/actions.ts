"use server";

import { createClient } from "@/lib/supabase";
import { redirect } from "next/navigation";

export async function signup(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // If email confirmation is required, the user identity won't be confirmed yet
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    redirect(`/signup?error=${encodeURIComponent("An account with this email already exists.")}`);
  }

  // If the user session exists immediately, email confirmation is disabled — go to dashboard
  if (data.session) {
    redirect("/dashboard");
  }

  // Otherwise, email confirmation is enabled — show success page
  redirect("/signup/success");
}
