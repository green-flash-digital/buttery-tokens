import { css } from "@linaria/core";
import type { ChangeEventHandler } from "react";
import { useCallback } from "react";
import { generateGUID } from "ts-jolt/isomorphic";
import { makeRem } from "@buttery/studio-tokens";

import { VariantList } from "~/components/VariantList";
import { VariantEmpty } from "~/components/VariantEmpty";
import { VariantAdd } from "~/components/VariantAdd";

import { ColorBrandModeAutoVariant } from "./ColorBrandModeAutoVariant";
import { ColorBrandModeAutoCategory } from "./ColorBrandModeAutoCategory";
import type { ConfigurationStateColorBrandAuto } from "./color.utils";
import { colorAutoPresets } from "./color.utils";

import type { ConfigurationContextType } from "../Config.context";
import { InputRange } from "../../components/InputRange";
import { InputSection } from "../../components/InputSection";
import { InputLabel } from "../../components/InputLabel";

const inputLabelStyles = css`
  margin-bottom: ${makeRem(16)};
  margin-top: ${makeRem(8)};
`;

export function ColorBrandModeAuto({
  state,
  setColor,
}: {
  state: ConfigurationStateColorBrandAuto;
  setColor: ConfigurationContextType["setColor"];
}) {
  const handleChangeBrightness = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      setColor((draft) => {
        // @ts-expect-error This number is validated by the min and max on the range
        draft.brand.auto.brightness = Number(value);
      });
    },
    [setColor]
  );

  const handleChangeSaturation = useCallback<
    ChangeEventHandler<HTMLInputElement>
  >(
    ({ currentTarget: { value } }) => {
      setColor((draft) => {
        // @ts-expect-error This number is validated by the min and max on the range
        draft.brand.auto.saturation = Number(value);
      });
    },
    [setColor]
  );

  const handleAddVariant = useCallback(() => {
    const totalColors = Object.entries(state.colors).length;
    setColor((draft) => {
      const id = generateGUID();
      draft.brand.auto.colors[id] = {
        hue: 180,
        name: `brand${totalColors + 1}`,
        variants: 10,
      };
    });
  }, [setColor, state.colors]);

  const colorEntries = Object.entries(state.colors);

  return (
    <>
      <InputSection>
        <InputLabel
          dxLabel="Determine the color category"
          dxHelp="Manually select a category or pick a color to auto determine it's category"
        />
        <ColorBrandModeAutoCategory state={state} setColor={setColor} />
      </InputSection>
      <InputSection>
        <InputLabel
          dxLabel="Configure your colors"
          dxHelp="Adjust the saturation, brightness and hues to get the colors you want in accordance with the selected category"
        />
        <div className={inputLabelStyles}>
          <InputLabel
            dxLabel="Saturation"
            htmlFor="saturation"
            dxSize="dense"
          />
          <InputRange
            id="saturation"
            dxDisplayMin
            dxDisplayMax
            dxDisplayInput
            value={state.saturation}
            {...colorAutoPresets[state.type].saturation}
            className={inputLabelStyles}
            onChange={handleChangeSaturation}
          />
        </div>
        <div className={inputLabelStyles}>
          <InputLabel
            dxLabel="Brightness"
            htmlFor="brightness"
            dxSize="dense"
          />
          <InputRange
            id="brightness"
            dxDisplayMin
            dxDisplayMax
            dxDisplayInput
            value={state.brightness}
            {...colorAutoPresets[state.type].brightness}
            className={inputLabelStyles}
            onChange={handleChangeBrightness}
          />
        </div>
        <div className={inputLabelStyles}>
          <InputLabel dxLabel="Hues & Variants" dxSize="dense" />
          {colorEntries.length === 0 ? (
            <VariantEmpty
              dxMessage="No colors have been added"
              dxActionMessage="Click to add a color"
              dxOnAdd={handleAddVariant}
            />
          ) : (
            <VariantList>
              {colorEntries.map(([colorId, colorNameAndDef]) => {
                return (
                  <li key={colorId}>
                    <ColorBrandModeAutoVariant
                      colorDef={{ [colorId]: colorNameAndDef }}
                      setColor={setColor}
                    />
                  </li>
                );
              })}
              <li>
                <VariantAdd onAdd={handleAddVariant}>
                  Add another color
                </VariantAdd>
              </li>
            </VariantList>
          )}
        </div>
      </InputSection>
    </>
  );
}
