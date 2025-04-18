import { Isoscribe } from "isoscribe";

export type PopoverTargetAction = "show" | "hide" | "toggle";
export type PopoverState = "auto" | "manual";

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
  popoverState: PopoverState;
};

type EventPopoverToggle = Event & {
  newState: "open" | "closed";
  oldState: "open" | "closed";
};

export class PopoverEngine {
  private _popover: HTMLElement | null = null;
  private _popoverTarget: HTMLButtonElement | null = null;
  private _popoverTargetAction: PopoverTargetAction;

  private _popoverState: PopoverState;
  private _log = new Isoscribe({
    name: "PopoverEngine",
    pillColor: "#cf275b",
  });

  constructor(options?: Partial<PopoverOptions>) {
    this._popoverTargetAction = options?.popoverTargetAction ?? "toggle";
    this._popoverState = "auto";
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
    const event = e as EventPopoverToggle;
    const popover = this._getPopover();

    if (event.newState === "open") {
      popover.ariaExpanded = "true";
    }

    if (event.newState === "closed") {
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
    this._popover.popover = this._popoverState;

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
  }

  show() {
    if (this._isOpen()) return;
    const popover = this._getPopover();
    popover.showPopover();
  }

  async hide() {
    if (!this._isOpen()) return;
    const popover = this._getPopover();
    popover.hidePopover();
  }
}
