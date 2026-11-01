import { canEditTask, type DayState, parseDayState, type Task, toDateKey } from "@creative-diary/core";
import { createSignal } from "solid-js";
import type { DiaryStore } from "./diary-store";

const TASKS_KEY = "creative-diary:tasks";
const DAY_KEY = "creative-diary:day";
const SCHEMA_VERSION = 1;

interface Persisted<T> {
  version: typeof SCHEMA_VERSION;
  data: T;
}

/** Keeps the whole diary, photos included, in this browser's localStorage. */
export function createLocalDiaryStore(storage: Storage = window.localStorage): DiaryStore {
  const read = (key: string): unknown => {
    try {
      const stored = JSON.parse(storage.getItem(key) ?? "null") as Persisted<unknown> | null;
      return stored?.version === SCHEMA_VERSION ? stored.data : null;
    } catch {
      return null;
    }
  };
  const write = (key: string, data: unknown) => {
    const record: Persisted<unknown> = { version: SCHEMA_VERSION, data };
    storage.setItem(key, JSON.stringify(record));
  };

  const readTasks = () => {
    const data = read(TASKS_KEY);
    return Array.isArray(data) ? (data as Task[]) : [];
  };
  const readDay = () => parseDayState(read(DAY_KEY), toDateKey());

  const [tasks, setTasks] = createSignal(readTasks());
  const [day, setDay] = createSignal(readDay());

  const saveTasks = (next: Task[], failure: string) => {
    try {
      write(TASKS_KEY, next);
    } catch {
      throw new Error(failure);
    }
    setTasks(next);
  };

  // Another tab changed the diary.
  window.addEventListener("storage", (event) => {
    if (event.key === TASKS_KEY) setTasks(readTasks());
    if (event.key === DAY_KEY) setDay(readDay());
  });

  return {
    tasks,
    async createTask(input) {
      const task: Task = { ...input, id: crypto.randomUUID(), comment: "", images: [], createdAt: Date.now() };
      saveTasks([...tasks(), task], "This browser's storage is full, so the task couldn't be saved.");
      return task;
    },
    async submitWork(id, submission) {
      const task = tasks().find((item) => item.id === id);
      if (!task) throw new Error("That task no longer exists.");
      if (!canEditTask(task)) throw new Error("This task can no longer be edited: the 24-hour window has closed.");
      const updated: Task = { ...task, ...submission, submittedAt: Date.now() };
      saveTasks(
        tasks().map((item) => (item.id === id ? updated : item)),
        "This browser's storage is full. Try removing a photo.",
      );
    },

    day,
    async saveDay(state: DayState) {
      try {
        write(DAY_KEY, state);
      } catch {
        throw new Error("This browser's storage is full, so today's progress couldn't be saved.");
      }
      setDay(state);
    },
  };
}
