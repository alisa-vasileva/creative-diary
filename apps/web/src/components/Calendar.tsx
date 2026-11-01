import { addMonths, type DateKey, type TaskStatus, toDateKey } from "@creative-diary/core";
import { ArrowLeft, ArrowRight, Check } from "lucide-solid";
import { createMemo, For, Match, Switch } from "solid-js";
import { css, cx } from "styled-system/css";
import { glass } from "styled-system/recipes";
import { statusLabels } from "~/lib/format";

interface CalendarProps {
  /** Any date within the month to show. */
  month: Date;
  onMonthChange: (month: Date) => void;
  selected: DateKey;
  onSelect: (date: DateKey) => void;
  /** The status of the task on each day that has one. */
  marks: ReadonlyMap<DateKey, TaskStatus>;
}

const weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const grid = css({ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px 2px" });

const navButton = css({
  display: "grid",
  width: "28px",
  height: "28px",
  placeItems: "center",
  borderRadius: "pill",
  cursor: "pointer",
  _hover: { background: "rgba(255, 255, 255, 0.6)" },
});

const dayButton = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "1px",
  width: "34px",
  height: "38px",
  placeSelf: "center",
  borderRadius: "md",
  fontSize: "0.74rem",
  cursor: "pointer",
  "&:hover:not([data-selected])": { background: "rgba(255, 255, 255, 0.6)" },
  "&[data-today]:not([data-selected])": { boxShadow: "inset 0 0 0 1.5px token(colors.ink)" },
  "&[data-selected]": { background: "ink", color: "white" },
});

/** A dot for a task in progress, a tick for a completed one. */
function Mark(props: { status?: TaskStatus }) {
  return (
    <span aria-hidden="true" class={css({ display: "grid", height: "9px", placeItems: "center" })}>
      <Switch>
        <Match when={props.status === "completed"}>
          <Check size={10} stroke-width={3.5} />
        </Match>
        <Match when={props.status === "in-progress"}>
          <span class={css({ width: "5px", height: "5px", borderRadius: "pill", background: "currentColor" })} />
        </Match>
      </Switch>
    </span>
  );
}

export function Calendar(props: CalendarProps) {
  const days = createMemo(() => {
    const year = props.month.getFullYear();
    const month = props.month.getMonth();
    const leading = new Date(year, month, 1).getDay();
    const count = new Date(year, month + 1, 0).getDate();
    return [
      ...Array.from({ length: leading }, () => null),
      ...Array.from({ length: count }, (_, index) => ({
        day: index + 1,
        key: toDateKey(new Date(year, month, index + 1)),
      })),
    ];
  });
  const today = () => toDateKey();
  const monthName = () => props.month.toLocaleDateString("en", { month: "long" });

  return (
    <section
      aria-label="Creative diary calendar"
      class={cx(
        glass({ density: "medium" }),
        css({
          alignSelf: "start",
          width: "100%",
          maxWidth: "320px",
          marginInline: { base: "auto", md: 0 },
          padding: "14px 12px 12px",
          fontFamily: "ui",
        }),
      )}
    >
      <div
        class={css({
          display: "grid",
          gridTemplateColumns: "28px 1fr 28px",
          alignItems: "center",
          marginBottom: "10px",
          fontSize: "0.7rem",
          fontWeight: 600,
          letterSpacing: "0.07em",
          textAlign: "center",
          textTransform: "uppercase",
        })}
      >
        <button type="button" class={navButton} onClick={() => props.onMonthChange(addMonths(props.month, -1))} aria-label="Previous month">
          <ArrowLeft size={15} />
        </button>
        <span>{props.month.toLocaleDateString("en", { month: "long", year: "numeric" })}</span>
        <button type="button" class={navButton} onClick={() => props.onMonthChange(addMonths(props.month, 1))} aria-label="Next month">
          <ArrowRight size={15} />
        </button>
      </div>

      <div aria-hidden="true" class={cx(grid, css({ marginBottom: "4px", color: "inkSoft", fontSize: "0.6rem", textAlign: "center" }))}>
        <For each={weekdays}>{(day) => <span>{day}</span>}</For>
      </div>

      <div class={grid}>
        <For each={days()}>
          {(cell) =>
            cell ? (
              <button
                type="button"
                class={dayButton}
                data-selected={props.selected === cell.key || undefined}
                data-today={today() === cell.key || undefined}
                aria-pressed={props.selected === cell.key}
                aria-label={`${monthName()} ${cell.day}${props.marks.has(cell.key) ? `, ${statusLabels[props.marks.get(cell.key)!].toLowerCase()}` : ""}`}
                onClick={() => props.onSelect(cell.key)}
              >
                <span>{cell.day}</span>
                <Mark status={props.marks.get(cell.key)} />
              </button>
            ) : (
              <span />
            )
          }
        </For>
      </div>

      <div
        aria-hidden="true"
        class={css({
          display: "flex",
          justifyContent: "center",
          gap: "14px",
          marginTop: "10px",
          paddingTop: "9px",
          borderTop: "1px solid rgba(23, 24, 18, 0.12)",
          color: "inkSoft",
          fontSize: "0.6rem",
        })}
      >
        <span class={css({ display: "inline-flex", alignItems: "center", gap: "5px" })}>
          <span class={css({ width: "5px", height: "5px", borderRadius: "pill", background: "currentColor" })} /> in progress
        </span>
        <span class={css({ display: "inline-flex", alignItems: "center", gap: "4px" })}>
          <Check size={10} stroke-width={3.5} /> completed
        </span>
      </div>
    </section>
  );
}
