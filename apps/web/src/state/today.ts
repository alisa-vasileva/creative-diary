import {
  backToStart,
  beginManual,
  brew,
  type Category,
  type DayState,
  ensureDay,
  finishDay,
  reroll,
  rollRandom,
  setPick,
  toDateKey,
  toggleLock,
} from "@creative-diary/core";
import { createMemo, createSignal, onCleanup } from "solid-js";
import type { DiaryStore } from "~/data/diary-store";

/**
 * Today's journey: start → (manual picks) → review with locks and re-rolls → task.
 * Every step is saved through the store, so a reload resumes where the user was.
 */
export function createToday(store: DiaryStore, onError: (message: string) => void) {
  // Notice midnight while the page stays open.
  const [date, setDate] = createSignal(toDateKey());
  const timer = window.setInterval(() => setDate(toDateKey()), 60_000);
  onCleanup(() => window.clearInterval(timer));

  const state = createMemo(() => ensureDay(store.day(), date()));
  const task = createMemo(() => store.tasks().findLast((item) => item.date === date()));
  /** The cauldron animation after brewing; deliberately not persisted. */
  const [mixing, setMixing] = createSignal(false);

  const report = (error: unknown) => onError(error instanceof Error ? error.message : "Something went wrong.");
  const update = (transition: (current: DayState) => DayState) =>
    store.saveDay(transition(state())).catch(report);

  return {
    date,
    state,
    task,
    mixing,
    finishMixing: () => setMixing(false),

    beginManual: () => update(beginManual),
    backToStart: () => update(backToStart),
    setPick: (category: Category, groupLabel: string | null) =>
      update((current) => setPick(current, category, groupLabel)),
    brew: () => update(brew).then(() => setMixing(true)),
    rollRandom: () => update(rollRandom).then(() => setMixing(true)),
    toggleLock: (category: Category) => update((current) => toggleLock(current, category)),
    reroll: () => update(reroll),

    /** Turn the pending generation into today's task. */
    async accept() {
      const { generation, mode } = state();
      if (!generation || !mode) return;
      try {
        await store.createTask({ ...generation, mode, date: date() });
        await store.saveDay(finishDay(state()));
      } catch (error) {
        report(error);
      }
    },
  };
}

export type Today = ReturnType<typeof createToday>;
