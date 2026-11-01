import { css } from "styled-system/css";
import { paintings } from "~/lib/paintings";
import { PaintedImage } from "~/ui/PaintedImage";

/** Consecutive days with a completed task. */
export function CatStreak(props: { count: number }) {
  return (
    <div
      aria-label={`${props.count} day creative streak`}
      class={css({
        position: "relative",
        flexShrink: 0,
        width: { base: "105px", md: "116px", lg: "154px" },
        height: { base: "82px", md: "112px" },
        marginTop: "-20px",
      })}
    >
      <PaintedImage
        painting={paintings.cat}
        decorative
        css={css.raw({
          position: "absolute",
          top: { base: "-10px", md: "-1px" },
          left: "-7px",
          width: { base: "72px", md: "88px", lg: "118px" },
          filter: "drop-shadow(0 9px 12px rgba(29, 42, 23, 0.14))",
        })}
      />
      <strong
        class={css({
          position: "absolute",
          zIndex: 2,
          top: { base: "32px", md: "50px" },
          right: "1px",
          textStyle: "hand",
          fontSize: { base: "2.5rem", md: "3rem", lg: "3.7rem" },
          lineHeight: 0.65,
        })}
      >
        {props.count}
      </strong>
      <span
        class={css({
          position: "absolute",
          top: { base: "58px", md: "88px" },
          right: 0,
          fontFamily: "ui",
          fontSize: { base: "1.2rem", md: "1.55rem" },
        })}
      >
        streak
      </span>
    </div>
  );
}
