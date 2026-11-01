import { defineRecipe } from "@pandacss/dev";

const filled = {
  minHeight: "38px",
  paddingInline: "16px",
  paddingBlock: "8px",
  borderRadius: "pill",
  fontWeight: 600,
} as const;

export const buttonRecipe = defineRecipe({
  className: "button",
  description: "Pill-shaped action buttons and underlined text links",
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontSize: "0.66rem",
    lineHeight: 1.1,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "background 160ms ease, opacity 160ms ease",
    _disabled: { cursor: "not-allowed", opacity: 0.4 },
  },
  variants: {
    variant: {
      soft: {
        ...filled,
        background: "rgba(255, 255, 255, 0.45)",
        _hover: { background: "rgba(255, 255, 255, 0.65)" },
      },
      primary: {
        ...filled,
        background: "ink",
        color: "white",
      },
      link: {
        paddingBlock: "4px",
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: "currentColor",
        background: "transparent",
      },
    },
  },
  defaultVariants: { variant: "soft" },
});
