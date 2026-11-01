import type { TaskStatus } from "@creative-diary/core";

export const statusLabels: Record<TaskStatus, string> = {
  "in-progress": "In progress",
  completed: "Completed",
};

export const formatLongDate = (dateKey: string) =>
  new Date(`${dateKey}T12:00:00`).toLocaleDateString("en", { weekday: "long", day: "numeric", month: "long" });

export const pluralise = (count: number, singular: string, plural = `${singular}s`) =>
  `${count} ${count === 1 ? singular : plural}`;
