import { createSignal, onCleanup, Show } from "solid-js";
import { css } from "styled-system/css";

const DURATION_MS = 3200;

/** A single transient message. Showing a new one replaces the current one. */
export function createToast() {
  const [message, setMessage] = createSignal("");
  let timer: number | undefined;

  const show = (text: string) => {
    window.clearTimeout(timer);
    setMessage(text);
    timer = window.setTimeout(() => setMessage(""), DURATION_MS);
  };

  onCleanup(() => window.clearTimeout(timer));

  return { message, show };
}

export function Toast(props: { message: string }) {
  return (
    <Show when={props.message}>
      <div
        role="status"
        class={css({
          position: "fixed",
          zIndex: 50,
          right: "24px",
          bottom: "24px",
          maxWidth: "310px",
          paddingBlock: "11px",
          paddingInline: "15px",
          borderRadius: "md",
          background: "rgba(23, 26, 18, 0.9)",
          color: "white",
          fontSize: "0.7rem",
          boxShadow: "0 13px 35px rgba(20, 22, 16, 0.25)",
          animation: "toastIn 240ms ease-out",
        })}
      >
        {props.message}
      </div>
    </Show>
  );
}
