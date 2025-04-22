import { classes } from "react-hook-primitives";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";
import { makeReset, makeRem, makeColor } from "@buttery/studio-tokens";

export type ColorSwatchVariantAddPropsNative = JSX.IntrinsicElements["button"];
export type ColorSwatchVariantAddProps = ColorSwatchVariantAddPropsNative;

const styles = css`
  ${makeReset("button")};
  font-size: ${makeRem(12)};
  color: ${makeColor("secondary-700")};
  text-align: left;
`;

export const ColorSwatchVariantAdd = forwardRef<
  HTMLButtonElement,
  ColorSwatchVariantAddProps
>(function ColorSwatchVariantAdd({ children, className, ...restProps }, ref) {
  return (
    <button
      {...restProps}
      type="button"
      className={classes(styles, className)}
      ref={ref}
    >
      Add variant
    </button>
  );
});
