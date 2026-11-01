import { categories, editableUntil, hasSubmission, type Submission, type Task, taskStatus } from "@creative-diary/core";
import { ArrowRight, Pencil } from "lucide-solid";
import { createSignal, For, Show } from "solid-js";
import { css, cx } from "styled-system/css";
import { glass } from "styled-system/recipes";
import { IngredientCard } from "~/components/IngredientCard";
import { StatusPill } from "~/components/StatusPill";
import { formatLongDate } from "~/lib/format";
import { Button } from "~/ui/Button";
import { Eyebrow } from "~/ui/Eyebrow";
import { SubmissionDialog } from "./SubmissionDialog";

interface TaskViewProps {
  task: Task;
  /** Still inside the 24-hour editing window. */
  editable: boolean;
  onSubmit: (submission: Submission) => Promise<void>;
}

const formatTime = (date: Date) =>
  date.toLocaleString("en", { weekday: "short", hour: "numeric", minute: "2-digit" });

/** A task and the work submitted for it. */
export function TaskView(props: TaskViewProps) {
  const [open, setOpen] = createSignal(false);
  const submitted = () => hasSubmission(props.task);

  return (
    <section class={cx(glass({ density: "dense" }), css({ display: "grid", gap: "20px", padding: { base: "22px 18px", md: "30px" } }))}>
      <div>
        <div class={css({ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "8px" })}>
          <Eyebrow>{formatLongDate(props.task.date)}</Eyebrow>
          <StatusPill status={taskStatus(props.task)} />
        </div>
        <h1 class={css({ marginTop: "8px", textStyle: "hand", fontSize: "clamp(2rem, 4.4vw, 3.6rem)", fontWeight: 700, lineHeight: 0.92 })}>
          {props.task.prompt}
        </h1>
      </div>

      <div class={css({ display: "grid", gridTemplateColumns: { base: "1fr 1fr", lg: "repeat(4, minmax(0, 1fr))" }, gap: "8px" })}>
        <For each={categories}>{(category) => <IngredientCard category={category} ingredient={props.task.ingredients[category]} />}</For>
      </div>

      <Show when={submitted()}>
        <div class={css({ display: "grid", gap: "10px", paddingTop: "16px", borderTop: "1px solid rgba(23, 24, 18, 0.12)" })}>
          <span class={css({ textStyle: "label" })}>your work</span>
          <Show when={props.task.images.length}>
            <div class={css({ display: "grid", gridTemplateColumns: { base: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: "8px" })}>
              <For each={props.task.images}>
                {(image) => (
                  <img src={image.src} alt={image.name} class={css({ width: "100%", aspectRatio: "1", borderRadius: "md", objectFit: "cover" })} />
                )}
              </For>
            </div>
          </Show>
          <Show when={props.task.comment}>
            <p class={css({ maxWidth: "620px", fontSize: "0.8rem", lineHeight: 1.6, whiteSpace: "pre-wrap" })}>{props.task.comment}</p>
          </Show>
        </div>
      </Show>

      <div
        class={css({
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          paddingTop: "16px",
          borderTop: "1px solid rgba(23, 24, 18, 0.12)",
        })}
      >
        <p class={css({ flex: "1 1 220px", color: "inkSoft", fontSize: "0.66rem", lineHeight: 1.5 })}>
          <Show
            when={props.editable}
            fallback={submitted() ? "The editing window for this task has closed." : "This task wasn't completed."}
          >
            You can {submitted() ? "edit your work" : "submit a photo or comment"} until {formatTime(editableUntil(props.task))}.
          </Show>
        </p>
        <Show when={props.editable}>
          <Show
            when={submitted()}
            fallback={
              <Button variant="primary" onClick={() => setOpen(true)}>
                continue working on this task <ArrowRight size={15} />
              </Button>
            }
          >
            <Button onClick={() => setOpen(true)}>
              <Pencil size={14} /> edit your work
            </Button>
          </Show>
        </Show>
      </div>

      <SubmissionDialog task={props.task} open={open()} onClose={() => setOpen(false)} onSubmit={props.onSubmit} />
    </section>
  );
}
