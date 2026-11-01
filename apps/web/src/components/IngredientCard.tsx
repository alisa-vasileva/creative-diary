import type { Category, Ingredient } from "@creative-diary/core";
import { Lock, LockOpen } from "lucide-solid";
import { Show } from "solid-js";
import { css, cx } from "styled-system/css";
import { glass } from "styled-system/recipes";
import { CategoryTag } from "~/components/CategoryTag";

interface IngredientCardProps {
  category: Category;
  ingredient: Ingredient;
  /** Show a lock toggle when given. */
  locked?: boolean;
  onToggleLock?: () => void;
}

export function IngredientCard(props: IngredientCardProps) {
  return (
    <div
      data-locked={props.locked || undefined}
      class={cx(
        glass({ density: "light" }),
        css({
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          minWidth: 0,
          padding: "12px 12px 13px",
          borderRadius: "md",
          transition: "border-color 160ms ease, background 160ms ease",
          "&[data-locked]": { borderColor: "ink", background: "rgba(255, 255, 255, 0.55)" },
        }),
      )}
    >
      <div class={css({ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: "28px" })}>
        <CategoryTag category={props.category} />
        <Show when={props.onToggleLock}>
          <button
            type="button"
            aria-pressed={Boolean(props.locked)}
            aria-label={`${props.locked ? "Unlock" : "Lock"} ${props.category}`}
            title={props.locked ? "Locked: kept when re-rolling" : "Lock to keep when re-rolling"}
            onClick={() => props.onToggleLock?.()}
            class={css({
              display: "grid",
              width: "28px",
              height: "28px",
              placeItems: "center",
              borderRadius: "pill",
              background: "rgba(255, 255, 255, 0.6)",
              cursor: "pointer",
              "&[aria-pressed=true]": { background: "ink", color: "white" },
            })}
          >
            {props.locked ? <Lock size={14} /> : <LockOpen size={14} />}
          </button>
        </Show>
      </div>
      {/* Keyed on the value so a freshly rolled ingredient animates in. */}
      <Show when={props.ingredient.value} keyed>
        {(value) => (
          <div class={css({ animation: "cardIn 320ms ease-out" })}>
            <strong class={css({ display: "block", textStyle: "hand", fontSize: "1.3rem", fontWeight: 500, lineHeight: 1 })}>
              {value}
            </strong>
            <small class={css({ display: "block", marginTop: "4px", color: "inkSoft", fontSize: "0.58rem" })}>
              {props.ingredient.group}
            </small>
          </div>
        )}
      </Show>
    </div>
  );
}
