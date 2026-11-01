import type { DayState, NewTask, Submission, Task } from "@creative-diary/core";
import { type Accessor, createContext, useContext } from "solid-js";

/**
 * Where the diary lives. The UI only talks to this interface, so swapping
 * localStorage for a backend (e.g. Convex queries + mutations) means writing a
 * new implementation and passing it to `DiaryStoreProvider` in `main.tsx`.
 *
 * Methods reject with a user-facing message when a change can't be saved.
 */
export interface DiaryStore {
  /** Reactive list of tasks, oldest first. */
  tasks: Accessor<Task[]>;
  createTask(input: NewTask): Promise<Task>;
  /** Save a photo and/or comment. Rejects once the task's editing window has closed. */
  submitWork(id: string, submission: Submission): Promise<void>;

  /**
   * Today's unfinished journey (picks, the pending task, re-rolls spent), so a reload
   * lands in the same place. A backend should own this too, to enforce the re-roll limit.
   */
  day: Accessor<DayState>;
  saveDay(state: DayState): Promise<void>;
}

const DiaryStoreContext = createContext<DiaryStore>();

export const DiaryStoreProvider = DiaryStoreContext.Provider;

export function useDiaryStore(): DiaryStore {
  const store = useContext(DiaryStoreContext);
  if (!store) throw new Error("useDiaryStore must be used inside <DiaryStoreProvider>");
  return store;
}
