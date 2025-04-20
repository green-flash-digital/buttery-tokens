import { Isoscribe } from "isoscribe";
import { exhaustiveMatchGuard, generateGUID } from "ts-jolt/isomorphic";

import type { SetAsyncStateQueueState } from "./AsyncStateQueue";
import { AsyncStateQueue } from "./AsyncStateQueue";

export type PopoverTargetAction = "show" | "hide" | "toggle";
export type PopoverType = "auto" | "manual" | "hint";
export type PopoverPosition =
  | "top"
  | "top-left"
  | "top-right"
  | "top-span-right"
  | "top-span-left"
  | "right"
  | "right-span-top"
  | "right-span-bottom"
  | "bottom-right"
  | "bottom"
  | "bottom-left"
  | "bottom-span-right"
  | "bottom-span-left"
  | "left"
  | "left-span-top"
  | "left-span-bottom";
export type PopoverOrigin =
  | "top-left"
  | "top"
  | "top-right"
  | "right-center"
  | "bottom-right"
  | "bottom"
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

export class Popover {
  private _popover: HTMLElement | null = null;
  private _popoverTarget: HTMLButtonElement | null = null;
  private _popoverTargetAction: PopoverTargetAction;
  private _popoverType: PopoverType;
  private _log = new Isoscribe({
    name: "PopoverEngine",
    pillColor: "#cf275b",
    logLevel: "debug",
  });
  protected _queue: AsyncStateQueue<PopoverState>;
  setState: SetAsyncStateQueueState<PopoverState>;

  constructor(options?: Partial<PopoverOptions>) {
    const initState: PopoverState = {
      position: options?.popoverPosition,
      origin: options?.popoverOrigin ?? "top-right",
      offset: 0,
    };
    this._queue = new AsyncStateQueue(initState, this._log);
    this._popoverTargetAction = options?.popoverTargetAction ?? "toggle";
    this._popoverType = "auto";

    this.setPopover = this.setPopover.bind(this);
    this.setPopoverTarget = this.setPopoverTarget.bind(this);
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this.setState = this._queue.setState;
  }

  protected get _currentState() {
    return this._queue.getState();
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
    return this._popoverTarget;
  }

  private _onToggle = (e: Event) => {
    const event = e as ToggleEvent;
    const popover = this._getPopover();
    const popoverTarget = this._getPopoverTarget();

    if (event.newState === "open") {
      this._log.debug("Showing popover");
      popover.ariaExpanded = "true";
    }

    if (event.newState === "closed") {
      this._log.debug("Hiding popover");
      popover.ariaExpanded = "false";
      popoverTarget.style.removeProperty("anchorName");
      popoverTarget.style.removeProperty("fixed");
      popoverTarget.style.removeProperty("positionAnchor");
    }
  };

  protected _isOpen() {
    const popover = this._getPopover();
    return popover.matches(":popover-open");
  }

  private _browserSupportsPositionArea() {
    const popover = this._getPopover();
    const supportsPositionArea = "positionArea" in popover.style;
    return supportsPositionArea;
  }

  private _calculatePosition() {
    if (!this._currentState.position) {
      this._log.debug("No position set. Skipping positional calculations");
    }
    const popover = this._getPopover();
    const popoverTarget = this._getPopoverTarget();
    const canUseCSS = this._browserSupportsPositionArea();

    if (canUseCSS) {
      const anchorName = `--${generateGUID()}`;
      popoverTarget.style.anchorName = anchorName;
      popover.style.margin = 0;
      popover.style.position = "fixed";
      popover.style.positionAnchor = anchorName;
    }

    switch (this._currentState.position) {
      case "top-left":
        if (!canUseCSS) return;
        popover.style.positionArea = "top span-right";
        break;

      case "top-right":
        if (!canUseCSS) return;
        popover.style.positionArea = "top span-left";
        break;

      case "top":
        if (!canUseCSS) return;
        popover.style.positionArea = "top";
        break;

      case "bottom":
        if (!canUseCSS) return;
        popover.style.positionArea = "bottom";
        break;

      case "bottom-left":
        if (!canUseCSS) return;
        popover.style.positionArea = "bottom span-right";
        break;

      case "bottom-right":
        if (!canUseCSS) return;
        popover.style.positionArea = "bottom span-left";
        break;

      case "left-bottom":
        if (!canUseCSS) return;
        popover.style.positionArea = "bottom right";
        break;

      case "left":
        if (!canUseCSS) return;
        popover.style.positionArea = "left";
        break;

      case "left-top":
        if (!canUseCSS) return;
        popover.style.positionArea = "left";
        break;

      case "right":
        if (!canUseCSS) return;
        popover.style.positionArea = "right";
        break;

      default:
        exhaustiveMatchGuard(this._currentState.position);
    }
  }

  setPosition(position: PopoverPosition) {
    this.setState((draft) => {
      draft.position = position;
    });
  }

  setOrigin(origin: PopoverOrigin) {
    this.setState((draft) => {
      draft.origin = origin;
    });
  }

  setOffset(offset: number) {
    this.setState((draft) => {
      draft.offset = offset;
    });
  }

  getQueue() {
    return this._queue;
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
    this._calculatePosition();
    popover.showPopover();
  }

  async hide() {
    if (!this._isOpen()) return;
    const popover = this._getPopover();
    popover.hidePopover();
  }

  getState() {
    return this._queue.getState();
  }
}

export const popoverPosition: PopoverPosition[] = [
  "bottom",
  "bottom-left",
  "bottom-right",
  "bottom-span-left",
  "bottom-span-right",
  "left",
  "left-span-bottom",
  "left-span-top",
  "right",
  "right-span-bottom",
  "right-span-top",
  "top",
  "top-left",
  "top-right",
  "top-span-left",
  "top-span-right",
];

export const popoverOrigin: PopoverOrigin[] = [
  "bottom",
  "bottom-left",
  "bottom-right",
  "left-center",
  "right-center",
  "top",
  "top-left",
  "top-right",
];
