import { generateGUID } from "@buttery/utils/isomorphic";
import { useCallback } from "react";

import { VariantList } from "~/components/VariantList";
import { VariantEmpty } from "~/components/VariantEmpty";
import { VariantAdd } from "~/components/VariantAdd";

import { ColorBrandModeManualVariant } from "./ColorBrandModeManualVariant";
import type { ConfigurationStateColorBrandManual } from "./color.utils";

import type { ConfigurationContextType } from "../Config.context";
import { InputLabel } from "../../components/InputLabel";
import { InputSection } from "../../components/InputSection";

export function ColorBrandModeManual({
  state,
  setColor,
}: {
  state: ConfigurationStateColorBrandManual;
  setColor: ConfigurationContextType["setColor"];
}) {
  const handleAdd = useCallback(() => {
    const totalColors = Object.entries(state.colors).length;
    setColor((draft) => {
      const id = generateGUID();
      draft.brand.manual.colors[id] = {
        hex: "#000000",
        name: `brand${totalColors + 1}`,
        variants: 10,
      };
    });
  }, [setColor, state]);

  const colorEntries = Object.entries(state.colors);

  return (
    <InputSection>
      <InputLabel
        dxLabel="Add brand colors to your color palette"
        dxHelp="You can configure each color's base value, name, and how variants are created."
      />
      {colorEntries.length === 0 ? (
        <VariantEmpty
          dxMessage="No brand colors have been added yet"
          dxActionMessage="Click to add a brand color"
          dxOnAdd={handleAdd}
        />
      ) : (
        <VariantList>
          {colorEntries.map(([colorId, colorNameAndDef]) => {
            return (
              <li key={colorId}>
                <ColorBrandModeManualVariant
                  colorDef={{ [colorId]: colorNameAndDef }}
                  setColor={setColor}
                />
              </li>
            );
          })}
          <li>
            <VariantAdd onAdd={handleAdd}>Add another brand color</VariantAdd>
          </li>
        </VariantList>
      )}
    </InputSection>
  );
}
