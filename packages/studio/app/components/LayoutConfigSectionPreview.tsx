import { classes } from "react-hook-primitives";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

import { makeCustom, makeRem } from "@buttery/studio-tokens";

export type LayoutConfigSectionPreviewPropsNative =
  JSX.IntrinsicElements["div"];
export type LayoutConfigSectionPreviewProps =
  LayoutConfigSectionPreviewPropsNative;

const styles = css`
  & > * {
    position: sticky;
    top: ${makeRem(133)};
    padding: 0 ${makeCustom("layout-gutters")};
    padding-bottom: ${makeCustom("layout-gutters")};
    background: inherit;

    &.full {
      min-height: 100%;
    }
  }
`;

export const LayoutConfigSectionPreview = forwardRef<
  HTMLDivElement,
  LayoutConfigSectionPreviewProps
>(function LayoutConfigSectionPreview(
  { children, className, ...restProps },
  ref
) {
  return (
    <div {...restProps} className={classes(styles, className)} ref={ref}>
      <div>{children}</div>
    </div>
  );
});
