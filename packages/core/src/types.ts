export const categories = ["context", "material", "process", "colour"] as const;

export type Category = (typeof categories)[number];

export type ByCategory<T> = Record<Category, T>;

export interface IngredientGroup {
  label: string;
  options: string[];
}

/** One concrete ingredient and the group it was drawn from. */
export interface Ingredient {
  group: string;
  value: string;
}

/** Ingredient groups the user chose by hand (group labels); the exact word is left to chance. */
export type GroupPicks = Partial<ByCategory<string>>;

/** How the day's task was started. */
export type GenerationMode = "manual" | "random";

export interface Generation {
  ingredients: ByCategory<Ingredient>;
  prompt: string;
}

export const taskStatuses = ["in-progress", "completed"] as const;

export type TaskStatus = (typeof taskStatuses)[number];

export interface TaskImage {
  id: string;
  name: string;
  /** A data URL today; a storage URL once images live in a backend. */
  src: string;
}

/** The user's response to a task: a photo, a comment, or both. */
export interface Submission {
  comment: string;
  images: TaskImage[];
}

/** Everything needed to create a task. */
export interface NewTask extends Generation {
  /** Local calendar day, `YYYY-MM-DD`. */
  date: string;
  mode: GenerationMode;
}

export interface Task extends NewTask, Submission {
  id: string;
  /** Epoch milliseconds. Starts the editing window. */
  createdAt: number;
  /** Epoch milliseconds of the latest submission. */
  submittedAt?: number;
}
