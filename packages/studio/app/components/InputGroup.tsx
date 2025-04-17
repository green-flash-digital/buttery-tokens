import { classes } from "react-hook-primitives";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

import { makeRem } from "@buttery/studio-tokens";

export type InputGroupPropsNative = JSX.IntrinsicElements["div"];
// export type InputGroupPropsCustom = {};
export type InputGroupProps = InputGroupPropsNative;

const styles = css`
  display: flex;
  flex-direction: column;
  gap: ${makeRem(16)};
`;

export const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroup({ children, className, ...restProps }, ref) {
    return (
      <div {...restProps} className={classes(styles, className)} ref={ref}>
        {children}
      </div>
    );
  }
);
