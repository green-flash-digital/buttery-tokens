import { classes } from "react-hook-primitives";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

import { makeReset, makeRem } from "@buttery/studio-tokens";

export type VariantListPropsNative = JSX.IntrinsicElements["ul"];
export type VariantListProps = VariantListPropsNative;

const styles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  gap: ${makeRem(8)};
`;

export const VariantList = forwardRef<HTMLUListElement, VariantListProps>(
  function VariantList({ children, className, ...restProps }, ref) {
    return (
      <ul {...restProps} className={classes(styles, className)} ref={ref}>
        {children}
      </ul>
    );
  }
);
