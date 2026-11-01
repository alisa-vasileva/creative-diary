import { defineKeyframes } from "@pandacss/dev";

export const keyframes = defineKeyframes({
  ingredientFall: {
    "0%": { opacity: 0, transform: "translate(calc(var(--x) * 1.8), -30px) rotate(-12deg)" },
    "25%": { opacity: 1 },
    "100%": { opacity: 0, transform: "translate(var(--x), 330px) rotate(28deg) scale(0.7)" },
  },
  // A freshly drawn ingredient card settling into place.
  cardIn: {
    from: { opacity: 0, transform: "translateY(8px) scale(0.97)" },
    to: { opacity: 1, transform: "translateY(0) scale(1)" },
  },
  potStir: {
    from: { transform: "rotate(-1.6deg) translateX(-4px)" },
    to: { transform: "rotate(1.7deg) translateX(5px)" },
  },
  fireFlicker: {
    from: { transform: "translateX(-50%) rotate(88deg) scale(0.96)", opacity: 0.75 },
    to: { transform: "translateX(-50%) rotate(92deg) scale(1.05)", opacity: 1 },
  },
  bubbleRise: {
    "0%": { opacity: 0, transform: "translateY(35px) scale(0.4)" },
    "35%": { opacity: 0.9 },
    "100%": { opacity: 0, transform: "translateY(-75px) scale(1.25)" },
  },
  toastIn: {
    from: { opacity: 0, transform: "translateY(10px) rotate(2deg)" },
    to: { opacity: 1, transform: "translateY(0) rotate(0)" },
  },
});
