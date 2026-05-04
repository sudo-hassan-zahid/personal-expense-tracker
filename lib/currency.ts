/**
 * Utility/Hook: currency.ts
 */
/**
 * Custom display symbols for currencies where Intl.NumberFormat
 * doesn't output the commonly used symbol.
 * e.g., PKR outputs "PKR 15,000.00" but we want "Rs. 15,000.00"
 */
const CURRENCY_SYMBOL_OVERRIDES: Record<string, string> = {
  PKR: "Rs.",
  INR: "₹",
  BDT: "৳",
  SAR: "SR",
};

const formatterCache = new Map<string, Intl.NumberFormat>();

/**
 * Format a number as currency using the Intl.NumberFormat API,
 * with custom symbol overrides for currencies like PKR → Rs.
 */
export function formatCurrency(amount: number, currencyCode: string = "USD"): string {
  const zeroDecimalCurrencies = ["PKR", "INR", "JPY", "KRW", "VND", "BDT"];
  const isZeroDecimal = zeroDecimalCurrencies.includes(currencyCode);
  const cacheKey = `${currencyCode}-${isZeroDecimal}`;

  let formatter = formatterCache.get(cacheKey);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: isZeroDecimal ? 0 : 2,
      maximumFractionDigits: isZeroDecimal ? 0 : 2,
    });
    formatterCache.set(cacheKey, formatter);
  }

  const formatted = formatter.format(amount);

  const override = CURRENCY_SYMBOL_OVERRIDES[currencyCode];
  if (override) {
    return formatted.replace(/^[^\d\-−]*/, `${override} `);
  }

  return formatted;
}

/**
 * Common currencies for the currency selector.
 */
export const SUPPORTED_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "Rs." },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
] as const;
