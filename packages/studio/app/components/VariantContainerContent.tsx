import { classes } from "react-hook-primitives";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";
import { makeColor, makeRem } from "@buttery/studio-tokens";

export type VariantContainerContentPropsNative = JSX.IntrinsicElements["div"];
export type VariantContainerContentProps = VariantContainerContentPropsNative;

const styles = css`
  margin-top: ${makeRem(16)};
  padding-top: ${makeRem(16)};
  border-top: ${makeRem(1)} solid
    ${makeColor("neutral-light", { opacity: 0.2 })};
`;

export const VariantContainerContent = forwardRef<
  HTMLDivElement,
  VariantContainerContentProps
>(function VariantContainerContent({ children, className, ...restProps }, ref) {
  return (
    <div {...restProps} className={classes(styles, className)} ref={ref}>
      {children}
    </div>
  );
});
