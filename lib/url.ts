/**
 * Utility to get the site URL for redirects.
 * Prioritizes NEXT_PUBLIC_SITE_URL, then VERCEL_URL, then localhost.
 */
export function getSiteUrl() {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : "") ||
    "http://localhost:3000";
  
  // Remove trailing slash if present
  return url.replace(/\/$/, "");
}
