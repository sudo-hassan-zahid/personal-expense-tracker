import { revalidateTag, revalidatePath } from "next/cache";

/**
 * Utility to perform a full revalidation of all transaction and profile related data.
 * This ensures consistency across the dashboard, charts, and transaction lists.
 */
export function revalidateAll() {
  // Purge data cache tags
  revalidateTag("transactions", { expire: 0 });
  revalidateTag("profile", { expire: 0 });
  revalidateTag("categories", { expire: 0 });
  
  // Purge router cache for the entire dashboard layout
  revalidatePath("/", "layout");
}
