import { type Category, categories, categoryQuestions, findGroup, type GroupPicks, vocabulary } from "@creative-diary/core";
import { ArrowLeft, Check, Sparkles, X } from "lucide-solid";
import { createSignal, For, Show } from "solid-js";
import { css, cx } from "styled-system/css";
import { glass } from "styled-system/recipes";
import { CategoryTag } from "~/components/CategoryTag";
import { ViewHeader } from "~/components/ViewHeader";
import { Button } from "~/ui/Button";

interface ManualViewProps {
  picks: GroupPicks;
  onPick: (category: Category, groupLabel: string | null) => void;
  onBack: () => void;
  onBrew: () => void;
}

/** Hand-pick an ingredient group for any of the four categories; the rest is left to chance. */
export function ManualView(props: ManualViewProps) {
  const [open, setOpen] = createSignal<Category | null>(null);
  let panel: HTMLDivElement | undefined;

  const openCategory = (category: Category) => {
    setOpen((current) => (current === category ? null : category));
    // On phones the list sits below the slots; bring it into view.
    queueMicrotask(() => panel?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };

  const pickedCount = () => categories.filter((category) => props.picks[category]).length;
  const summary = () => {
    const chance = categories.length - pickedCount();
    if (pickedCount() === 0) return "Nothing chosen yet: everything will be left to chance.";
    if (chance === 0) return "All four groups chosen. The cauldron picks the exact words.";
    return `${pickedCount()} chosen · ${chance} left to chance`;
  };

  return (
    <section class={css({ display: "grid", gap: "20px", width: "100%" })}>
      <ViewHeader
        eyebrow="manual selection"
        title="choose your ingredients"
        description="Pick a group for as many categories as you like. The cauldron draws the exact word from each group, and fills anything you leave empty."
      />

      <div class={css({ display: "grid", gridTemplateColumns: { base: "1fr", md: "minmax(200px, 260px) minmax(0, 1fr)" }, gap: "14px", alignItems: "start" })}>
        <div class={css({ display: "grid", gridTemplateColumns: { base: "1fr 1fr", md: "1fr" }, gap: "8px" })}>
          <For each={categories}>
            {(category) => {
              const group = () => findGroup(category, props.picks[category]);
              return (
                <div class={css({ position: "relative" })}>
                  <button
                    type="button"
                    aria-expanded={open() === category}
                    aria-controls="group-list"
                    data-open={open() === category || undefined}
                    onClick={() => openCategory(category)}
                    class={cx(
                      glass({ density: "light" }),
                      css({
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "6px",
                        width: "100%",
                        minHeight: "74px",
                        padding: "11px 36px 11px 12px",
                        borderRadius: "md",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "background 160ms ease, border-color 160ms ease",
                        _hover: { background: "rgba(255, 255, 255, 0.5)" },
                        "&[data-open]": { borderColor: "ink", background: "rgba(255, 255, 255, 0.6)" },
                      }),
                    )}
                  >
                    <CategoryTag category={category} />
                    <span
                      data-empty={!group() || undefined}
                      class={css({
                        textStyle: "hand",
                        fontSize: "1.1rem",
                        lineHeight: 1,
                        "&[data-empty]": { color: "inkSoft" },
                      })}
                    >
                      {group()?.label ?? "left to chance"}
                    </span>
                  </button>
                  <Show when={group()}>
                    <button
                      type="button"
                      aria-label={`Clear ${category}`}
                      onClick={() => props.onPick(category, null)}
                      class={css({
                        position: "absolute",
                        top: "9px",
                        right: "9px",
                        display: "grid",
                        width: "22px",
                        height: "22px",
                        placeItems: "center",
                        borderRadius: "pill",
                        cursor: "pointer",
                        _hover: { background: "rgba(255, 255, 255, 0.7)" },
                      })}
                    >
                      <X size={13} />
                    </button>
                  </Show>
                </div>
              );
            }}
          </For>
        </div>

        <div
          ref={panel}
          id="group-list"
          class={cx(glass({ density: "medium" }), css({ minHeight: { md: "330px" }, padding: "16px", scrollMarginBlock: "16px" }))}
        >
          <Show
            when={open()}
            fallback={
              <p class={css({ display: "grid", minHeight: { base: "90px", md: "296px" }, placeItems: "center", color: "inkSoft", textStyle: "body", textAlign: "center" })}>
                Choose a category to see its ingredient groups.
              </p>
            }
          >
            {(category) => (
              <GroupList
                category={category()}
                selected={props.picks[category()]}
                onSelect={(label) => props.onPick(category(), label === props.picks[category()] ? null : label)}
              />
            )}
          </Show>
        </div>
      </div>

      <div class={css({ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px" })}>
        <Button onClick={() => props.onBack()}>
          <ArrowLeft size={15} /> back
        </Button>
        <div class={css({ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-end", gap: "12px" })}>
          <span class={css({ color: "inkSoft", fontSize: "0.66rem" })}>{summary()}</span>
          <Button variant="primary" onClick={() => props.onBrew()}>
            brew the task <Sparkles size={15} />
          </Button>
        </div>
      </div>
    </section>
  );
}

interface GroupListProps {
  category: Category;
  selected?: string;
  onSelect: (groupLabel: string) => void;
}

function GroupList(props: GroupListProps) {
  return (
    <div>
      <div class={css({ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px" })}>
        <h2 class={css({ textStyle: "hand", fontSize: "1.7rem", fontWeight: 600, lineHeight: 1 })}>{props.category}</h2>
        <span class={css({ color: "inkSoft", fontSize: "0.6rem" })}>tap again to clear</span>
      </div>
      <Show when={categoryQuestions[props.category]}>
        <p class={css({ maxWidth: "560px", marginTop: "4px", color: "inkSoft", fontSize: "0.66rem", lineHeight: 1.5 })}>
          {categoryQuestions[props.category]}
        </p>
      </Show>
      <div class={css({ height: "10px" })} />
      <div role="radiogroup" aria-label={`${props.category} groups`} class={css({ display: "grid", gridTemplateColumns: { base: "minmax(0, 1fr)", lg: "repeat(2, minmax(0, 1fr))" }, gap: "6px" })}>
        <For each={vocabulary[props.category]}>
          {(group) => (
            <button
              type="button"
              role="radio"
              aria-checked={props.selected === group.label}
              onClick={() => props.onSelect(group.label)}
              class={css({
                position: "relative",
                display: "block",
                width: "100%",
                padding: "10px 34px 10px 12px",
                borderRadius: "md",
                background: "rgba(255, 255, 255, 0.35)",
                textAlign: "left",
                cursor: "pointer",
                transition: "background 160ms ease",
                "&:hover:not([aria-checked=true])": { background: "rgba(255, 255, 255, 0.65)" },
                "&[aria-checked=true]": { background: "ink", color: "white" },
              })}
            >
              <span class={css({ display: "block", textStyle: "hand", fontSize: "1.05rem", lineHeight: 1 })}>{group.label}</span>
              <span
                class={css({
                  display: "block",
                  overflow: "hidden",
                  marginTop: "4px",
                  fontSize: "0.56rem",
                  opacity: 0.65,
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                })}
              >
                {group.options.slice(0, 5).join(", ")}…
              </span>
              <Show when={props.selected === group.label}>
                <Check size={15} class={css({ position: "absolute", top: "50%", right: "12px", transform: "translateY(-50%)" })} />
              </Show>
            </button>
          )}
        </For>
      </div>
    </div>
  );
}
