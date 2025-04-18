import { exhaustiveMatchGuard } from "ts-jolt/isomorphic";

import { Template } from "./Template.js";

import type { TokensConfig } from "../ButteryTokens.js";

export class TemplateMakeCustom extends Template {
  private _config: TokensConfig;

  constructor(config: TokensConfig) {
    super({
      prefix: config.config.runtime.prefix,
      name: "makeCustom",
      namespace: "custom",
      description:
        "Enables to references custom tokens that don't fit within the bounds of the static configuration points. This is good for things like navigational headers, footers, or any other heights, 1-off colors, etc... that need to be shared across all parts of the application",
    });
    this._config = config;
  }

  makeUtilTS(): string {
    const customTokenNames = Object.keys(this._config.config.custom);
    const customTokenUnion = this._createUnionType(customTokenNames);
    const propertyBase = this._createCSSProperty();

    return `export type CustomTokens = ${customTokenUnion};
export type MakeCustom = (tokenName: CustomTokens) => string | number;

${this._createDocsDescription("ts")}
export const ${this._name}: MakeCustom = (value) => {
  return \`var(${propertyBase}-\${value})\`
};
`;
  }

  makeUtilSCSS(): string {
    return "";
  }

  makeCSSProperties(): string[] {
    const properties = Object.entries(this._config.config.custom).map(
      ([customToken, customTokenValue]) => {
        const property = this._createCSSProperty(customToken);
        switch (customTokenValue.type) {
          case "number":
          case "string":
            return `${property}: ${customTokenValue}`;

          case "rem": {
            const remValue =
              customTokenValue.value /
              this._config.config.sizeAndSpace.baseFontSize;
            return `${property}: ${remValue}rem`;
          }

          default:
            return exhaustiveMatchGuard(customTokenValue);
        }
      },
      []
    );
    return properties;
  }
}

//  * It's important to note that the values that are associated with the token from
//  * the config are going to be raw values. This is to ensure that there's not black
//  * magic behind the scenes happening that makes the utility do more than just recall
//  * the value with the token.
//  *
//  * With that said, there are options on the method that will allow you to recall
//  * the value and add some simple processing on it. For instance, if the token value
//  * is a number you would be able to use an option in the \`${functionName}\` function
//  * to convert that value to a rem.
