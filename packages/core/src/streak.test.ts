import { describe, expect, it } from "vitest";
import { calculateStreak } from "./streak";

describe("calculateStreak", () => {
  it("is zero with no entries", () => {
    expect(calculateStreak([], "2026-10-23")).toBe(0);
  });

  it("counts consecutive days ending today", () => {
    expect(calculateStreak(["2026-10-21", "2026-10-22", "2026-10-23"], "2026-10-23")).toBe(3);
  });

  it("survives until a full day is missed", () => {
    expect(calculateStreak(["2026-10-21", "2026-10-22"], "2026-10-23")).toBe(2);
    expect(calculateStreak(["2026-10-21", "2026-10-22"], "2026-10-24")).toBe(0);
  });

  it("ignores duplicate days and stops at the first gap", () => {
    expect(calculateStreak(["2026-10-23", "2026-10-23", "2026-10-22", "2026-10-19"], "2026-10-23")).toBe(2);
  });

  it("crosses month boundaries and DST changes", () => {
    expect(calculateStreak(["2026-10-24", "2026-10-25", "2026-10-26"], "2026-10-26")).toBe(3);
    expect(calculateStreak(["2026-02-28", "2026-03-01"], "2026-03-01")).toBe(2);
  });
});
