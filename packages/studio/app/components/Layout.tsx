import { classes } from "react-hook-primitives";
import type { JSX } from "react";
import { forwardRef } from "react";
import { css } from "@linaria/core";

import { makeFontFamily } from "@tokens";

export type LayoutPropsNative = JSX.IntrinsicElements["body"];
export type LayoutProps = LayoutPropsNative;

const bodyStyles = css`
  margin: 0;
  padding: 0;
  overflow-x: hidden;

  * {
    box-sizing: border-box;
    font-family: ${makeFontFamily("Mulish")};
  }
`;

export const Layout = forwardRef<HTMLBodyElement, LayoutProps>(function Layout(
  { children, className, ...restProps },
  ref
) {
  return (
    <body {...restProps} className={classes(bodyStyles, className)} ref={ref}>
      {children}
    </body>
  );
});
