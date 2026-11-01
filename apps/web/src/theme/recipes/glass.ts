import { defineRecipe } from "@pandacss/dev";

export const glassRecipe = defineRecipe({
  className: "glass",
  description: "Frosted paper surfaces laid over the painted background",
  base: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: "lg",
    backdropFilter: "auto",
  },
  variants: {
    density: {
      /** Small chips and tags. */
      light: {
        borderColor: "rgba(255, 255, 255, 0.4)",
        background: "rgba(248, 244, 224, 0.34)",
        backdropBlur: "12px",
      },
      /** Cards and panels. */
      medium: {
        borderColor: "rgba(255, 255, 255, 0.5)",
        background: "rgba(248, 244, 221, 0.5)",
        backdropBlur: "18px",
        boxShadow: "lift",
      },
      /** Reading surfaces: the task page. */
      dense: {
        borderColor: "rgba(255, 255, 255, 0.55)",
        background: "rgba(249, 244, 220, 0.68)",
        backdropBlur: "23px",
        boxShadow: "float",
      },
    },
  },
  defaultVariants: { density: "medium" },
});
