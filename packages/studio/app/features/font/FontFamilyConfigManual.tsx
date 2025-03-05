import { css } from "@linaria/core";
import type { ChangeEventHandler } from "react";
import { useCallback } from "react";
import { manualFontStyles } from "@buttery/core/schemas";

import { makeRem } from "@tokens";
import { InputLabel } from "~/components/InputLabel";
import { InputText } from "~/components/InputText";
import { InputGroup } from "~/components/InputGroup";

import { FontFamilyConfigVariant } from "./FontFamilyConfigVariant";
import type { FontFamilyConfigVariantProps } from "./FontFamilyConfigVariant";
import type { FontFamilyConfigVariantStylesProps } from "./FontFamilyConfigVariantStyles";
import { FontFamilyConfigVariantStyles } from "./FontFamilyConfigVariantStyles";
import type { ConfigurationStateFontManualFamilyValues } from "./font.utils";

const inlineField = css`
  display: flex;
  gap: ${makeRem(16)};
`;

const allFontStyles = Object.entries(manualFontStyles).reduce<
  FontFamilyConfigVariantStylesProps["allStyles"]
>((accum, [value, display]) => accum.concat({ value, display }), []);

export function FontFamilyConfigManual<
  T extends ConfigurationStateFontManualFamilyValues
>({
  tokenName,
  familyName,
  id,
  source,
  onAction,
  meta,
  styles,
}: T & FontFamilyConfigVariantProps) {
  const handleChangeFontFamilyName = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      onAction({ action: "changeFamilyName", id, fontFamilyName: value });
    },
    [id, onAction]
  );

  const handleChangeTokenName = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      onAction({ action: "changeTokenName", id, token: value });
    },
    [id, onAction]
  );

  return (
    <FontFamilyConfigVariant
      id={id}
      tokenName={tokenName}
      familyName={familyName}
      source={source}
      meta={meta}
      onAction={onAction}
    >
      <InputGroup>
        <InputLabel
          dxLabel="Token Name"
          dxSize="dense"
          dxHelp="heading, body, display, etc..."
        >
          <div className={inlineField}>
            <InputText
              dxSize="dense"
              dxType="text"
              value={tokenName}
              onChange={handleChangeTokenName}
            />
          </div>
        </InputLabel>
        <InputLabel
          dxLabel="Family"
          dxSize="dense"
          dxHelp="Mullish, Consolas, OpenSans, Lato, etc..."
        >
          <div className={inlineField}>
            <InputText
              dxSize="dense"
              dxType="text"
              value={familyName}
              onChange={handleChangeFontFamilyName}
            />
          </div>
        </InputLabel>
        <FontFamilyConfigVariantStyles
          allStyles={allFontStyles}
          selectedStyles={Object.keys(styles)}
          id={id}
          onAction={onAction}
        />
      </InputGroup>
    </FontFamilyConfigVariant>
  );
}
