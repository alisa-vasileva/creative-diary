import { defineTextStyles } from "@pandacss/dev";

const caps = { fontWeight: 600, textTransform: "uppercase" } as const;

export const textStyles = defineTextStyles({
  /**
   * The Koza display face. It has no uppercase glyphs yet, so everything set in it is
   * lowercased. Always use this text style rather than `fontFamily: "hand"` directly.
   */
  hand: { value: { fontFamily: "hand", textTransform: "lowercase" } },
  /** Tiny spaced-out caption above headings. */
  eyebrow: { value: { ...caps, fontSize: "0.56rem", letterSpacing: "0.16em" } },
  /** Form field labels and category tags. */
  label: { value: { ...caps, fontSize: "0.58rem", letterSpacing: "0.12em" } },
  /** Quiet status lines such as the footer. */
  meta: { value: { ...caps, fontSize: "0.52rem", letterSpacing: "0.15em" } },
  body: { value: { fontSize: "0.72rem", lineHeight: 1.55 } },
});
