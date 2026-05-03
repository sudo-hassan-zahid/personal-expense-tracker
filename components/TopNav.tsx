import { createClient } from "@/lib/supabase";
import { TopNavClient } from "./TopNavClient";

export async function TopNav({ activeTheme }: { activeTheme: "light" | "dark" }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  return <TopNavClient user={user} activeTheme={activeTheme} />;
}
