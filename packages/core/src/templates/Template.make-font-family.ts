import { match } from "ts-pattern";

import { Template } from "./Template.js";

import type { TokensConfig } from "../ButteryTokens.js";

export class TemplateMakeFontFamily extends Template {
  private _config: TokensConfig;

  constructor(config: TokensConfig) {
    super({
      prefix: config.config.runtime.prefix,
      name: "makeFontFamily",
      namespace: "font-family",
      description:
        "A utility that returns the CSS variable assigned to the font-family`",
    });
    this._config = config;
  }

  makeUtilTS(): string {
    const functionName = this._name;
    const propertyBase = this._createCSSProperty();
    const fontFamilyNames = match(this._config.config.font)
      .with({ source: "manual" }, (state) => {
        return Object.keys(state.families);
      })
      .otherwise((state) => {
        return Object.keys(state.families);
      });
    const fontFamilyUnion = this._createUnionType(fontFamilyNames);

    return `export type FontFamily = ${fontFamilyUnion};
export type MakeFontFamily = (fontFamilyName: FontFamily) => string;
  
  ${this._createDocsDescription("ts")}
export const ${functionName}: MakeFontFamily = (value) => {
    return \`var(${propertyBase}-\${value})\`
};
`;
  }

  makeUtilSCSS(): string {
    return "";
  }

  makeCSSProperties(): string[] {
    const fontFamilies = this._config.config.font.families ?? {};
    const properties = Object.entries(fontFamilies).map(
      ([fontFamilyName, fontFamilyValue]) => {
        const property = this._createCSSProperty(fontFamilyName);
        return `${property}: "${fontFamilyValue.family}", ${fontFamilyValue.fallback}`;
      }
    );
    return properties;
  }
}
