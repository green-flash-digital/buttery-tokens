import { classes } from "react-hook-primitives";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

import { makeRem } from "@buttery/studio-tokens";

export type InputSectionPropsNative = JSX.IntrinsicElements["div"];
export type InputSectionPropsCustom = {
  /**
   * An optional size for the spacing between input sections
   * @default normal
   */
  dxSize?: "dense" | "normal";
};
export type InputSectionProps = InputSectionPropsNative &
  InputSectionPropsCustom;

const styles = css`
  &.normal {
    & + & {
      margin-top: ${makeRem(32)};
    }
  }
  &.dense {
    & + & {
      margin-top: ${makeRem(24)};
    }
  }
`;

export const InputSection = forwardRef<HTMLDivElement, InputSectionProps>(
  function InputSection(
    { children, className, dxSize = "normal", ...restProps },
    ref
  ) {
    return (
      <div
        {...restProps}
        className={classes(styles, className, dxSize)}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);
