import { classes } from "react-hook-primitives";
import { css } from "@linaria/core";
import type { JSX } from "react";
import { forwardRef } from "react";
import { match } from "ts-pattern";
import {
  makeColor,
  makeFontWeight,
  makeRem,
  makeReset,
} from "@buttery/studio-tokens";

import type { IconDashboardSquareAdd } from "~/icons/IconDashboardSquareAdd";

import type { ButtonSharedProps } from "./button.utils";

export type ButtonRegularPropsNative = JSX.IntrinsicElements["button"];
export type ButtonRegularPropsCustom = ButtonSharedProps & {
  /**
   * The style of the button
   * @default contained
   */
  dxVariant: "contained" | "outlined" | "text";
  /**
   * The color of the button
   * @default primary
   */
  dxColor?: "primary" | "secondary";
  /**
   * A node (typically an icon) to put at the
   * start of the button content
   */
  DXIconStart?: typeof IconDashboardSquareAdd;
};
export type ButtonRegularProps = ButtonRegularPropsNative &
  ButtonRegularPropsCustom;

const styles = css`
  ${makeReset("button")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s ease-in-out;

  &:active {
    scale: 0.97;
  }

  &.v {
    &-contained {
      border-radius: ${makeRem(8)};
      line-height: 1;
      &.c {
        &-primary {
          background: ${makeColor("primary")};
          color: ${makeColor("neutral-dark")};
        }
        &-secondary {
          background: ${makeColor("secondary")};
          color: ${makeColor("neutral-dark")};
        }
      }
    }
    &-outlined {
      border-radius: ${makeRem(8)};
      line-height: 1;
      &.c {
        &-primary {
          border: ${makeRem(1)} solid ${makeColor("primary-600")};
          color: ${makeColor("primary-600")};
          &:hover {
            color: ${makeColor("primary-900")};
          }
        }
        &-secondary {
          border: ${makeRem(1)} solid ${makeColor("secondary-600")};
          color: ${makeColor("secondary-600")};
          &:hover {
            color: ${makeColor("secondary-900")};
            border-color: ${makeColor("secondary-900")};
          }
        }
      }
    }
    &-text {
      &.c {
        &-primary {
        }
        &-secondary {
          color: ${makeColor("secondary-800")};
        }
      }
    }
  }

  &.s {
    &-dense {
      height: ${makeRem(24)};
      font-size: ${makeRem(10)};
      padding: 0 ${makeRem(16)};
      gap: ${makeRem(4)};
    }
    &-normal {
      height: ${makeRem(32)};
      font-size: ${makeRem(12)};
      font-weight: ${makeFontWeight("Mulish-medium")};
      padding: 0 ${makeRem(16)};
      gap: ${makeRem(8)};
    }
    &-big {
      height: ${makeRem(44)};
      font-size: ${makeRem(14)};
      font-weight: ${makeFontWeight("Mulish-medium")};
      padding: 0 ${makeRem(20)};
      gap: ${makeRem(10)};
    }
  }
`;

export function createButtonClassNames({
  dxColor,
  dxVariant,
  dxSize,
}: Required<Omit<ButtonRegularPropsCustom, "DXIconStart">>): string {
  return classes({
    [`c-${dxColor}`]: dxColor,
    [`s-${dxSize}`]: dxSize,
    [`v-${dxVariant}`]: dxVariant,
  });
}

export function createButtonStyles(
  args: Required<Omit<ButtonRegularPropsCustom, "DXIconStart">>
): string {
  return classes(styles, createButtonClassNames(args));
}

export const ButtonRegular = forwardRef<HTMLButtonElement, ButtonRegularProps>(
  function ButtonRegular(
    {
      children,
      className,
      dxColor = "primary",
      dxVariant = "contained",
      dxSize = "normal",
      type = "button",
      DXIconStart = null,
      ...restProps
    },
    ref
  ) {
    return (
      <button
        {...restProps}
        ref={ref}
        type={type}
        className={classes(
          createButtonStyles({ dxColor, dxSize, dxVariant }),
          className
        )}
      >
        {DXIconStart && (
          <DXIconStart
            dxSize={match(dxSize)
              .with("dense", () => 12)
              .with("normal", () => 16)
              .with("big", () => 20)
              .exhaustive()}
          />
        )}
        {children}
      </button>
    );
  }
);
