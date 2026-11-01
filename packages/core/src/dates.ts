/** A local calendar day formatted as `YYYY-MM-DD`. */
export type DateKey = string;

const DAY_MS = 86_400_000;

export const toDateKey = (date: Date = new Date()): DateKey =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const parseDateKey = (key: DateKey): Date => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year!, month! - 1, day);
};

/** Whole days from `from` to `to`; DST-safe because both are local midnights. */
export const daysBetween = (from: DateKey, to: DateKey): number =>
  Math.round((parseDateKey(to).getTime() - parseDateKey(from).getTime()) / DAY_MS);

export const startOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);

export const addMonths = (date: Date, months: number): Date =>
  new Date(date.getFullYear(), date.getMonth() + months, 1);
