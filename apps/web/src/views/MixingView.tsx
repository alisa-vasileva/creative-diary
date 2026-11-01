import { categories } from "@creative-diary/core";
import { For, onCleanup, onMount } from "solid-js";
import { css } from "styled-system/css";
import { Cauldron } from "~/components/Cauldron";
import { Button } from "~/ui/Button";

const MIX_DURATION_MS = 2600;

/** The brewing interstitial before a task is revealed. Calls `onDone` when finished or skipped. */
export function MixingView(props: { onDone: () => void }) {
  onMount(() => {
    const timer = window.setTimeout(() => props.onDone(), MIX_DURATION_MS);
    onCleanup(() => window.clearTimeout(timer));
  });

  return (
    <section
      aria-live="polite"
      class={css({ position: "relative", display: "grid", minHeight: "520px", placeItems: "center", alignContent: "center", gap: "28px" })}
    >
      <div aria-hidden="true" class={css({ position: "absolute", zIndex: 3, top: "4%", left: "50%" })}>
        <For each={categories}>
          {(category, index) => (
            <span
              style={{ "--delay": `${index() * 0.18}s`, "--x": `${(index() - 1.5) * 68}px` }}
              class={css({
                position: "absolute",
                width: "max-content",
                padding: "3px 10px",
                borderRadius: "pill",
                background: "rgba(255, 255, 245, 0.73)",
                textStyle: "hand",
                fontSize: "1.1rem",
                animation: "ingredientFall 2s cubic-bezier(.55, .05, .8, .42) var(--delay) both",
              })}
            >
              {category}
            </span>
          )}
        </For>
      </div>

      <Cauldron mixing css={css.raw({ width: "min(100%, 460px)", animation: "potStir 0.8s ease-in-out infinite alternate" })} />

      <p class={css({ textStyle: "hand", fontSize: "1.4rem", color: "rgba(255, 255, 255, 0.92)", textShadow: "0 2px 12px rgba(17, 15, 24, 0.35)" })}>
        stirring the unlikely together…
      </p>
      <Button variant="link" onClick={() => props.onDone()} class={css({ position: "absolute", right: "4px", bottom: "4px" })}>
        skip the magic
      </Button>
    </section>
  );
}
