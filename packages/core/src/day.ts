import type { DateKey } from "./dates";
import { findGroup, isIngredient, type Random, roll } from "./generate";
import { type Category, categories, type Generation, type GenerationMode, type GroupPicks } from "./types";

/** Re-rolls allowed per day, on top of the free first generation. */
export const MAX_REROLLS = 2;

/**
 * - `start`: choosing between manual selection and random mode
 * - `manual`: hand-picking ingredients
 * - `review`: a generated task waiting to be accepted
 */
export type DayStep = "start" | "manual" | "review";

/** Today's journey towards a task. Persisted so a reload lands back in the same place. */
export interface DayState {
  date: DateKey;
  step: DayStep;
  mode: GenerationMode | null;
  /** Hand-picked ingredient groups. Re-rolls keep drawing from these. */
  picks: GroupPicks;
  /** The pending task while in `review`. */
  generation: Generation | null;
  /** Categories kept when re-rolling. */
  locked: Category[];
  /** Survives going back to the start or discarding a task, so the limit can't be dodged. */
  rerollsUsed: number;
}

export const startDay = (date: DateKey): DayState => ({
  date,
  step: "start",
  mode: null,
  picks: {},
  generation: null,
  locked: [],
  rerollsUsed: 0,
});

/** Yesterday's unfinished state doesn't carry over. */
export const ensureDay = (state: DayState | null | undefined, today: DateKey): DayState =>
  state?.date === today ? state : startDay(today);

export const beginManual = (state: DayState): DayState => ({ ...state, step: "manual", mode: "manual" });

export const backToStart = (state: DayState): DayState => ({ ...state, step: "start", mode: null, picks: {} });

export function setPick(state: DayState, category: Category, groupLabel: string | null): DayState {
  const picks = { ...state.picks };
  if (groupLabel) picks[category] = groupLabel;
  else delete picks[category];
  return { ...state, picks };
}

/** Manual mode: draw from the hand-picked groups; anything not picked comes from the whole vocabulary. */
export const brew = (state: DayState, random?: Random): DayState => ({
  ...state,
  step: "review",
  mode: "manual",
  generation: roll({ groups: state.picks }, random),
  locked: [],
});

/** Random mode: everything is drawn, nothing is locked. */
export const rollRandom = (state: DayState, random?: Random): DayState => ({
  ...state,
  step: "review",
  mode: "random",
  picks: {},
  generation: roll({}, random),
  locked: [],
});

export const toggleLock = (state: DayState, category: Category): DayState => ({
  ...state,
  locked: state.locked.includes(category)
    ? state.locked.filter((item) => item !== category)
    : categories.filter((item) => item === category || state.locked.includes(item)),
});

export const rerollsLeft = (state: DayState): number => Math.max(0, MAX_REROLLS - state.rerollsUsed);

export const allLocked = (state: DayState): boolean => state.locked.length === categories.length;

export const canReroll = (state: DayState): boolean =>
  state.step === "review" && Boolean(state.generation) && rerollsLeft(state) > 0 && !allLocked(state);

/** Redraw every unlocked ingredient (still within any hand-picked group), spending one re-roll. */
export function reroll(state: DayState, random?: Random): DayState {
  if (!canReroll(state)) return state;
  const keep = Object.fromEntries(state.locked.map((category) => [category, state.generation!.ingredients[category]]));
  return { ...state, generation: roll({ keep, groups: state.picks }, random), rerollsUsed: state.rerollsUsed + 1 };
}

/** After the task is created the flow is done for the day; re-rolls stay spent. */
export const finishDay = (state: DayState): DayState => ({
  ...startDay(state.date),
  rerollsUsed: state.rerollsUsed,
});

/** Rebuild a trustworthy state from storage, dropping anything malformed. */
export function parseDayState(stored: unknown, today: DateKey): DayState {
  const fresh = startDay(today);
  if (!stored || typeof stored !== "object") return fresh;
  const value = stored as Partial<DayState>;
  if (value.date !== today) return fresh;

  const picks: GroupPicks = {};
  for (const category of categories) {
    const label = value.picks?.[category];
    if (findGroup(category, label)) picks[category] = label;
  }
  const generation =
    value.generation && categories.every((category) => isIngredient(category, value.generation!.ingredients?.[category]))
      ? value.generation
      : null;
  const step: DayStep =
    value.step === "review" && generation ? "review" : value.step === "manual" ? "manual" : "start";

  return {
    date: today,
    step,
    mode: step === "start" ? null : value.mode === "random" ? "random" : "manual",
    picks,
    generation: step === "review" ? generation : null,
    locked: categories.filter((category) => value.locked?.includes(category)),
    rerollsUsed: Math.min(MAX_REROLLS, Math.max(0, Math.floor(Number(value.rerollsUsed) || 0))),
  };
}
