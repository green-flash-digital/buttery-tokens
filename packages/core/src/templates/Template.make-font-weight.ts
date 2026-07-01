import { defineTemplate } from "./types.js";

import { createCSSProperty } from "../utils/index.js";
import type { TokensConfig } from "../ButteryTokens.js";

function getFamilyWeightPairs(config: TokensConfig): string[] {
  return Object.entries(config.config.font.families).reduce<string[]>(
    (accum, [familyName, familyDef]) => {
      for (const style of familyDef.styles) {
        accum.push(`${familyName}-${style.split("-")[0]}`);
      }
      return accum;
    },
    []
  );
}

function makeFontWeightUtil<
  T extends { prefix: string; font: { weights: Record<string, number> } }
>(tokens: T) {
  return {
    makeFontWeight(weightName: keyof T["font"]["weights"] & string): string {
      return `var(--${tokens.prefix}-font-weight-${weightName})`;
    },
  };
}

export const fontWeightTemplate = defineTemplate({
  name: "makeFontWeight",
  namespace: "font-weight",
  description:
    "Generates font-weight tokens derived from font family style definitions.",
  tokens(config) {
    const weights: Record<string, number> = {};
    for (const [familyName, familyDef] of Object.entries(
      config.config.font.families
    )) {
      for (const style of familyDef.styles) {
        const parts = style.split("-");
        weights[`${familyName}-${parts[0]}`] = parseInt(parts[1], 10);
      }
    }
    return { font: { weights } };
  },
  cssProperties(config) {
    const prefix = config.config.runtime.prefix;
    return getFamilyWeightPairs(config).reduce<string[]>(
      (accum, familyAndWeight) => {
        const [familyName, weightName] = familyAndWeight.split("-");
        const name = familyName as keyof typeof config.config.font.families;
        const style = config.config.font.families[name].styles.find((s) =>
          s.startsWith(weightName)
        );
        if (!style) {
          throw new Error(
            `Cannot find a ${name} style that begins with ${weightName}.`
          );
        }
        const property = createCSSProperty(
          prefix,
          "font-weight",
          familyAndWeight
        );
        return accum.concat(`${property}: ${style.split("-")[1]}`);
      },
      []
    );
  },
  util: makeFontWeightUtil,
});
