import { describe, expect, it } from "vitest";
import { canEditTask, EDIT_WINDOW_MS, hasSubmission, taskStatus } from "./task";
import type { Task } from "./types";

const task = (overrides: Partial<Task> = {}): Task => ({
  id: "t",
  date: "2026-10-24",
  mode: "random",
  prompt: "",
  ingredients: {
    context: { group: "a", value: "a" },
    material: { group: "a", value: "a" },
    process: { group: "a", value: "a" },
    colour: { group: "a", value: "a" },
  },
  createdAt: 1_000,
  comment: "",
  images: [],
  ...overrides,
});

describe("submissions", () => {
  it("needs a photo, a comment, or both", () => {
    expect(hasSubmission({ comment: "  ", images: [] })).toBe(false);
    expect(hasSubmission({ comment: "done", images: [] })).toBe(true);
    expect(hasSubmission({ comment: "", images: [{ id: "i", name: "p", src: "" }] })).toBe(true);
  });

  it("marks a task completed once something is submitted", () => {
    expect(taskStatus(task())).toBe("in-progress");
    expect(taskStatus(task({ comment: "done" }))).toBe("completed");
  });

  it("can be edited for 24 hours after creation", () => {
    expect(canEditTask(task(), 1_000 + EDIT_WINDOW_MS - 1)).toBe(true);
    expect(canEditTask(task(), 1_000 + EDIT_WINDOW_MS)).toBe(false);
  });
});
