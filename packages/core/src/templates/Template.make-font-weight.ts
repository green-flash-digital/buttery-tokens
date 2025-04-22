import { match } from "ts-pattern";
import { exhaustiveMatchGuard } from "ts-jolt/isomorphic";

import { Template } from "./Template.js";

import type { TokensConfig } from "../ButteryTokens.js";

export class TemplateMakeFontWeight extends Template {
  private _config: TokensConfig;

  constructor(config: TokensConfig) {
    super({
      prefix: config.config.runtime.prefix,
      name: "makeFontWeight",
      namespace: "font-weight",
      description:
        "A utility that returns the CSS variable assigned to keys of the `font.family`",
    });
    this._config = config;
  }

  private _getFamilyAndWeights(): string[] {
    const familyNameAndWeightName = match(this._config.config.font)
      .with({ source: "manual" }, (state) => {
        return Object.entries(state.families).reduce<string[]>(
          (accum, [familyName, familyDef]) => {
            for (const style of familyDef.styles) {
              const weightOnly = style.split("-")[0];
              accum.push(`${familyName}-${weightOnly}`);
            }
            return accum;
          },
          []
        );
      })
      .otherwise((state) => {
        return Object.keys(state.families);
      });
    return familyNameAndWeightName;
  }

  makeUtilTS(): string {
    const familyNameAndWeightName = this._getFamilyAndWeights();
    const fontWeightUnion = this._createUnionType(familyNameAndWeightName);
    const functionName = this._name;
    const propertyBase = this._createCSSProperty();

    return `export type FontFamilyAndWeight = ${fontWeightUnion};
export type MakeFontWeight = (fontWeightName: FontFamilyAndWeight) => string;

${this._createDocsDescription("ts")}
export const ${functionName}: MakeFontWeight = (fontFamilyAndWeight) => {
    return \`var(${propertyBase}-\${fontFamilyAndWeight})\`
};
  `;
  }

  makeUtilSCSS(): string {
    return "";
  }

  makeCSSProperties(): string[] {
    const familyNameAndWeightName = this._getFamilyAndWeights();

    const properties = familyNameAndWeightName.reduce<string[]>(
      (accum, fontFamilyAndWeightName) => {
        const [familyName, weightName] = fontFamilyAndWeightName.split("-");

        switch (this._config.config.font.source) {
          case "manual": {
            const name =
              familyName as keyof typeof this._config.config.font.families;
            const styles = this._config.config.font.families[name].styles;
            const style = styles.find((s) => s.startsWith(weightName));
            if (!style) {
              throw new Error(
                `Cannot find a ${name} style that beings with ${weightName}. This should not have happened. Please log a Github issue.`
              );
            }
            const weightValue = style.split("-")[1];
            const property = this._createCSSProperty(fontFamilyAndWeightName);
            return accum.concat(`${property}: ${weightValue}`);
          }

          case "adobe":
          case "google":
            return accum;

          default:
            return exhaustiveMatchGuard(this._config.config.font);
        }
      },
      []
    );
    return properties;
  }
}
