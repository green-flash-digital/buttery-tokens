import { Template } from "./Template.js";

import type { TokensConfig } from "../ButteryTokens.js";

export class TemplateMakeFontBaseSize extends Template {
  private _config: TokensConfig;

  constructor(config: TokensConfig) {
    super({
      prefix: config.config.runtime.prefix,
      name: "makeFontBaseSize",
      namespace: "font-base",
      description:
        "Returns the token used to set the base font size of the document body.",
    });
    this._config = config;
  }

  makeUtilTS(): string {
    const functionName = this.getName();
    const prefix = this.getPrefix();

    return `export type MakeFontBaseSize = (token: number) => string;

  
  ${this._createDocsDescription("ts")}
export const ${functionName}: MakeFontBaseSize = (value) => {
    return \`var(${prefix}-\${value})\`
};
  `;
  }

  makeUtilSCSS(): string {
    return "";
  }

  makeCSSProperties(): string[] {
    const property = this._createCSSProperty();
    return [`${property}: ${this._config.config.sizeAndSpace.baseFontSize}`];
  }
}
