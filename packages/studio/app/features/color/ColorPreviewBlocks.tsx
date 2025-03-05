import { makeColor, makeFontFamily, makeFontWeight, makeRem } from "@tokens";
import { css } from "@linaria/core";
import type { JSX } from "react";
import {
  ColorAccessibilityChecker,
  getAccessibleTextColor,
} from "@buttery/core";
import { classes } from "react-hook-primitives";

import { IconTick01 } from "~/icons/IconTick01";
import { IconCancel } from "~/icons/IconCancel";

import { useColorPreviewContext } from "./ColorPreview.context";

const blockStyles = css`
  height: 100%;
  width: 100%;
  font-family: ${makeFontFamily("Consolas")};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .color {
    height: 100%;
    width: 100%;
    padding: ${makeRem(8)};
    font-family: ${makeFontFamily("Consolas")};
    height: ${makeRem(60)};
    background: var(--block-color);
  }

  .name {
    font-family: ${makeFontFamily("Consolas")};
    font-size: ${makeRem(12)};
  }

  .wcag {
    padding: ${makeRem(8)};
    font-size: ${makeRem(12)};
    border: 1px solid var(--block-color);
    border-top: 0;
    border-bottom-left-radius: inherit;
    border-bottom-right-radius: inherit;
    display: flex;
    flex-direction: column;
    gap: ${makeRem(8)};
    text-align: center;

    .ratio {
      text-decoration: underline;
      font-weight: ${makeFontWeight("Mulish-semiBold")};
    }

    .level {
      border: 1px solid ${makeColor("neutral-light", { opacity: 0.2 })};
      border-radius: ${makeRem(8)};
      padding: ${makeRem(4)};
      height: ${makeRem(20)};
      display: flex;
      align-items: center;
      justify-content: center;
      gap: ${makeRem(4)};
      font-weight: ${makeFontWeight("Mulish-medium")};

      &.pass {
        background-color: ${makeColor("success", { opacity: 0.2 })};
      }
      &.fail {
        background-color: ${makeColor("danger", { opacity: 0.2 })};
      }
    }
  }

  &:not(:last-child) {
    .wcag {
      border-right: 0;
    }
  }
`;

const checker = new ColorAccessibilityChecker();

function ColorBlock({
  dxHex,
  dxName,
  showWCAG,
  bgHex,
  fontSize,
  ...restProps
}: JSX.IntrinsicElements["div"] & {
  dxHex: string;
  dxName: string;
  showWCAG: boolean;
  bgHex: string;
  fontSize: number;
}) {
  const colorWcag = checker.analyze(dxHex, bgHex, fontSize);

  return (
    <div
      {...restProps}
      className={blockStyles}
      style={{
        // @ts-expect-error custom properties are still appropriate
        "--block-color": dxHex,
      }}
    >
      <div className="color">
        <div style={{ color: getAccessibleTextColor(dxHex) }} className="name">
          {dxName}
        </div>
      </div>
      {showWCAG && (
        <div className="wcag">
          <div className="ratio">{colorWcag.compliance.contrast}</div>
          <div
            className={classes(
              "level",
              colorWcag.compliance.AA ? "pass" : "fail"
            )}
          >
            AA:{" "}
            {colorWcag.compliance.AA ? (
              <IconTick01 dxSize={10} />
            ) : (
              <IconCancel dxSize={10} />
            )}
          </div>
          <div
            className={classes(
              "level",
              colorWcag.compliance.AAA ? "pass" : "fail"
            )}
          >
            AAA:{" "}
            {colorWcag.compliance.AAA ? (
              <IconTick01 dxSize={10} />
            ) : (
              <IconCancel dxSize={10} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = css`
  width: 100%;
  display: grid;
  grid-template-columns: ${makeRem(100)} 1fr;
  gap: ${makeRem(16)};

  & + & {
    margin-top: ${makeRem(16)};
  }

  & > div {
    width: auto;
    overflow: hidden;

    &:first-child {
      border-radius: ${makeRem(12)};
    }

    &:last-child {
      display: flex;
      align-items: center;
      justify-content: space-evenly;

      & > div:first-child {
        border-top-left-radius: ${makeRem(12)};
        border-bottom-left-radius: ${makeRem(12)};
      }

      & > div:last-child {
        border-top-right-radius: ${makeRem(12)};
        border-bottom-right-radius: ${makeRem(12)};
      }
    }
  }
`;

export function ColorPreviewBlocks(props: {
  colorName: string;
  baseVariantHex: string;
  variants: Record<string, string>;
}) {
  const { showWCAG, wcagValues } = useColorPreviewContext();
  return (
    <div className={styles}>
      <ColorBlock
        style={{ backgroundColor: props.baseVariantHex }}
        dxName={props.colorName}
        dxHex={props.baseVariantHex}
        showWCAG={showWCAG}
        bgHex={wcagValues.bgColor}
        fontSize={wcagValues.fontSize}
      />
      <div>
        {Object.entries(props.variants).map(([variantName, variantHex]) => (
          <ColorBlock
            key={variantName}
            dxName={variantName}
            dxHex={variantHex}
            showWCAG={showWCAG}
            bgHex={wcagValues.bgColor}
            fontSize={wcagValues.fontSize}
          />
        ))}
      </div>
    </div>
  );
}
