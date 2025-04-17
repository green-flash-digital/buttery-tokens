import { classes } from "react-hook-primitives";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

import { makeReset, makeRem } from "@buttery/studio-tokens";
import { IconDelete } from "~/icons/IconDelete";

export type ColorSwatchVariantRemovePropsNative =
  JSX.IntrinsicElements["button"];
export type ColorSwatchVariantRemovePropsCustom = {
  dxIsVisible: boolean;
};
export type ColorSwatchVariantRemoveProps =
  ColorSwatchVariantRemovePropsNative & ColorSwatchVariantRemovePropsCustom;

const styles = css`
  ${makeReset("button")};
  width: ${makeRem(24)};
  aspect-ratio: 1 / 1;
`;

export const ColorSwatchVariantRemove = forwardRef<
  HTMLButtonElement,
  ColorSwatchVariantRemoveProps
>(function ColorSwatchVariantRemove(
  { children, className, dxIsVisible, ...restProps },
  ref
) {
  if (!dxIsVisible) return <div />;
  return (
    <button
      {...restProps}
      type="button"
      className={classes(styles, className)}
      ref={ref}
    >
      <IconDelete dxSize={12} />
    </button>
  );
});
