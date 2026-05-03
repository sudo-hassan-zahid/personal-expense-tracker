import { revalidateTag, revalidatePath } from "next/cache";

/**
 * Cache invalidation helpers scoped by data domain.
 * Keeping these narrow avoids purging layouts and unrelated pages after every mutation.
 */
export function revalidateTransactions() {
  revalidateTag("transactions", { expire: 0 });
  revalidatePath("/dashboard", "page");
}

export function revalidateCategories() {
  revalidateTag("categories", { expire: 0 });
  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard/categories", "page");
}

export function revalidateProfile(userId?: string) {
  revalidateTag("profile", { expire: 0 });
  if (userId) {
    revalidateTag(`profile-${userId}`, { expire: 0 });
    revalidateTag(userId, { expire: 0 });
  }

  revalidatePath("/", "layout");
  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard/profile", "page");
  revalidatePath("/dashboard/profile", "layout");
}

export function revalidateAll() {
  revalidateTransactions();
  revalidateCategories();
  revalidateProfile();
}

export function revalidatePlanning() {
  revalidateTag("planning", { expire: 0 });
  revalidatePath("/dashboard", "page");
  revalidatePath("/dashboard/planning", "page");
}
