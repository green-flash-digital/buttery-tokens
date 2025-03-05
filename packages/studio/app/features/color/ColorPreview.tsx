import { useMemo, type ReactNode } from "react";
import { css } from "@linaria/core";
import { classes } from "react-hook-primitives";

import { LayoutConfigSectionPreview } from "~/components/LayoutConfigSectionPreview";
import { LayoutConfigSectionPreviewTitle } from "~/components/LayoutConfigSectionPreviewTitle";

import { ColorPreviewControls } from "./ColorPreviewControls";
import {
  ColorPreviewProvider,
  useColorPreviewContext,
} from "./ColorPreview.context";
import { colorThemeMap } from "./color.utils";

const styles = css`
  position: relative;

  &.light {
    background: ${colorThemeMap.light};

    &::after {
      content: "";
      position: absolute;
      left: 100%;
      top: 0;
      bottom: 0;
      width: 100vw;
      background: white;
    }
  }
  &.dark {
    background: ${colorThemeMap.dark};
  }
`;

const stylesTitle = css`
  justify-content: flex-end;
  background: inherit;
`;

function ColorPreviewContent({ children }: { children: ReactNode }) {
  const { wcagValues } = useColorPreviewContext();
  return (
    <LayoutConfigSectionPreview
      style={{
        background: wcagValues.bgColor,
      }}
      className={classes(styles)}
    >
      {useMemo(
        () => (
          <LayoutConfigSectionPreviewTitle className={stylesTitle}>
            <ColorPreviewControls />
          </LayoutConfigSectionPreviewTitle>
        ),
        []
      )}
      {children}
    </LayoutConfigSectionPreview>
  );
}

export function ColorPreview({ children }: { children: ReactNode }) {
  return (
    <ColorPreviewProvider>
      <ColorPreviewContent>{children}</ColorPreviewContent>
    </ColorPreviewProvider>
  );
}
