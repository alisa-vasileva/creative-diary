import { type DateKey, MAX_REROLLS } from "@creative-diary/core";
import { ArrowRight, Shuffle } from "lucide-solid";
import type { JSX } from "solid-js";
import { css, cx } from "styled-system/css";
import { glass } from "styled-system/recipes";
import { ViewHeader } from "~/components/ViewHeader";
import { formatLongDate } from "~/lib/format";

interface StartViewProps {
  date: DateKey;
  onManual: () => void;
  onRandom: () => void;
}

export function StartView(props: StartViewProps) {
  return (
    <section class={css({ display: "grid", gap: "26px", width: "100%", maxWidth: "780px", marginInline: "auto" })}>
      <ViewHeader
        align="center"
        eyebrow={formatLongDate(props.date)}
        title="how shall we begin?"
        description={`Choose some ingredients yourself, or let the cauldron decide everything. You'll get ${MAX_REROLLS} re-rolls once the task appears.`}
      />
      <div class={css({ display: "grid", gridTemplateColumns: { base: "1fr", sm: "1fr 1fr" }, gap: "14px" })}>
        <ModeCard
          mark="01"
          title="manual selection"
          cta={<>choose ingredients <ArrowRight size={16} /></>}
          glow="#70bde5"
          onClick={() => props.onManual()}
        >
          Pick an ingredient group for any of context, material, process and colour. Whatever you leave empty is
          left to chance.
        </ModeCard>
        <ModeCard
          mark="02"
          title="random mode"
          cta={<>trust the cauldron <Shuffle size={16} /></>}
          glow="#eda77e"
          onClick={() => props.onRandom()}
        >
          Make no choices. All four ingredients are drawn from the whole Ideas Factory vocabulary.
        </ModeCard>
      </div>
    </section>
  );
}

interface ModeCardProps {
  mark: string;
  title: string;
  cta: JSX.Element;
  children: JSX.Element;
  /** Colour of the soft glow in the corner. */
  glow: string;
  onClick: () => void;
}

function ModeCard(props: ModeCardProps) {
  return (
    <button
      type="button"
      onClick={() => props.onClick()}
      style={{ "--glow": props.glow }}
      class={cx(
        glass({ density: "medium" }),
        css({
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          minHeight: { base: "190px", md: "225px" },
          padding: "28px 26px 24px",
          overflow: "hidden",
          textAlign: "left",
          cursor: "pointer",
          transition: "transform 180ms ease, background 180ms ease",
          _hover: { background: "rgba(255, 252, 230, 0.66)", transform: "translateY(-4px)" },
          _after: {
            content: '""',
            position: "absolute",
            zIndex: -1,
            right: "-20px",
            bottom: "-20px",
            width: "135px",
            height: "90px",
            borderRadius: "pill",
            filter: "blur(14px)",
            opacity: 0.6,
            background: "var(--glow)",
          },
        }),
      )}
    >
      <span class={css({ marginBottom: "16px", color: "inkSoft", fontFamily: "ui", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.15em" })}>
        {props.mark}
      </span>
      <strong class={css({ textStyle: "hand", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 500, lineHeight: 0.95 })}>
        {props.title}
      </strong>
      <p class={css({ maxWidth: "310px", marginBlock: "12px 20px", fontSize: "0.69rem", lineHeight: 1.55 })}>{props.children}</p>
      <span
        class={css({
          display: "flex",
          alignItems: "center",
          gap: "7px",
          marginTop: "auto",
          paddingBottom: "3px",
          borderBottom: "1px solid currentColor",
          fontSize: "0.62rem",
          fontWeight: 600,
        })}
      >
        {props.cta}
      </span>
    </button>
  );
}
