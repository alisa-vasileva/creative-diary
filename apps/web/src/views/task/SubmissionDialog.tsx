import { hasSubmission, type Submission, type Task, type TaskImage, taskStatus } from "@creative-diary/core";
import { Camera, Check, X } from "lucide-solid";
import { createEffect, createSignal, For, on, Show } from "solid-js";
import { css, cx } from "styled-system/css";
import { glass } from "styled-system/recipes";
import { StatusPill } from "~/components/StatusPill";
import { formatLongDate } from "~/lib/format";
import { readImageFile } from "~/lib/images";
import { Button } from "~/ui/Button";
import { Eyebrow } from "~/ui/Eyebrow";

const MAX_IMAGES = 4;

interface SubmissionDialogProps {
  task: Task;
  open: boolean;
  onClose: () => void;
  /** Rejects with a user-facing message if the work couldn't be saved. */
  onSubmit: (submission: Submission) => Promise<void>;
}

/** The task pop-up: add a photo and/or a comment. Either one completes the task. */
export function SubmissionDialog(props: SubmissionDialogProps) {
  let dialog!: HTMLDialogElement;
  let fileInput!: HTMLInputElement;
  const [comment, setComment] = createSignal("");
  const [images, setImages] = createSignal<TaskImage[]>([]);
  const [error, setError] = createSignal("");
  const [saving, setSaving] = createSignal(false);

  // Start each opening from the saved submission.
  createEffect(
    on(
      () => props.open,
      (open) => {
        if (open) {
          setComment(props.task.comment);
          setImages(props.task.images);
          setError("");
          if (!dialog.open) dialog.showModal();
        } else if (dialog.open) {
          dialog.close();
        }
      },
    ),
  );

  const draft = (): Submission => ({ comment: comment().trim(), images: images() });

  const addImages = async (files: FileList | null) => {
    setError("");
    const picked = [...(files ?? [])].slice(0, Math.max(0, MAX_IMAGES - images().length));
    try {
      const loaded = await Promise.all(picked.map(readImageFile));
      setImages((current) => [...current, ...loaded].slice(0, MAX_IMAGES));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "That image couldn't be read.");
    } finally {
      fileInput.value = "";
    }
  };

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    if (!hasSubmission(draft())) return;
    setError("");
    setSaving(true);
    try {
      await props.onSubmit(draft());
      props.onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Your work couldn't be saved.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <dialog
      ref={dialog}
      aria-labelledby="submission-title"
      onClose={() => props.onClose()}
      // A click on the backdrop lands on the dialog element itself.
      onClick={(event) => event.target === dialog && dialog.close()}
      class={cx(
        glass({ density: "dense" }),
        css({
          width: "min(100% - 32px, 560px)",
          maxHeight: "calc(100svh - 32px)",
          margin: "auto",
          padding: 0,
          overflow: "auto",
          color: "ink",
          _backdrop: { background: "rgba(23, 24, 18, 0.38)", backdropFilter: "blur(3px)" },
        }),
      )}
    >
      <form onSubmit={submit} class={css({ display: "grid", gap: "16px", padding: { base: "20px 18px", sm: "26px" } })}>
        <div class={css({ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" })}>
          <div>
            <Eyebrow>{formatLongDate(props.task.date)}</Eyebrow>
            <h2 id="submission-title" class={css({ marginTop: "4px", textStyle: "hand", fontSize: "2rem", fontWeight: 700, lineHeight: 0.95 })}>
              your work
            </h2>
          </div>
          <div class={css({ display: "flex", alignItems: "center", gap: "8px" })}>
            <StatusPill status={taskStatus(props.task)} />
            <button
              type="button"
              aria-label="Close"
              onClick={() => dialog.close()}
              class={css({ display: "grid", width: "30px", height: "30px", placeItems: "center", borderRadius: "pill", cursor: "pointer", _hover: { background: "rgba(255, 255, 255, 0.7)" } })}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <p class={css({ textStyle: "hand", fontSize: "1.2rem", lineHeight: 1 })}>{props.task.prompt}</p>

        <div>
          <span class={css({ display: "block", marginBottom: "6px", textStyle: "label" })}>photos</span>
          <button
            type="button"
            disabled={images().length >= MAX_IMAGES}
            onClick={() => fileInput.click()}
            class={css({
              display: "grid",
              width: "100%",
              minHeight: "86px",
              padding: "12px",
              placeItems: "center",
              border: "1.5px dashed rgba(26, 29, 19, 0.4)",
              borderRadius: "md",
              cursor: "pointer",
              _hover: { background: "rgba(255, 255, 255, 0.4)" },
              _disabled: { cursor: "not-allowed", opacity: 0.5 },
            })}
          >
            <Camera size={22} />
            <strong class={css({ marginTop: "3px", textStyle: "hand", fontSize: "1.15rem" })}>upload a photo of your work</strong>
            <span class={css({ fontSize: "0.56rem", color: "inkSoft" })}>up to {MAX_IMAGES} images · stored only in this browser</span>
          </button>
          <input ref={fileInput} type="file" accept="image/*" multiple hidden onChange={(e) => addImages(e.currentTarget.files)} />
          <Show when={images().length}>
            <div class={css({ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px", marginTop: "8px" })}>
              <For each={images()}>
                {(image) => (
                  <figure class={css({ position: "relative", aspectRatio: "1" })}>
                    <img src={image.src} alt={image.name} class={css({ width: "100%", height: "100%", borderRadius: "sm", objectFit: "cover" })} />
                    <button
                      type="button"
                      aria-label={`Remove ${image.name}`}
                      onClick={() => setImages((current) => current.filter((item) => item.id !== image.id))}
                      class={css({
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        display: "grid",
                        width: "22px",
                        height: "22px",
                        placeItems: "center",
                        borderRadius: "pill",
                        background: "rgba(20, 21, 17, 0.82)",
                        color: "white",
                        cursor: "pointer",
                      })}
                    >
                      <X size={13} />
                    </button>
                  </figure>
                )}
              </For>
            </div>
          </Show>
        </div>

        <label class={css({ display: "block", textStyle: "label" })}>
          comment
          <textarea
            rows={4}
            value={comment()}
            onInput={(e) => setComment(e.currentTarget.value)}
            placeholder="What happened when the material resisted?"
            class={css({
              display: "block",
              width: "100%",
              marginTop: "6px",
              padding: "10px 12px",
              border: "1px solid rgba(28, 31, 22, 0.25)",
              borderRadius: "md",
              background: "rgba(255, 255, 255, 0.5)",
              fontSize: "0.78rem",
              fontWeight: 400,
              letterSpacing: "normal",
              textTransform: "none",
              resize: "vertical",
            })}
          />
        </label>

        <Show when={error()}>
          <p role="alert" class={css({ color: "danger", fontSize: "0.66rem", lineHeight: 1.4 })}>
            {error()}
          </p>
        </Show>

        <div class={css({ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px" })}>
          <span class={css({ color: "inkSoft", fontSize: "0.62rem" })}>A photo, a comment, or both completes the task.</span>
          <Button variant="primary" type="submit" disabled={!hasSubmission(draft()) || saving()}>
            {hasSubmission(props.task) ? "save changes" : "submit work"} <Check size={15} />
          </Button>
        </div>
      </form>
    </dialog>
  );
}
