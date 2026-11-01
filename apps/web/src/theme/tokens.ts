import { defineSemanticTokens, defineTokens } from "@pandacss/dev";

export const tokens = defineTokens({
  colors: {
    ink: { value: "#171812" },
    inkSoft: { value: "rgba(19, 22, 14, 0.55)" },
    inkFaint: { value: "rgba(19, 22, 14, 0.3)" },
    paper: { value: "#f8f4dd" },
    sky: { value: "#168bcc" },
    danger: { value: "#8f2731" },
    category: {
      context: { value: "#f5dc73" },
      material: { value: "#67bce9" },
      process: { value: "#f6a08d" },
      colour: { value: "#b5a2d3" },
    },
    status: {
      completed: { value: "rgba(142, 180, 101, 0.55)" },
      inProgress: { value: "rgba(244, 197, 91, 0.55)" },
    },
  },
  fonts: {
    hand: { value: '"Koza", "Pangolin", cursive' },
    body: { value: '"Josefin Sans", sans-serif' },
    ui: { value: '"Inter", sans-serif' },
  },
  radii: {
    sm: { value: "8px" },
    md: { value: "14px" },
    lg: { value: "22px" },
    pill: { value: "999px" },
  },
  shadows: {
    float: { value: "0 25px 60px rgba(41, 35, 28, 0.16)" },
    lift: { value: "0 18px 55px rgba(32, 31, 20, 0.1)" },
  },
  dropShadows: {
    painted: { value: "0 10px 10px rgba(45, 36, 41, 0.14)" },
    pot: { value: "0 25px 25px rgba(38, 34, 23, 0.24)" },
  },
});

export const semanticTokens = defineSemanticTokens({
  colors: {
    accent: { value: "{colors.category.material}" },
  },
});
