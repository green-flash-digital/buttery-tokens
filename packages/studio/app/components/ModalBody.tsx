import { classes } from "react-hook-primitives";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";
import { makeCustom } from "@buttery/studio-tokens";

export type ModalBodyPropsNative = JSX.IntrinsicElements["div"];
export type ModalBodyPropsCustom = {
  dxNoGutters?: boolean;
};
export type ModalBodyProps = ModalBodyPropsNative & ModalBodyPropsCustom;

export const modalBodyClassName = "modal-body";

const styles = css`
  padding: 0 ${makeCustom("modal-gutters")};
`;

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  function ModalBody({ children, className, ...restProps }, ref) {
    return (
      <div
        {...restProps}
        className={classes(modalBodyClassName, styles, className)}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);
