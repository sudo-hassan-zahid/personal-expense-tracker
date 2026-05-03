/**
 * Utility/Hook: date-utils.ts
 */
import { format } from "date-fns";

export const PKT_OFFSET = 5; // GMT+5

/**
 * Returns the current date/time in PKT (GMT+5)
 */
export function getCurrentPKTDate() {
  // Get current UTC date
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  // Create new Date object for PKT
  return new Date(utc + 3600000 * PKT_OFFSET);
}

/**
 * Formats a date string or Date object to PKT display format
 */
export function formatPKT(date: Date | string, formatStr: string = "yyyy-MM-dd") {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, formatStr);
}

/**
 * Returns today's date string in YYYY-MM-DD format (PKT)
 */
export function getTodayPKT() {
  return format(getCurrentPKTDate(), "yyyy-MM-dd");
}

