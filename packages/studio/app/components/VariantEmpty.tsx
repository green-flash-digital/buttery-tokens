import { classes } from "react-hook-primitives";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";

import { makeColor, makeRem } from "@buttery/studio-tokens";
import { IconPlusSign } from "~/icons/IconPlusSign";

import { Button } from "./Button";

export type VariantEmptyPropsNative = Omit<
  JSX.IntrinsicElements["div"],
  "children"
>;
export type VariantEmptyPropsCustom = {
  /**
   * the text that will describe the empty state
   */
  dxMessage: string;
  /**
   * The text that will be displayed on the action button
   */
  dxActionMessage: string;
  /**
   * The click handler for getting out of the empty state
   */
  dxOnAdd: () => void;
};
export type VariantEmptyProps = VariantEmptyPropsNative &
  VariantEmptyPropsCustom;

const styles = css`
  padding: ${makeRem(16)};
  width: 100%;
  display: grid;
  grid-template-rows: auto auto;
  gap: ${makeRem(8)};
  justify-items: center;
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: ${makeRem(4)};
  border: 1px dashed ${makeColor("neutral-light", { opacity: 0.2 })};

  .message {
    padding: ${makeRem(8)};
    color: ${makeColor("neutral-dark")};
    font-size: ${makeRem(14)};
  }
`;

export const VariantEmpty = forwardRef<HTMLDivElement, VariantEmptyProps>(
  function VariantEmpty(
    { className, dxMessage, dxOnAdd, dxActionMessage, ...restProps },
    ref
  ) {
    return (
      <div {...restProps} className={classes(styles, className)} ref={ref}>
        <div className="message">{dxMessage}</div>
        <div>
          <Button
            dxVariant="outlined"
            dxColor="secondary"
            DXIconStart={IconPlusSign}
            onClick={dxOnAdd}
          >
            {dxActionMessage}
          </Button>
        </div>
      </div>
    );
  }
);
