import type { JSX } from "solid-js";
import { css } from "styled-system/css";

const shell = css({
  position: "relative",
  isolation: "isolate",
  display: "grid",
  gridTemplateColumns: { base: "minmax(0, 1fr)", md: "260px minmax(0, 1fr)", lg: "290px minmax(0, 1fr)" },
  gridTemplateAreas: {
    base: '"masthead" "main" "calendar" "footer"',
    md: '"masthead masthead" "calendar main" "footer footer"',
  },
  gridTemplateRows: { md: "auto minmax(0, 1fr) auto" },
  gap: { base: "20px", md: "24px 3.2vw" },
  minHeight: "100svh",
  padding: { base: "18px 16px 24px", md: "25px clamp(24px, 3.5vw, 58px) 20px" },
  overflowX: "hidden",
  // A blurred watercolour wash, built from gradients so it scales with the viewport.
  background: `
    radial-gradient(circle at 4% 69%, rgba(112, 87, 156, 0.76), transparent 22%),
    radial-gradient(circle at 30% 14%, rgba(247, 159, 174, 0.74), transparent 16%),
    radial-gradient(circle at 71% 12%, rgba(218, 235, 123, 0.93), transparent 25%),
    radial-gradient(circle at 82% 71%, rgba(49, 120, 150, 0.8), transparent 29%),
    radial-gradient(circle at 37% 80%, rgba(213, 196, 84, 0.72), transparent 20%),
    linear-gradient(135deg, #f2e7dc, #d7dcbd 43%, #d6bcad 69%, #d2d4bb)`,
  _before: {
    content: '""',
    position: "absolute",
    zIndex: -2,
    inset: "27% -8% 18%",
    opacity: 0.86,
    filter: "blur(40px)",
    transform: "rotate(4deg)",
    background: `
      linear-gradient(172deg, transparent 0 22%, rgba(43, 56, 24, 0.96) 30% 48%, transparent 58%),
      radial-gradient(ellipse at 55% 82%, rgba(255, 251, 240, 0.92), transparent 65%)`,
  },
  // Paper grain.
  _after: {
    content: '""',
    position: "absolute",
    zIndex: -1,
    inset: 0,
    opacity: 0.18,
    pointerEvents: "none",
    mixBlendMode: "multiply",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.83' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.3'/%3E%3C/svg%3E\")",
  },
});

const sheen = css({
  position: "absolute",
  zIndex: -1,
  top: "41%",
  left: "-5%",
  width: "110%",
  height: "35%",
  filter: "blur(30px)",
  transform: "rotate(-2deg)",
  background: "rgba(255, 253, 244, 0.18)",
});

const area = {
  masthead: css({ gridArea: "masthead" }),
  calendar: css({ gridArea: "calendar" }),
  main: css({ gridArea: "main", minWidth: 0 }),
  footer: css({ gridArea: "footer" }),
};

interface AppShellProps {
  masthead: JSX.Element;
  calendar: JSX.Element;
  children: JSX.Element;
  footer: JSX.Element;
}

/** The painted page: masthead, calendar beside the main stage (below it on phones), footer. */
export function AppShell(props: AppShellProps) {
  return (
    <div class={shell}>
      <div class={sheen} />
      <div class={area.masthead}>{props.masthead}</div>
      <main class={area.main}>{props.children}</main>
      <aside class={area.calendar}>{props.calendar}</aside>
      <div class={area.footer}>{props.footer}</div>
    </div>
  );
}
