import { classes, useDropdownMenu } from "react-hook-primitives";
import type { JSX } from "react";
import { forwardRef } from "react";
import { css } from "@linaria/core";
import { makeColor, makeRem, makeReset } from "@tokens";

import { IconArrowDown } from "~/icons/IconArrowDown";

import { Button } from "./Button";
import { createDropdownStyles } from "./shared-styles";
import { ButtonDropdownProvider } from "./ButtonDropdown.context";
import type { ButtonRegularPropsCustom } from "./ButtonRegular";

export type ButtonDropdownPropsNative = Omit<
  JSX.IntrinsicElements["button"],
  "className"
>;
export type ButtonDropdownPropsCustom = ButtonRegularPropsCustom & {
  /**
   * The label of the button that isn't the dropdown
   */
  dxLabel: string;
};
export type ButtonDropdownProps = ButtonDropdownPropsNative &
  ButtonDropdownPropsCustom;

export const buttonDropdownClassName = "btn-dropdown";

const styles = css`
  display: grid;
  grid-template-columns: auto auto;
  height: min-content;
  width: max-content;

  & > button {
    &:nth-child(1) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;

      &.v {
        &-contained {
          border-right: ${makeRem(1)} solid white;
        }
      }

      &.v {
        &-outlined {
          border-right: 0;
        }
      }
    }
    &:nth-child(2) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: 0;
      padding: 0;
      aspect-ratio: 1 / 1;
      display: grid;
      place-content: center;
    }
  }
`;

const dropdownStyles = createDropdownStyles(css`
  display: none;

  &:popover-open {
    display: block;
  }

  ${makeReset("ul")};
  border-radius: ${makeRem(4)} !important;

  &.c-primary {
    border: ${makeRem(1)} solid ${makeColor("primary")};
  }
  &.c-secondary {
    border: ${makeRem(1)} solid ${makeColor("secondary")};
  }

  button {
    ${makeReset("button")};
    white-space: nowrap;
  }

  &.s-dense {
    padding: ${makeRem(4)};

    button {
      font-size: ${makeRem(10)};
      padding: ${makeRem(4)} ${makeRem(8)};
    }
  }

  &.s-normal {
    padding: ${makeRem(4)};

    button {
      font-size: ${makeRem(12)};
      padding: ${makeRem(4)} ${makeRem(12)};
    }
  }
`);

export type ButtonDropdownOptionProps = {
  onClose: () => void;
};

export const ButtonDropdown = forwardRef<
  HTMLButtonElement,
  ButtonDropdownProps
>(function ButtonDropdown(
  {
    children,
    dxLabel,
    DXIconStart,
    dxColor = "primary",
    dxVariant = "contained",
    dxSize = "normal",
    ...restProps
  },
  ref
) {
  const { closeMenu, setTargetRef, setDropdownRef, alignmentRef } =
    useDropdownMenu<HTMLDivElement, HTMLDivElement>({
      dxOffset: 4,
      dxPosition: "bottom-right",
    });

  return (
    <div
      className={classes(buttonDropdownClassName, styles)}
      ref={alignmentRef}
    >
      <Button
        ref={ref}
        dxColor={dxColor}
        dxSize={dxSize}
        dxVariant={dxVariant}
        {...restProps}
      >
        {dxLabel}
      </Button>
      <Button
        ref={setTargetRef}
        dxColor={dxColor}
        dxSize={dxSize}
        dxVariant={dxVariant}
      >
        <IconArrowDown dxSize={dxSize === "dense" ? 12 : 14} />
      </Button>
      <div
        ref={setDropdownRef}
        className={classes(dropdownStyles, "btn-dropdown")}
      >
        <ButtonDropdownProvider closeDropdown={closeMenu}>
          {children}
        </ButtonDropdownProvider>
      </div>
    </div>
  );
});
