/**
 * TODAY'S GOLD RATE
 * -----------------
 * Update these values each day. Prices are in Indian Rupees per 10 grams.
 *
 *   export const goldRate: GoldRate = {
 *     date: "2026-09-26",   // ISO date (YYYY-MM-DD)
 *     gold24k: 0,           // ₹ per 10 g — enter the real rate
 *     gold22k: 0,           // ₹ per 10 g — enter the real rate
 *   };
 *
 * While any value is `null`, the site shows a "call for today's rate"
 * message instead of a price. Never publish an estimated rate.
 */

export interface GoldRate {
  date: string | null;
  gold24k: number | null;
  gold22k: number | null;
}

export const goldRate: GoldRate = {
  date: null,
  gold24k: null,
  gold22k: null,
};

export function hasPublishedGoldRate(rate: GoldRate): rate is { date: string; gold24k: number; gold22k: number } {
  return rate.date !== null && rate.gold24k !== null && rate.gold22k !== null;
}

export function formatRupees(value: number): string {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
}

export function formatRateDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${isoDate}T00:00:00`),
  );
}
