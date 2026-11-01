import {
  type ByCategory,
  type Category,
  categories,
  type Generation,
  type GroupPicks,
  type Ingredient,
  type IngredientGroup,
} from "./types";
import { vocabulary } from "./vocabulary";

export type Random = () => number;

const pick = <T>(items: readonly T[], random: Random): T => items[Math.floor(random() * items.length)]!;

const capitalise = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const findGroup = (category: Category, label: string | null | undefined): IngredientGroup | undefined =>
  vocabulary[category].find((group) => group.label === label);

/** True when the ingredient really exists in the vocabulary for this category. */
export const isIngredient = (category: Category, ingredient: unknown): ingredient is Ingredient => {
  if (!ingredient || typeof ingredient !== "object") return false;
  const { group, value } = ingredient as Partial<Ingredient>;
  return Boolean(findGroup(category, group)?.options.includes(value!));
};

/** Draw a word from the given group, or from any group when none is given. */
export function drawIngredient(category: Category, groupLabel?: string, random: Random = Math.random): Ingredient {
  const group = findGroup(category, groupLabel) ?? pick(vocabulary[category], random);
  return { group: group.label, value: pick(group.options, random) };
}

export function makePrompt(ingredients: ByCategory<Ingredient>, random: Random = Math.random): string {
  const context = ingredients.context.value.toLocaleLowerCase();
  const material = ingredients.material.value.toLocaleLowerCase();
  const process = ingredients.process.value.toLocaleLowerCase();
  const colour = ingredients.colour.value.toLocaleLowerCase();
  const templates = [
    `${capitalise(context)} — ${process} ${material} in ${colour}.`,
    `Let ${material} carry ${context}; ${process} it in ${colour}.`,
    `A study of ${context}: ${process} ${material} with ${colour}.`,
  ];
  return pick(templates, random);
}

interface RollOptions {
  /** Ingredients to keep exactly as they are. */
  keep?: Partial<ByCategory<Ingredient>>;
  /** Groups to draw from for categories that aren't kept. */
  groups?: GroupPicks;
}

export function roll({ keep = {}, groups = {} }: RollOptions = {}, random: Random = Math.random): Generation {
  const ingredients = Object.fromEntries(
    categories.map((category) => [category, keep[category] ?? drawIngredient(category, groups[category], random)]),
  ) as ByCategory<Ingredient>;
  return { ingredients, prompt: makePrompt(ingredients, random) };
}
