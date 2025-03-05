import type { JSX } from "react";
import { forwardRef } from "react";
import { css } from "@linaria/core";
import { classes } from "react-hook-primitives";

export type LayoutMainPropsNative = JSX.IntrinsicElements["main"];
export type LayoutMainProps = LayoutMainPropsNative;

const styles = css`
  background: #fafafa;
`;

export const LayoutMain = forwardRef<HTMLElement, LayoutMainProps>(
  function LayoutMain({ children, className, ...restProps }, ref) {
    return (
      <main {...restProps} className={classes(styles, className)} ref={ref}>
        {children}
      </main>
    );
  }
);
