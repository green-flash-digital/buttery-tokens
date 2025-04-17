import { classes } from "react-hook-primitives";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

import { makeColor } from "@buttery/studio-tokens";

export type TableHeadPropsNative = JSX.IntrinsicElements["thead"];
export type TableHeadPropsCustom = {
  dxTest?: string;
};
export type TableHeadProps = TableHeadPropsNative & TableHeadPropsCustom;

const styles = css`
  background: ${makeColor("primary-200", { opacity: 0.2 })};
`;

export const TableHead = forwardRef<HTMLTableSectionElement, TableHeadProps>(
  function TableHead({ children, className, ...restProps }, ref) {
    return (
      <thead {...restProps} className={classes(styles, className)} ref={ref}>
        {children}
      </thead>
    );
  }
);
