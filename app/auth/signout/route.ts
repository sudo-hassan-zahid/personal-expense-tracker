import { createClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return NextResponse.redirect(new URL("/?error=Could not sign out", request.url), {
      status: 302,
    });
  }

  return NextResponse.redirect(new URL("/", request.url), {
    status: 302,
  });
}
