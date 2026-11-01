import type { ParentProps } from "solid-js";
import { css, cx } from "styled-system/css";

export function Eyebrow(props: ParentProps<{ class?: string }>) {
  return <span class={cx(css({ textStyle: "eyebrow" }), props.class)}>{props.children}</span>;
}
