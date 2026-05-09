import { revalidateTag, revalidatePath } from "next/cache";

function revalidateUserTag(prefix: string, userId?: string) {
  if (userId) {
    revalidateTag(`${prefix}-${userId}`, { expire: 0 });
  } else {
    revalidateTag(prefix, { expire: 0 });
  }
}

/**
 * Cache invalidation helpers scoped by data domain.
 * Keeping these narrow avoids purging layouts and unrelated pages after every mutation.
 */
export function revalidateTransactions(userId?: string) {
  revalidateUserTag("transactions", userId);
  revalidatePath("/dashboard", "page");
}

export function revalidateCategories(userId?: string) {
  revalidateUserTag("categories", userId);
  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard/categories", "page");
}

export function revalidateProfile(userId?: string) {
  revalidateUserTag("profile", userId);

  revalidatePath("/", "layout");
  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard/profile", "page");
  revalidatePath("/dashboard/profile", "layout");
}

export function revalidateAll(userId?: string) {
  revalidateTransactions(userId);
  revalidateCategories(userId);
  revalidateProfile(userId);
}

export function revalidatePlanning(userId?: string) {
  revalidateUserTag("planning", userId);
  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard/planning", "page");
}
