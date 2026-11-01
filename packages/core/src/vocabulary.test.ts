import { describe, expect, it } from "vitest";
import { categories } from "./types";
import { vocabulary } from "./vocabulary";

describe("vocabulary", () => {
  it.each(categories)("%s has uniquely named, non-empty groups", (category) => {
    const labels = vocabulary[category].map((group) => group.label);
    expect(new Set(labels).size).toBe(labels.length);
    for (const group of vocabulary[category]) expect(group.options.length).toBeGreaterThan(0);
  });
});
