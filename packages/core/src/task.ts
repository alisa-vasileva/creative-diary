import type { Submission, Task, TaskStatus } from "./types";

/** Submissions can be changed for this long after the task was created. */
export const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000;

/** A submission counts once it has a photo, a comment, or both. */
export const hasSubmission = (submission: Submission): boolean =>
  submission.comment.trim().length > 0 || submission.images.length > 0;

export const taskStatus = (task: Task): TaskStatus => (hasSubmission(task) ? "completed" : "in-progress");

export const canEditTask = (task: Task, now: number = Date.now()): boolean => now - task.createdAt < EDIT_WINDOW_MS;

export const editableUntil = (task: Task): Date => new Date(task.createdAt + EDIT_WINDOW_MS);
