import {
  allLocked,
  type Category,
  canReroll,
  categories,
  type DayState,
  type Generation,
  MAX_REROLLS,
  rerollsLeft,
} from "@creative-diary/core";
import { Check, Dices } from "lucide-solid";
import { For } from "solid-js";
import { css, cx } from "styled-system/css";
import { glass } from "styled-system/recipes";
import { IngredientCard } from "~/components/IngredientCard";
import { Button } from "~/ui/Button";
import { Eyebrow } from "~/ui/Eyebrow";

interface ReviewViewProps {
  state: DayState & { generation: Generation };
  onToggleLock: (category: Category) => void;
  onReroll: () => void;
  onAccept: () => void;
}

/** The generated task, waiting to be accepted. Lock what you like and re-roll the rest. */
export function ReviewView(props: ReviewViewProps) {
  const left = () => rerollsLeft(props.state);
  const noneLocked = () => props.state.locked.length === 0;

  const hint = () => {
    if (left() === 0) return "No re-rolls left today. This is the one.";
    if (allLocked(props.state)) return "Everything is locked. Unlock an ingredient to re-roll it.";
    if (noneLocked()) return "Not quite right? Re-roll everything, or lock the ingredients you like and re-roll the rest.";
    return "Re-rolling keeps the locked ingredients and redraws the others.";
  };

  return (
    <section class={cx(glass({ density: "dense" }), css({ display: "grid", gap: "20px", padding: { base: "22px 18px", md: "30px" } }))}>
      <div>
        <Eyebrow>today's task · {props.state.mode === "manual" ? "manual selection" : "random mode"}</Eyebrow>
        <h1 class={css({ marginTop: "8px", textStyle: "hand", fontSize: "clamp(2rem, 4.4vw, 3.6rem)", fontWeight: 700, lineHeight: 0.92 })}>
          {props.state.generation.prompt}
        </h1>
      </div>

      <div class={css({ display: "grid", gridTemplateColumns: { base: "1fr 1fr", lg: "repeat(4, minmax(0, 1fr))" }, gap: "8px" })}>
        <For each={categories}>
          {(category) => (
            <IngredientCard
              category={category}
              ingredient={props.state.generation.ingredients[category]}
              locked={props.state.locked.includes(category)}
              onToggleLock={() => props.onToggleLock(category)}
            />
          )}
        </For>
      </div>

      <div
        class={css({
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          paddingTop: "16px",
          borderTop: "1px solid rgba(23, 24, 18, 0.12)",
        })}
      >
        <p class={css({ flex: "1 1 240px", color: "inkSoft", fontSize: "0.68rem", lineHeight: 1.5 })}>{hint()}</p>
        <div class={css({ display: "flex", flexWrap: "wrap", gap: "8px" })}>
          <Button disabled={!canReroll(props.state)} onClick={() => props.onReroll()}>
            <Dices size={16} />
            {noneLocked() ? "re-roll all" : "re-roll the rest"}
            <span class={css({ opacity: 0.6 })}>
              {left()}/{MAX_REROLLS}
            </span>
          </Button>
          <Button variant="primary" onClick={() => props.onAccept()}>
            accept task <Check size={15} />
          </Button>
        </div>
      </div>
    </section>
  );
}
