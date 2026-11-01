import type { JSX } from "solid-js";
import { css } from "styled-system/css";

export function Masthead(props: { onHome: () => void; aside: JSX.Element }) {
  return (
    <header class={css({ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" })}>
      <button
        type="button"
        onClick={() => props.onHome()}
        class={css({
          textStyle: "hand",
          fontSize: { base: "clamp(1.5rem, 7vw, 2.2rem)", md: "clamp(2.1rem, 3.1vw, 3.25rem)" },
          fontWeight: 700,
          lineHeight: 0.86,
          cursor: "pointer",
          transform: "rotate(-1deg)",
        })}
      >
        creative diary
      </button>
      {props.aside}
    </header>
  );
}
