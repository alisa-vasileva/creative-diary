import { css } from "styled-system/css";
import { pluralise } from "~/lib/format";

export function Footer(props: { taskCount: number }) {
  return (
    <footer
      class={css({
        display: "flex",
        justifyContent: "space-between",
        color: "rgba(18, 22, 14, 0.54)",
        textStyle: "meta",
      })}
    >
      <span>{pluralise(props.taskCount, "task")} held locally</span>
      <span class={css({ display: { base: "none", sm: "inline" } })}>made slowly, remembered softly</span>
    </footer>
  );
}
