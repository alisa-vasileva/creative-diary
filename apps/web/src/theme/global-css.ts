import { defineGlobalFontface, defineGlobalStyles } from "@pandacss/dev";

export const globalFontface = defineGlobalFontface({
  Koza: {
    src: 'url("/fonts/KozaVF.ttf") format("truetype")',
    fontWeight: "100 900",
    fontStyle: "normal",
    fontDisplay: "swap",
  },
});

export const globalCss = defineGlobalStyles({
  ":root": {
    color: "ink",
    background: "#d7d6b9",
    fontFamily: "body",
    lineHeight: "normal",
    fontSynthesis: "none",
  },
  // Panda's preflight balances headings; the design wants ordinary wrapping.
  "h1, h2, h3, h4, h5, h6": {
    textWrap: "wrap",
  },
  "html, body": {
    minWidth: "320px",
  },
  body: {
    minHeight: "100vh",
  },
  "button, input, textarea, select": {
    color: "inherit",
    font: "inherit",
  },
  ":is(button, input, textarea, select, [tabindex]):focus-visible": {
    outline: "2px solid token(colors.ink)",
    outlineOffset: "3px",
  },
  "@media (prefers-reduced-motion: reduce)": {
    "*, *::before, *::after": {
      scrollBehavior: "auto !important",
      animationDuration: "0.01ms !important",
      animationIterationCount: "1 !important",
      transitionDuration: "0.01ms !important",
    },
  },
});
