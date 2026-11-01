import { type JSX, Show } from "solid-js";
import { css } from "styled-system/css";
import { Eyebrow } from "~/ui/Eyebrow";

interface ViewHeaderProps {
  eyebrow: JSX.Element;
  title: JSX.Element;
  description?: JSX.Element;
  align?: "start" | "center";
}

export function ViewHeader(props: ViewHeaderProps) {
  return (
    <div
      data-align={props.align ?? "start"}
      class={css({ "&[data-align=center]": { textAlign: "center" } })}
    >
      <Eyebrow>{props.eyebrow}</Eyebrow>
      <h1
        class={css({
          marginBlock: "4px 8px",
          textStyle: "hand",
          fontSize: "clamp(2.3rem, 5vw, 4.2rem)",
          fontWeight: 600,
          lineHeight: 0.9,
        })}
      >
        {props.title}
      </h1>
      <Show when={props.description}>
        <p
          class={css({
            maxWidth: "520px",
            textStyle: "body",
            "[data-align=center] > &": { marginInline: "auto" },
          })}
        >
          {props.description}
        </p>
      </Show>
    </div>
  );
}
