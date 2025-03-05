import { classes } from "react-hook-primitives";
import { makeReset, makeRem } from "@tokens";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type ColorSwatchVariantListPropsNative = JSX.IntrinsicElements["ul"];
export type ColorSwatchVariantListProps = ColorSwatchVariantListPropsNative;

const styles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  gap: ${makeRem(4)};
  width: 100%;

  li {
    display: grid;
    grid-template-columns: 1fr auto;
    width: 100%;
    gap: ${makeRem(8)};
    align-items: center;
  }
`;

export const ColorSwatchVariantList = forwardRef<
  HTMLUListElement,
  ColorSwatchVariantListProps
>(function ColorSwatchVariantList({ children, className, ...restProps }, ref) {
  return (
    <ul {...restProps} className={classes(styles, className)} ref={ref}>
      {children}
    </ul>
  );
});
