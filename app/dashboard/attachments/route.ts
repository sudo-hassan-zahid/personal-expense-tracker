import { NextResponse } from "next/server";
import { getAuthenticatedClient } from "@/lib/supabase";

export async function GET(request: Request) {
  const { supabase, user } = await getAuthenticatedClient();
  const url = new URL(request.url);
  const path = url.searchParams.get("path") || "";

  if (!path.startsWith(`${user.id}/`)) {
    return new Response("Not found", { status: 404 });
  }

  const { data, error } = await supabase.storage
    .from("transaction-attachments")
    .createSignedUrl(path, 60);

  if (error || !data?.signedUrl) {
    return new Response("Not found", { status: 404 });
  }

  return NextResponse.redirect(data.signedUrl);
}
