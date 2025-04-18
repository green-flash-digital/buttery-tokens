import { classes } from "react-hook-primitives";
import { css } from "@linaria/core";
import { forwardRef } from "react";
import { makeRem } from "@buttery/studio-tokens";

import type { NavTabsProps } from "~/components/NavTabs";
import { NavTabs } from "~/components/NavTabs";

const styles = css`
  margin: ${makeRem(20)} 0;
`;

export const ColorSwatchTabs = forwardRef<
  HTMLElement,
  Omit<NavTabsProps, "dxColor" | "dxSize">
>(function ColorSwatchTabs(
  { children, className, dxInitActiveTab, ...restProps },
  ref
) {
  return (
    <NavTabs
      {...restProps}
      dxInitActiveTab={dxInitActiveTab}
      className={classes(styles, className)}
      ref={ref}
      dxSize="dense"
      dxColor="secondary"
    >
      {children}
    </NavTabs>
  );
});
