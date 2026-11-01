import { For, Show } from "solid-js";
import { css } from "styled-system/css";
import type { SystemStyleObject } from "styled-system/types";
import { paintings } from "~/lib/paintings";
import { PaintedImage } from "~/ui/PaintedImage";

interface CauldronProps {
  /** Style overrides for the wrapper, typically its width. */
  css?: SystemStyleObject;
  /** Light the fire and bubble the brew. */
  mixing?: boolean;
}

const cauldronStyle = css.raw({
  position: "relative",
  display: "block",
  width: "100%",
  aspectRatio: "1200 / 1133",
});

const bubbles = [
  { left: "22%", size: 18, delay: 0 },
  { left: "43%", size: 11, delay: 0.35 },
  { left: "68%", size: 23, delay: 0.62 },
  { left: "51%", size: 9, delay: 0.9 },
];

export function Cauldron(props: CauldronProps) {
  return (
    <div
      role="img"
      aria-label={props.mixing ? "Ingredients bubbling inside a magical cauldron" : "Hand-painted green cauldron"}
      data-mixing={props.mixing || undefined}
      class={css(cauldronStyle, props.css)}
    >
      <PaintedImage
        painting={paintings.fire}
        decorative
        css={css.raw({
          position: "absolute",
          zIndex: 1,
          bottom: "-34%",
          left: "50%",
          width: "72%",
          opacity: 0,
          transform: "translateX(-50%) rotate(90deg)",
          "[data-mixing] > &": {
            opacity: 0.96,
            animation: "fireFlicker 0.45s ease-in-out infinite alternate",
          },
        })}
      />
      <PaintedImage
        painting={paintings.cauldron}
        decorative
        css={css.raw({ position: "relative", zIndex: 2, width: "100%", filter: "drop-shadow(token(dropShadows.pot))" })}
      />

      <Show when={props.mixing}>
        <span
          aria-hidden="true"
          class={css({
            position: "absolute",
            zIndex: 3,
            top: "-4%",
            left: "50%",
            width: "42%",
            height: "34%",
            transform: "translateX(-50%)",
          })}
        >
          <For each={bubbles}>
            {(bubble) => (
              <span
                class={css({
                  position: "absolute",
                  bottom: 0,
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderColor: "rgba(48, 78, 36, 0.72)",
                  borderRadius: "pill",
                  background: "rgba(207, 244, 134, 0.6)",
                  animation: "bubbleRise 1.35s ease-in infinite",
                })}
                style={{
                  left: bubble.left,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  "animation-delay": `${bubble.delay}s`,
                }}
              />
            )}
          </For>
        </span>
      </Show>
    </div>
  );
}
