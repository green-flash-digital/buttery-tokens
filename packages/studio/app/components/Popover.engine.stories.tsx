import type { Meta } from "@storybook/react";
import { css } from "@linaria/core";

import { Button } from "./Button";
import { PopoverEngine } from "./PopoverEngine";

const meta: Meta = {
  title: "Popover Engine",
} satisfies Meta<typeof meta>;

export default meta;

const PopoverEngineBasic = new PopoverEngine();

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

export const Basic = () => {
  return (
    <>
      <Button
        dxSize="normal"
        dxColor="secondary"
        dxVariant="contained"
        onClick={PopoverEngineBasic.show}
        ref={PopoverEngineBasic.setPopoverTarget}
      >
        Open Popover
      </Button>
      <div ref={PopoverEngineBasic.setPopover} className={styles}>
        <h3>I'm a popover</h3>
        <button onClick={PopoverEngineBasic.hide}>Close me</button>
      </div>
    </>
  );
};
