import type { TaskStatus } from "@creative-diary/core";
import { Check } from "lucide-solid";
import { Show } from "solid-js";
import { css } from "styled-system/css";
import { statusLabels } from "~/lib/format";

export function StatusPill(props: { status: TaskStatus }) {
  return (
    <span
      data-status={props.status}
      class={css({
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        paddingBlock: "4px",
        paddingInline: "10px",
        borderRadius: "pill",
        textStyle: "label",
        "&[data-status=in-progress]": { background: "status.inProgress" },
        "&[data-status=completed]": { background: "status.completed" },
      })}
    >
      <Show
        when={props.status === "completed"}
        fallback={<span class={css({ width: "6px", height: "6px", borderRadius: "pill", background: "currentColor" })} />}
      >
        <Check size={11} stroke-width={3} />
      </Show>
      {statusLabels[props.status]}
    </span>
  );
}
