import { classes } from "react-hook-primitives";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";
import { makeColor, makeFontWeight, makeRem } from "@buttery/studio-tokens";

export type TableHeadCellPropsNative = JSX.IntrinsicElements["th"];
export type TableHeadCellPropsCustom = {
  dxTest?: string;
};
export type TableHeadCellProps = TableHeadCellPropsNative &
  TableHeadCellPropsCustom;

const styles = css`
  font-size: ${makeRem(14)};
  font-weight: ${makeFontWeight("Mulish-bold")};
  text-align: left;
  padding: 0 ${makeRem(16)};
  height: ${makeRem(40)};
  white-space: nowrap;
  border-bottom: 1px solid ${makeColor("neutral-light", { opacity: 0.1 })};

  & + & {
    border-left: 1px solid ${makeColor("neutral-light", { opacity: 0.1 })};
  }
`;

export const TableHeadCell = forwardRef<
  HTMLTableCellElement,
  TableHeadCellProps
>(function TableHeadCell({ children, className, ...restProps }, ref) {
  return (
    <th {...restProps} className={classes(styles, className)} ref={ref}>
      {children}
    </th>
  );
});
