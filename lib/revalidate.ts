import { revalidateTag, revalidatePath } from "next/cache";

/**
 * Utility to perform a full revalidation of all transaction and profile related data.
 * This ensures consistency across the dashboard, charts, and transaction lists.
 */
export function revalidateAll() {
  // Purge data cache tags - standard Next.js 15+ API (with mandatory options in this env)
  revalidateTag("transactions", { expire: 0 });
  revalidateTag("profile", { expire: 0 });
  revalidateTag("categories", { expire: 0 });

  // Purge router cache for the entire application aggressively
  revalidatePath("/", "layout");
  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/dashboard/profile", "page");
  revalidatePath("/dashboard/profile", "layout");
}
