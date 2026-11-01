import { describe, expect, it } from "vitest";
import { drawIngredient, isIngredient, roll } from "./generate";
import { categories } from "./types";

const first = () => 0;

describe("roll", () => {
  it("draws every category from the vocabulary", () => {
    for (let run = 0; run < 25; run += 1) {
      const { ingredients } = roll();
      for (const category of categories) expect(isIngredient(category, ingredients[category])).toBe(true);
    }
  });

  it("keeps kept ingredients", () => {
    const keep = { colour: { group: "Atmospheric", value: "Fog lilac" } };
    for (let run = 0; run < 10; run += 1) expect(roll({ keep }).ingredients.colour).toEqual(keep.colour);
  });

  it("draws from the chosen group", () => {
    for (let run = 0; run < 25; run += 1) {
      expect(roll({ groups: { material: "Metal" } }).ingredients.material.group).toBe("Metal");
      expect(drawIngredient("material", "Metal").group).toBe("Metal");
    }
  });

  it("weaves the ingredients into the prompt", () => {
    const result = roll({}, first);
    expect(result.ingredients.material).toEqual({ group: "Air", value: "Oxygen" });
    expect(result.prompt).toBe("Attachment — slice oxygen in acid yellow.");
  });
});

describe("isIngredient", () => {
  it("rejects values from the wrong group or category", () => {
    expect(isIngredient("material", { group: "Metal", value: "copper" })).toBe(true);
    expect(isIngredient("material", { group: "Metal", value: "Fog lilac" })).toBe(false);
    expect(isIngredient("colour", { group: "Metal", value: "copper" })).toBe(false);
    expect(isIngredient("colour", null)).toBe(false);
  });
});
