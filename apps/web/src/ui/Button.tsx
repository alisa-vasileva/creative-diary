import { type JSX, splitProps } from "solid-js";
import { cx } from "styled-system/css";
import { button, type ButtonVariantProps } from "styled-system/recipes";

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & ButtonVariantProps;

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["variant", "class"]);
  return <button type="button" {...rest} class={cx(button({ variant: local.variant }), local.class)} />;
}
