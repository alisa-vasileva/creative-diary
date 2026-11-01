import { defineConfig } from "@pandacss/dev";
import { globalCss, globalFontface } from "./src/theme/global-css";
import { keyframes } from "./src/theme/keyframes";
import { buttonRecipe } from "./src/theme/recipes/button";
import { glassRecipe } from "./src/theme/recipes/glass";
import { textStyles } from "./src/theme/text-styles";
import { semanticTokens, tokens } from "./src/theme/tokens";

export default defineConfig({
  // Panda v2 no longer injects presets implicitly. Only the base utilities and conditions are used;
  // every token comes from ./src/theme, so the default Panda palette and scales are left out.
  presets: ["@pandacss/preset-base"],
  preflight: true,
  jsxFramework: "solid",
  include: ["./src/**/*.{ts,tsx}"],
  exclude: [],
  outdir: "styled-system",
  globalCss,
  globalFontface,
  theme: {
    // Replaces the preset's breakpoints. `smDown` = phones, `mdDown` = single column,
    // `lgDown` = two columns, `lg` = the full three-column desktop layout.
    breakpoints: {
      sm: "481px",
      md: "781px",
      lg: "1121px",
    },
    extend: {
      tokens,
      semanticTokens,
      keyframes,
      textStyles,
      recipes: {
        button: buttonRecipe,
        glass: glassRecipe,
      },
    },
  },
});
