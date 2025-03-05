import { useCallback, useMemo } from "react";
import { exhaustiveMatchGuard, useToggle } from "react-hook-primitives";
import { css } from "@linaria/core";
import { makeColor, makeRem } from "@tokens";

import { VariantContainer } from "~/components/VariantContainer";
import { VariantContainerBar } from "~/components/VariantContainerBar";
import { VariantContainerBarTitle } from "~/components/VariantContainerBarTitle";
import { VariantContainerBarActions } from "~/components/VariantContainerBarActions";
import { VariantContainerContent } from "~/components/VariantContainerContent";
import { InputLabel } from "~/components/InputLabel";
import { InputSelect } from "~/components/InputSelect";
import { InputNumber } from "~/components/InputNumber";
import { InputGroup } from "~/components/InputGroup";
import { InputText } from "~/components/InputText";

import type {
  ConfigurationStateFont,
  ConfigurationStateFontManualFamilyValues,
  ConfigurationStateFontVariantValue,
  OnFontVariantAction,
} from "./font.utils";

const barStyles = css`
  grid-template-columns: ${makeRem(80)} 1fr auto !important;

  .meta {
    font-size: ${makeRem(12)};
    color: ${makeColor("neutral-light", { opacity: 0.7 })};
  }
`;

export type FontVariantConfigVariantProps =
  ConfigurationStateFontVariantValue & {
    variantId: string;
    state: ConfigurationStateFont;
    onAction: OnFontVariantAction;
  };

export function FontVariantConfigVariant({
  variantId,
  variantName,
  state,
  familyToken,
  lineHeight,
  size,
  weight,
  onAction,
}: FontVariantConfigVariantProps) {
  const [isOpen, toggle] = useToggle();

  const families = useMemo(() => {
    switch (state.source) {
      case "manual":
        return Object.values(state.families).map((family) => family.tokenName);

      case "adobe":
      case "google":
        return Object.values(state.families).map((family) => family.tokenName);

      default:
        return exhaustiveMatchGuard(state);
    }
  }, [state]);

  const weights = useMemo(() => {
    let selectedFamily: ConfigurationStateFontManualFamilyValues | undefined =
      undefined;
    switch (state.source) {
      case "manual":
        selectedFamily = Object.values(state.families).reduce<
          ConfigurationStateFontManualFamilyValues | undefined
        >(
          (accum, familyDef) =>
            familyDef.tokenName === familyToken ? familyDef : accum,
          undefined
        );
        break;

      case "adobe":
      case "google":
        // selectedFamily = Object.values(state.families).reduce<
        //   ConfigurationStateFontManualFamilyValues | undefined
        // >(
        //   (accum, familyDef) => (familyDef.name === family ? familyDef : accum),
        //   undefined
        // );
        break;

      default:
        return exhaustiveMatchGuard(state);
    }
    if (!selectedFamily) {
      throw "Cannot determine the family from the selection. This should not have happened.";
    }

    return Object.entries(selectedFamily.styles).reduce<
      { value: string; display: string }[]
    >((accum, [value, { display }]) => accum.concat({ value, display }), []);
  }, [familyToken, state]);

  const InputName = useMemo(
    () => (
      <InputLabel
        dxLabel="Variant Name"
        dxSize="dense"
        dxHelp="body1, display2, caption, etc..."
      >
        <InputText
          dxSize="dense"
          defaultValue={variantName}
          onChange={({ currentTarget: { value } }) => {
            onAction({
              action: "changeVariantName",
              id: variantId,
              name: value,
            });
          }}
        />
      </InputLabel>
    ),
    [onAction, variantId, variantName]
  );

  const InputFamily = useMemo(
    () => (
      <>
        <InputLabel dxLabel="Font Family" dxSize="dense">
          <InputSelect
            dxSize="dense"
            defaultValue={familyToken}
            onChange={({ currentTarget: { value } }) => {
              onAction({
                action: "changeVariantFamilyToken",
                id: variantId,
                familyToken: value,
              });
            }}
          >
            {families.map((family) => (
              <option key={family} value={family}>
                {family}
              </option>
            ))}
          </InputSelect>
        </InputLabel>
      </>
    ),
    [families, familyToken, onAction, variantId]
  );

  const InputSize = useMemo(
    () => (
      <InputLabel dxLabel="Size" dxSize="dense">
        <InputNumber
          dxSize="dense"
          defaultValue={size}
          min={4}
          onChange={({ currentTarget: { value } }) => {
            onAction({
              action: "changeVariantSize",
              id: variantId,
              size: Number(value),
            });
          }}
        />
      </InputLabel>
    ),
    [onAction, size, variantId]
  );

  const InputWeightAndStyle = useMemo(
    () => (
      <InputLabel dxLabel="Font Weight & Style" dxSize="dense">
        <InputSelect
          dxSize="dense"
          defaultValue={familyToken}
          onChange={({ currentTarget: { value } }) => {
            onAction({
              action: "changeVariantWeightAndStyle",
              id: variantId,
              weightAndStyle: value,
            });
          }}
        >
          {weights.map((weight) => (
            <option key={weight.value} value={weight.value}>
              {weight.display}
            </option>
          ))}
        </InputSelect>
      </InputLabel>
    ),
    [familyToken, onAction, variantId, weights]
  );

  const handleDelete = useCallback(() => {
    onAction({
      action: "deleteVariant",
      id: variantId,
    });
  }, [onAction, variantId]);

  return (
    <VariantContainer>
      <VariantContainerBar className={barStyles}>
        <VariantContainerBarTitle>{variantName}</VariantContainerBarTitle>
        <div className="meta">
          {familyToken} / {size} / {weight} / {lineHeight}
        </div>

        <VariantContainerBarActions
          dxIsEditing={isOpen}
          dxOnDelete={handleDelete}
          dxOnEdit={toggle}
        />
      </VariantContainerBar>
      {isOpen && (
        <VariantContainerContent>
          <InputGroup>
            {InputName}
            {InputFamily}
            {InputSize}
            {InputWeightAndStyle}
          </InputGroup>
        </VariantContainerContent>
      )}
    </VariantContainer>
  );
}
