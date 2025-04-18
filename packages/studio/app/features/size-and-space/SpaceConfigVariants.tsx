import { css } from "@linaria/core";
import type { ChangeEventHandler, FormEventHandler, RefCallback } from "react";
import { useCallback, useMemo, useRef } from "react";
import { classes, useToggle } from "react-hook-primitives";
import { debounce } from "ts-jolt/browser";
import { makeColor, makeRem } from "@buttery/studio-tokens";

import { Button } from "~/components/Button";
import { IconPencilEdit01 } from "~/icons/IconPencilEdit01";
import { IconTick01 } from "~/icons/IconTick01";
import { InputText } from "~/components/InputText";
import { InputLabel } from "~/components/InputLabel";
import { InputRange } from "~/components/InputRange";
import { VariantList } from "~/components/VariantList";
import { VariantContainer } from "~/components/VariantContainer";
import { VariantContainerBar } from "~/components/VariantContainerBar";
import { VariantContainerBarText } from "~/components/VariantContainerBarText";
import { VariantContainerBarTitle } from "~/components/VariantContainerBarTitle";

import {
  type ConfigurationStateSizeAndSpace,
  orderSpaceVariants,
  type ConfigurationStateSizeAndSpace_SpaceVariants,
} from "./size-and-space.utils.js";
import { useRecalculateSpaceVariants } from "./space.useRecalculateSpaceVariants";

import type { ConfigurationContextType } from "../Config.context.js";

const styles = css`
  display: grid;
  grid-template-columns: 1fr ${makeRem(54)} ${makeRem(54)} auto;
  gap: ${makeRem(16)};
  align-items: center;
  font-size: ${makeRem(14)};
  border-radius: ${makeRem(4)};
  height: ${makeRem(62 - 16 * 2)};

  .actions {
    justify-self: end;
    font-size: ${makeRem(14)};
  }

  .save {
    color: ${makeColor("success-500")};
  }
`;
export type SpaceConfigVariantItemProps = {
  baseFontSize: number;
  onChangeVariantName: (id: string, name: string) => void;
  onChangeVariantValue?: (id: string, value: string) => void;
};

function SpaceConfigVariantItem({
  id,
  name,
  value,
  baseFontSize,
  onChangeVariantName,
  onChangeVariantValue,
}: SpaceConfigVariantItemProps & { id: string; name: string; value: number }) {
  const [isEditing, toggle] = useToggle(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleChangeVariantName = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      onChangeVariantName(id, value);
    },
    [id, onChangeVariantName]
  );

  const handleChangeVariantValue = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      if (!onChangeVariantValue) return;
      onChangeVariantValue(id, value);
    },
    [id, onChangeVariantValue]
  );

  const inputRef = useCallback<RefCallback<HTMLInputElement>>((node) => {
    if (!node) return;
    node.select();
  }, []);

  const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      toggle();
      if (!buttonRef.current) return;
      buttonRef.current.focus();
    },
    [toggle]
  );

  return (
    <VariantContainer>
      <form onSubmit={handleSubmit}>
        <VariantContainerBar className={styles}>
          <div>
            {isEditing ? (
              <InputText
                ref={inputRef}
                defaultValue={name}
                dxSize="dense"
                dxType="text"
                onChange={handleChangeVariantName}
              />
            ) : (
              <VariantContainerBarTitle>{name}</VariantContainerBarTitle>
            )}
          </div>
          {onChangeVariantValue && (
            <div>
              {isEditing ? (
                <InputText
                  defaultValue={value}
                  dxSize="dense"
                  dxType="text"
                  onChange={handleChangeVariantValue}
                />
              ) : (
                <VariantContainerBarText>{value}</VariantContainerBarText>
              )}
            </div>
          )}
          {!onChangeVariantValue && (
            <VariantContainerBarText>{`${value}px`}</VariantContainerBarText>
          )}
          <VariantContainerBarText>{`${
            value / baseFontSize
          }rem`}</VariantContainerBarText>
          <div className="actions">
            <Button
              ref={buttonRef}
              type="button"
              dxVariant="icon"
              dxSize="dense"
              dxStyle="normal"
              DXIcon={isEditing ? IconTick01 : IconPencilEdit01}
              dxHelp={isEditing ? "Save name" : "Edit name"}
              className={classes({ save: isEditing })}
              onClick={toggle}
            />
          </div>
        </VariantContainerBar>
      </form>
    </VariantContainer>
  );
}

export function SpaceConfigVariants({
  baseFontSize,
  variants,
  mode,
  setSizing,
}: {
  baseFontSize: number;
  variants: ConfigurationStateSizeAndSpace_SpaceVariants;
  mode: ConfigurationStateSizeAndSpace["space"]["mode"];
  setSizing: ConfigurationContextType["setSizing"];
}) {
  const { recalculateSpaceVariants } = useRecalculateSpaceVariants();

  const debouncedHandleCalcVariants = useMemo(
    () => debounce(recalculateSpaceVariants, 100),
    [recalculateSpaceVariants]
  );

  const handleChangeVariantName = useCallback<
    SpaceConfigVariantItemProps["onChangeVariantName"]
  >(
    (id, name) => {
      setSizing((draft) => {
        draft.space[mode].variants[id].name = name;
      });
    },
    [mode, setSizing]
  );

  const orderedVariants = orderSpaceVariants(variants);

  return (
    <>
      <InputLabel
        dxLabel="Variants"
        dxHelp="The number of spacing variants (default: 5)"
        dxSize="dense"
      >
        <div>
          <InputRange
            value={Object.entries(variants).length}
            dxDisplayInput
            dxDisplayMax
            dxDisplayMin
            min={1}
            max={50}
            step={1}
            dxVariant="normal"
            dxOnChange={debouncedHandleCalcVariants}
          />
        </div>
      </InputLabel>
      <VariantList>
        {Object.entries(orderedVariants).map(([variantId, { name, value }]) => {
          return (
            <li key={variantId}>
              <SpaceConfigVariantItem
                id={variantId}
                name={name}
                value={value}
                baseFontSize={baseFontSize}
                onChangeVariantName={handleChangeVariantName}
              />
            </li>
          );
        })}
      </VariantList>
    </>
  );
}
