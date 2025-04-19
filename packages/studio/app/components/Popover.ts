import { Isoscribe } from "isoscribe";

import { AsyncStateQueue } from "./AsyncStateQueue";

export type PopoverTargetAction = "show" | "hide" | "toggle";
export type PopoverType = "auto" | "manual" | "hint";
export type PopoverPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "right-top"
  | "right-middle"
  | "right-bottom"
  | "bottom-right"
  | "bottom-center"
  | "bottom-left"
  | "left-bottom"
  | "left-middle"
  | "left-top";
export type PopoverOrigin =
  | "top-left"
  | "top-center"
  | "top-right"
  | "right-center"
  | "bottom-right"
  | "bottom-center"
  | "bottom-left"
  | "left-center";
export type PopoverOffset = number;

export type PopoverOptions = {
  popoverTargetAction: PopoverTargetAction;
  /**
   * ### `auto`
   * - Auto state is useful when you only want to show a single popover at once.
   * - The popover can be "light dismissed" — this means that you can hide the popover by clicking outside it.
   * - The popover can also be closed, using browser-specific mechanisms such as pressing the Esc key.
   * - Usually, only one auto popover can be shown at a time — showing a second popover when one is already shown will hide the first one. The exception to this rule is when you have nested auto popovers
   *
   * ### `manual`
   * - The popover cannot be "light dismissed", although declarative show/hide/toggle buttons (as seen earlier) will still work.
   * - Multiple independent popovers can be shown simultaneously.
   *
   * ## Docs
   * https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using#auto_state_and_light_dismiss
   *
   * @default auto
   */
  popoverState: PopoverType;
  /**
   * Positions the popover relative to place on target
   *
   * This API abstracts some of the nuance associated with position the element and attempts to
   * bridge the knowledge gap with human readable semantics without having to do a lot of CSS / JS
   * gymnastics
   *
   * The API reads... "Position the popover's` `<popover-origin>` at/on the target's `<popover-position>`":
   * @default `right-top`
   */
  popoverPosition: PopoverPosition;
  /**
   * The point on the popover that should be aligned with the position. This option will only take effect
   * if a position is set on the popover.
   *
   * The API reads... "Position the popover's` <popover-origin>` at/on the target's `<popover-position>`":
   * @default `top-right`
   */
  popoverOrigin: PopoverOrigin;
};

type PopoverState = {
  position: PopoverPosition | undefined;
  origin: PopoverOrigin;
  offset: number;
};

export class Popover extends AsyncStateQueue<PopoverState> {
  private _popover: HTMLElement | null = null;
  private _popoverTarget: HTMLButtonElement | null = null;
  private _popoverTargetAction: PopoverTargetAction;
  private _popoverType: PopoverType;

  constructor(options?: Partial<PopoverOptions>) {
    const initState: PopoverState = {
      position: options?.popoverPosition,
      origin: options?.popoverOrigin ?? "top-right",
      offset: 0,
    };
    const log = new Isoscribe({
      name: "PopoverEngine",
      pillColor: "#cf275b",
      logLevel: "debug",
    });
    super(initState, log);
    this._log = log;
    this._popoverTargetAction = options?.popoverTargetAction ?? "toggle";
    this._popoverType = "auto";
    this._state = {
      position: options?.popoverPosition,
      origin: options?.popoverOrigin ?? "top-right",
      offset: 0,
    };
    this.setPopover = this.setPopover.bind(this);
    this.setPopoverTarget = this.setPopoverTarget.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  protected _getPopover() {
    if (!this._popover) {
      throw "Cannot get the popover. Popover has not been set.";
    }
    return this._popover;
  }

  protected _getPopoverTarget() {
    if (!this._popoverTarget) {
      throw "Cannot get the popover target. Popover target has not been set.";
    }
  }

  private _onToggle = (e: Event) => {
    const event = e as ToggleEvent;
    const popover = this._getPopover();

    if (event.newState === "open") {
      this._log.debug("Showing popover");
      popover.ariaExpanded = "true";
    }

    if (event.newState === "closed") {
      this._log.debug("Hiding popover");
      popover.ariaExpanded = "false";
    }
  };

  protected _isOpen() {
    const popover = this._getPopover();
    return popover.matches(":popover-open");
  }

  setPopover(node: HTMLElement | null) {
    if (!node) return;
    this._popover = node;
    this._popover.popover = this._popoverType;
    this._log.debug("Setting popover node", node);

    this._popover.addEventListener("toggle", this._onToggle);

    return () => {
      if (!this._popover) return;
      this._popover.removeEventListener("toggle", this._onToggle);
    };
  }

  setPopoverTarget(node: HTMLButtonElement | null) {
    if (!node) return;
    this._popoverTarget = node;
    this._popoverTarget.popoverTargetAction = this._popoverTargetAction;
    this._log.debug("Setting popover target node", node);
  }

  show() {
    if (this._isOpen()) return;
    const popover = this._getPopover();
    // this._calculatePosition();
    popover.showPopover();
  }

  async hide() {
    if (!this._isOpen()) return;
    const popover = this._getPopover();
    popover.hidePopover();
  }
}

export const popoverPosition: PopoverPosition[] = [
  "bottom-center",
  "bottom-left",
  "bottom-right",
  "left-bottom",
  "left-middle",
  "left-top",
  "right-bottom",
  "right-middle",
  "right-top",
  "top-center",
  "top-left",
  "top-right",
];

export const popoverOrigin: PopoverOrigin[] = [
  "bottom-center",
  "bottom-left",
  "bottom-right",
  "left-center",
  "right-center",
  "top-center",
  "top-left",
  "top-right",
];
