import { css } from "@linaria/core";
import { makeCustom } from "@buttery/studio-tokens";

import { Button } from "~/components/Button";
import { ModalHeader } from "~/components/ModalHeader";
import { CodeBlock } from "~/components/CodeBlock";
import { IconCode } from "~/icons/IconCode";
import { useModal } from "~/components/Modal.useModal";
import { Modal } from "~/components/Modal";

import { useConfigurationContext } from "./Config.context";

const codeStyles = css`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: ${makeCustom("modal-gutters")};
`;

const styles = css`
  && {
    height: 100%;
    display: grid;
    grid-template-rows: auto auto 1fr;
    overflow: hidden;
  }
`;

export function ConfigJSON() {
  const modal = useModal();
  const { getConfigFromState } = useConfigurationContext();
  const config = getConfigFromState();

  return (
    <>
      <Button dxVariant="outlined" DXIconStart={IconCode} onClick={modal.open}>
        JSON
      </Button>
      <Modal
        ref={modal.onMount}
        dxType="drawer"
        dxEngine={modal}
        dxVariant="right-to-left"
        dxSize="md"
        className={styles}
      >
        <ModalHeader dxSubtitle="Below you'll find the code representation of the configuration. You can copy and paste this into your `buttery-tokens.config.json` file or you can use one of the other buttons to save it.">
          Buttery Tokens Configuration
        </ModalHeader>
        <CodeBlock
          className={codeStyles}
          dxCode={JSON.stringify(config, null, 2)}
          dxOptions={{ lang: "json" }}
        />
      </Modal>
    </>
  );
}
