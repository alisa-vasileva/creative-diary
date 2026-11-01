import { describe, expect, it } from "vitest";
import {
  backToStart,
  beginManual,
  brew,
  canReroll,
  ensureDay,
  finishDay,
  MAX_REROLLS,
  parseDayState,
  reroll,
  rerollsLeft,
  rollRandom,
  setPick,
  startDay,
  toggleLock,
} from "./day";
import { categories } from "./types";

const today = "2026-10-24";

describe("manual selection", () => {
  it("starts with nothing picked", () => {
    expect(beginManual(startDay(today)).picks).toEqual({});
  });

  it("draws from the picked groups and leaves the rest to chance", () => {
    let state = beginManual(startDay(today));
    state = setPick(state, "material", "Metal");
    state = setPick(state, "colour", "Atmospheric");
    state = brew(state);
    expect(state.step).toBe("review");
    expect(state.mode).toBe("manual");
    expect(state.locked).toEqual([]);
    expect(state.generation!.ingredients.material.group).toBe("Metal");
    expect(state.generation!.ingredients.colour.group).toBe("Atmospheric");
  });

  it("can clear a pick", () => {
    expect(setPick(setPick(startDay(today), "material", "Metal"), "material", null).picks).toEqual({});
  });

  it("keeps re-rolls within the picked groups", () => {
    let state = brew(setPick(beginManual(startDay(today)), "material", "Metal"));
    for (let run = 0; run < MAX_REROLLS; run += 1) {
      state = reroll(state);
      expect(state.generation!.ingredients.material.group).toBe("Metal");
    }
  });
});

describe("re-rolling", () => {
  it("redraws unlocked ingredients and keeps locked ones", () => {
    let state = rollRandom(startDay(today));
    const kept = state.generation!.ingredients.process;
    state = toggleLock(state, "process");
    for (let run = 0; run < MAX_REROLLS; run += 1) state = reroll(state);
    expect(state.generation!.ingredients.process).toEqual(kept);
    expect(rerollsLeft(state)).toBe(0);
  });

  it(`stops after ${MAX_REROLLS} re-rolls`, () => {
    let state = rollRandom(startDay(today));
    for (let run = 0; run < MAX_REROLLS; run += 1) state = reroll(state);
    expect(canReroll(state)).toBe(false);
    expect(reroll(state)).toBe(state);
  });

  it("can't re-roll when everything is locked", () => {
    let state = rollRandom(startDay(today));
    for (const category of categories) state = toggleLock(state, category);
    expect(canReroll(state)).toBe(false);
  });

  it("keeps spent re-rolls when going back or finishing", () => {
    const state = reroll(rollRandom(startDay(today)));
    expect(backToStart(state).rerollsUsed).toBe(1);
    expect(finishDay(state)).toEqual({ ...startDay(today), rerollsUsed: 1 });
  });

  it("toggles locks in category order", () => {
    const state = toggleLock(toggleLock(rollRandom(startDay(today)), "colour"), "context");
    expect(state.locked).toEqual(["context", "colour"]);
    expect(toggleLock(state, "colour").locked).toEqual(["context"]);
  });
});

describe("persistence", () => {
  it("starts a fresh day when the date changes", () => {
    const yesterday = reroll(rollRandom(startDay("2026-10-23")));
    expect(ensureDay(yesterday, today)).toEqual(startDay(today));
    expect(parseDayState(yesterday, today)).toEqual(startDay(today));
  });

  it("round-trips a pending review", () => {
    const state = toggleLock(reroll(brew(setPick(beginManual(startDay(today)), "material", "Metal"))), "material");
    expect(parseDayState(JSON.parse(JSON.stringify(state)), today)).toEqual(state);
  });

  it("drops malformed data", () => {
    expect(parseDayState({ date: today, step: "review", generation: null }, today).step).toBe("start");
    expect(parseDayState({ date: today, step: "manual", picks: { material: "Not a group" } }, today).picks).toEqual({});
    expect(parseDayState({ date: today, rerollsUsed: 99 }, today).rerollsUsed).toBe(MAX_REROLLS);
    expect(parseDayState("nonsense", today)).toEqual(startDay(today));
  });
});
