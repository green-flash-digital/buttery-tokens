import { css } from "@linaria/core";
import { useCallback } from "react";
import { exhaustiveMatchGuard, generateGUID } from "ts-jolt/isomorphic";
import { match } from "ts-pattern";
import { manualFontStyles } from "@buttery/core/schemas";

import { makeRem, makeReset } from "@tokens";
import { VariantEmpty } from "~/components/VariantEmpty";
import { VariantAdd } from "~/components/VariantAdd";
import { LOG } from "~/utils/util.logger";

import { FontFamilyConfigManual } from "./FontFamilyConfigManual";
import { FontFamilyConfigRegistry } from "./FontFamilyConfigRegistry";
import type { OnFontFamilyAction } from "./font.utils";

import { useConfigurationContext } from "../Config.context";

const styles = css`
  ${makeReset("ul")};
  display: flex;
  flex-direction: column;
  gap: ${makeRem(8)};
`;

export function FontFamilyConfig() {
  const { font, setFont } = useConfigurationContext();

  const handleAction = useCallback<OnFontFamilyAction>(
    (args) => {
      switch (args.action) {
        case "addFontFamily":
          setFont((draft) => {
            const numOfFamilies = (Object.values(draft.families).length = 0);
            draft.source = "manual";
            draft.families[generateGUID()] = {
              tokenName: `family${numOfFamilies + 1}`,
              familyName: "Arial",
              fallback: undefined,
              styles: {
                "regular-400": {
                  display: manualFontStyles["regular-400"],
                },
              },
              meta: {
                isOpen: true,
              },
            };
          });
          break;

        case "deleteFontFamily": {
          setFont((draft) => {
            const familyToDelete = draft.families[args.id];
            const isFontFamilyInVariants = Object.values(draft.variants).reduce(
              (accum, variant) => {
                if (variant.familyToken === familyToDelete.tokenName)
                  return true;
                return accum;
              },
              false
            );
            if (isFontFamilyInVariants) {
              LOG.error(
                "Cannot delete this family since it is a part of the variants. Please delete the variants that include the family and try again."
              );
              return;
            }

            delete draft.families[args.id];
          });
          break;
        }

        case "toggle": {
          setFont((draft) => {
            draft.families[args.id].meta.isOpen =
              !draft.families[args.id].meta.isOpen;
          });
          break;
        }

        case "addStyle": {
          setFont((draft) => {
            // @ts-expect-error this is going to be okay TODO: Enable Types
            draft.families[args.id].styles[args.style] = {
              // @ts-expect-error this is going to be okay TODO: Enable Types
              display: manualFontStyles[args.style],
            };
          });
          break;
        }

        case "deleteStyle": {
          setFont((draft) => {
            // @ts-expect-error this is going to be okay
            delete draft.families[args.id].styles[args.style];
          });
          break;
        }

        case "changeSource":
          setFont((draft) => {
            draft.source = args.source;
          });
          break;

        case "changeFamilyName":
          setFont((draft) => {
            draft.families[args.id].familyName = args.fontFamilyName;
          });
          break;

        case "changeTokenName":
          setFont((draft) => {
            draft.families[args.id].tokenName = args.token;
          });
          break;

        case "changeFallback":
          setFont((draft) => {
            draft.families[args.id].fallback = args.fallback;
          });
          break;

        default:
          exhaustiveMatchGuard(args);
      }
    },
    [setFont]
  );

  const handleAddFontFamily = useCallback(
    () => handleAction({ action: "addFontFamily" }),
    [handleAction]
  );

  // Show an empty state if there are no families added
  if (Object.entries(font.families).length === 0) {
    return (
      <VariantEmpty
        dxMessage="No font families have been added yet"
        dxActionMessage="Click to add a font family"
        dxOnAdd={handleAddFontFamily}
      />
    );
  }

  return (
    <ul className={styles}>
      {match(font)
        .with({ source: "manual" }, (state) =>
          Object.entries(state.families).map(([familyId, family]) => (
            <li key={familyId}>
              <FontFamilyConfigManual
                {...family}
                id={familyId}
                source={state.source}
                onAction={handleAction}
              />
            </li>
          ))
        )
        .otherwise((state) =>
          Object.entries(state.families).map(([familyId, family]) => (
            <li key={familyId}>
              <FontFamilyConfigRegistry
                {...family}
                id={familyId}
                source={state.source}
                onAction={handleAction}
              />
            </li>
          ))
        )}
      <VariantAdd onAdd={handleAddFontFamily}>Add a font family</VariantAdd>
    </ul>
  );
}
