import { classes } from "react-hook-primitives";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

import { makeReset, makeRem } from "@buttery/studio-tokens";

export type DropdownMenuPropsNative = JSX.IntrinsicElements["ul"];
export type DropdownMenuProps = DropdownMenuPropsNative;

const styles = css`
  ${makeReset("ul")};
  min-width: ${makeRem(300)};
  padding: ${makeRem(8)};
`;

export const DropdownMenu = forwardRef<HTMLUListElement, DropdownMenuProps>(
  function DropdownMenu({ children, className, ...restProps }, ref) {
    return (
      <ul {...restProps} className={classes(styles, className)} ref={ref}>
        {children}
      </ul>
    );
  }
);
