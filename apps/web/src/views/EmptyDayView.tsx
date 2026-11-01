import type { DateKey } from "@creative-diary/core";
import { css, cx } from "styled-system/css";
import { glass } from "styled-system/recipes";
import { ViewHeader } from "~/components/ViewHeader";
import { formatLongDate } from "~/lib/format";

/** A day without a task: in the past, or not here yet. */
export function EmptyDayView(props: { date: DateKey; future: boolean }) {
  return (
    <section class={cx(glass({ density: "medium" }), css({ padding: { base: "26px 20px", md: "40px" } }))}>
      <ViewHeader
        eyebrow={formatLongDate(props.date)}
        title={props.future ? "not here yet" : "no task on this day"}
        description={
          props.future
            ? "Each day's task is brewed on the day itself."
            : "Nothing was brewed on this day."
        }
      />
    </section>
  );
}
