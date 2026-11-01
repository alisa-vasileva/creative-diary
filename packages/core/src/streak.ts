import { type DateKey, daysBetween, toDateKey } from "./dates";

/**
 * Consecutive days with at least one entry, ending today or yesterday.
 * A streak survives until a full day passes without an entry.
 */
export function calculateStreak(dates: Iterable<DateKey>, today: DateKey = toDateKey()): number {
  const days = [...new Set(dates)].sort().reverse();
  if (!days.length || daysBetween(days[0]!, today) > 1) return 0;

  let count = 1;
  for (let index = 1; index < days.length; index += 1) {
    if (daysBetween(days[index]!, days[index - 1]!) !== 1) break;
    count += 1;
  }
  return count;
}
