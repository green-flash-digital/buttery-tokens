import type { JSX, ReactNode } from "react";
import { forwardRef } from "react";
import type { ModalRef, UseModalOptions } from "react-hook-primitives";
import { classes, ModalProvider, useModalDialog } from "react-hook-primitives";
import { css } from "@linaria/core";
import { makeRem } from "@buttery/studio-tokens";

export type ModalDrawerPropsNative = Omit<
  JSX.IntrinsicElements["dialog"],
  "ref" | "children"
>;
export type ModalDrawerPropsCustom = UseModalOptions & {
  dxVariant: "right-to-left";
  dxSize?: "sm" | "md" | "lg" | "xl";
  children: ReactNode;
};
export type ModalDrawerProps = ModalDrawerPropsNative & ModalDrawerPropsCustom;

export const ModalDrawer = forwardRef<ModalRef, ModalDrawerProps>(
  function ModalDrawer(
    { children, className, dxVariant, dxSize, ...restProps }: ModalDrawerProps,
    ref
  ) {
    const { isOpen, dialogRef, dialogState, closeModal } = useModalDialog({
      ref,
      ...restProps,
    });

    if (!isOpen) return;

    return (
      <dialog
        id={restProps.id}
        ref={dialogRef}
        className={classes(
          styles,
          dxVariant,
          dxSize && {
            [`s-${dxSize}`]: dxSize,
          },
          className
        )}
      >
        <ModalProvider initialState={dialogState} closeModal={closeModal}>
          {children}
        </ModalProvider>
      </dialog>
    );
  }
);
