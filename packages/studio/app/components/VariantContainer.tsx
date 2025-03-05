import { classes } from "react-hook-primitives";
import { makeColor, makeRem } from "@tokens";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

export type VariantContainerPropsNative = JSX.IntrinsicElements["div"];
export type VariantContainerPropsCustom = {
  dxStyle?: "normal" | "alt";
};
export type VariantContainerProps = VariantContainerPropsNative &
  VariantContainerPropsCustom;

const styles = css`
  width: 100%;
  border: 1px solid ${makeColor("neutral-light", { opacity: 0.2 })};
  border-radius: ${makeRem(4)};

  &.normal {
    padding: ${makeRem(16)};
    background: white;
  }

  &.alt {
    padding: ${makeRem(8)};
    background: ${makeColor("neutral-light", { opacity: 0.1 })};
  }
`;

export const VariantContainer = forwardRef<
  HTMLDivElement,
  VariantContainerProps
>(function VariantContainer(
  { children, className, dxStyle = "normal", ...restProps },
  ref
) {
  return (
    <div
      {...restProps}
      className={classes(styles, dxStyle, className)}
      ref={ref}
    >
      {children}
    </div>
  );
});
