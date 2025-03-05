import { css } from "@linaria/core";

import { makeRem } from "@tokens";
import { Button } from "~/components/Button";
import { IconDownload05 } from "~/icons/IconDownload05";
import { IconFloppyDisk } from "~/icons/IconFloppyDisk";

import { useExportStyleGuide } from "./style-guide.useDownload";

const styles = css`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${makeRem(16)};
`;

export function StyleGuideControlBar() {
  const { exportStyleGuide } = useExportStyleGuide();

  return (
    <div className={styles}>
      <Button
        dxVariant="icon"
        DXIcon={IconFloppyDisk}
        dxSize="big"
        dxStyle="outlined"
        dxHelp="Save updates"
      />
      <Button
        dxVariant="icon"
        DXIcon={IconDownload05}
        dxSize="big"
        dxStyle="outlined"
        dxHelp="Export to PDF"
        onClick={exportStyleGuide}
      />
    </div>
  );
}
