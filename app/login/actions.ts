/**
 * Page/Route: actions.ts
 */
"use server";

import { createClient } from "@/lib/supabase";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = (formData.get("email") as string).trim();
  const password = formData.get("password") as string;
  const remember = formData.getAll("remember").includes("on");
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (!remember) {
    const cookieStore = await cookies();
    cookieStore
      .getAll()
      .filter((cookie) => cookie.name.startsWith("sb-"))
      .forEach((cookie) => {
        cookieStore.set(cookie.name, cookie.value, {
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
      });
  }

  redirect("/dashboard");
}
