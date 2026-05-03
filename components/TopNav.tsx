import { TopNavClient } from "./TopNavClient";
import { getRequestAuth } from "@/lib/request-data";

export async function TopNav({ activeTheme }: { activeTheme: "light" | "dark" }) {
  const { user } = await getRequestAuth();

  return <TopNavClient user={user} activeTheme={activeTheme} />;
}

