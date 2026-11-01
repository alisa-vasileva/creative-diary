import type { Ref } from "solid-js";
import { css } from "styled-system/css";
import type { SystemStyleObject } from "styled-system/types";
import type { Painting } from "~/lib/paintings";

interface PaintedImageProps {
  painting: Painting;
  /** Style overrides, e.g. `css.raw({ width: "120px" })`. */
  css?: SystemStyleObject;
  /** Hide from assistive tech when the painting is ornamental. */
  decorative?: boolean;
  ref?: Ref<HTMLImageElement>;
}

const imageStyle = css.raw({
  display: "block",
  maxWidth: "none",
  height: "auto",
  userSelect: "none",
  pointerEvents: "none",
});

export function PaintedImage(props: PaintedImageProps) {
  return (
    <img
      ref={props.ref}
      src={props.painting.src}
      width={props.painting.width}
      height={props.painting.height}
      alt={props.decorative ? "" : props.painting.alt}
      aria-hidden={props.decorative || undefined}
      draggable={false}
      class={css(imageStyle, props.css)}
    />
  );
}
