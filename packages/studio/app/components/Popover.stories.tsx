import type { Meta } from "@storybook/react";
import { css } from "@linaria/core";

import { Button } from "./Button";
import { Popover } from "./Popover";
import { usePopover } from "./Popover.usePopover";

const meta: Meta = {
  title: "Popover / Engine",
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof meta>;

export default meta;

const styles = css`
  // When the popover is opened
  &:popover-open {
    opacity: 1;
    transform: scale(1);
  }

  // Closed styles
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.1s allow-discrete;

  @starting-style {
    &:popover-open {
      opacity: 0;
      transform: scale(0.9);
    }
  }
`;

const PopoverInstance = new Popover();
export const WithInstance = () => {
  return (
    <>
      <Button
        dxSize="normal"
        dxColor="secondary"
        dxVariant="contained"
        onClick={PopoverInstance.show}
        ref={PopoverInstance.setPopoverTarget}
      >
        Open Popover
      </Button>
      <div ref={PopoverInstance.setPopover} className={styles}>
        <h3>I'm a popover</h3>
        <button onClick={PopoverInstance.hide}>Close me</button>
      </div>
    </>
  );
};

export const WithHook = () => {
  const popover = usePopover();
  return (
    <>
      <Button
        dxSize="normal"
        dxColor="secondary"
        dxVariant="contained"
        onClick={popover.show}
        ref={popover.setPopoverTarget}
      >
        Open Popover
      </Button>
      <div ref={popover.setPopover} className={styles}>
        <h3>I'm a popover</h3>
        <button onClick={popover.hide}>Close me</button>
      </div>
    </>
  );
};

export const Positioning = () => {
  const popover = usePopover();

  return (
    <>
      <Button
        dxSize="normal"
        dxColor="secondary"
        dxVariant="contained"
        onClick={popover.show}
        ref={popover.setPopoverTarget}
      >
        Open Popover
      </Button>
      <div ref={popover.setPopover} className={styles}>
        <h3>I'm a popover</h3>
        <button onClick={popover.hide}>Close me</button>
      </div>
    </>
  );
};
