import type { MouseEvent } from "react";
import { Isoscribe } from "isoscribe";

import { AsyncStateQueue } from "./AsyncStateQueue";

export type DialogState = Record<string, unknown>;

export type DialogOptions = {
  /**
   * Option to determine if the dialog should be closed
   * by clicking on the ::backdrop element
   * @default false
   */
  closeOnBackdropClick: boolean;
  /**
   * The default functionality of a dialog is to close on the
   * press of the escape key. There are instances where we don't want to close
   * the dialog either due to other escape key listeners for popovers or for
   * other reasons such as destructive actions during wizards in dialogs.
   * Adding this pop will disable the functionality of closing the dialog
   * with the escape key
   * @default false
   */
  disableCloseOnEscapePress: boolean;
};

export type DialogProperties<T extends DialogState = DialogState> = {
  open: (e: MouseEvent<HTMLButtonElement>, state?: T) => void;
  close: () => void;
};

export class DialogEngine<
  T extends DialogState = DialogState,
> extends AsyncStateQueue<T> {
  protected _dialogNode: HTMLDialogElement | null = null;
  protected _options: DialogOptions;
  protected _isOpen: boolean = false;

  constructor(options?: Partial<DialogOptions>) {
    const log = new Isoscribe({
      name: "DialogEngine",
      pillColor: "#2bac99",
      logLevel: "debug",
    });
    super({} as T, log);
    this._options = {
      closeOnBackdropClick: options?.closeOnBackdropClick ?? false,
      disableCloseOnEscapePress: options?.disableCloseOnEscapePress ?? false,
    };
  }

  protected _setNode(node: HTMLDialogElement) {
    this._dialogNode = node;
  }

  protected _getDialog() {
    const dialog = this._dialogNode;
    if (!dialog) throw "Unable to get dialog. Dialog node not set.";
    return dialog;
  }

  protected _closeDialog() {
    const dialog = this._getDialog();
    dialog.close();
  }
}
