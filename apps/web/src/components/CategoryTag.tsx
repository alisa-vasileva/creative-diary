import type { Category } from "@creative-diary/core";
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";

/** Small caps category name with its colour swatch. */
export function CategoryTag(props: { category: Category }) {
  return (
    <span class={css({ display: "inline-flex", alignItems: "center", gap: "6px", textStyle: "label" })}>
      <span
        aria-hidden="true"
        class={css({ width: "9px", height: "9px", borderRadius: "pill", background: "var(--swatch)" })}
        style={{ "--swatch": token.var(`colors.category.${props.category}`) }}
      />
      {props.category}
    </span>
  );
}
