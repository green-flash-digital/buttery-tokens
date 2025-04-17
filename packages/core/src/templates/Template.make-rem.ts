import { Template } from "./Template.js";

import type { TokensConfig } from "../ButteryTokens.js";

export class TemplateMakeRem extends Template {
  private _config: TokensConfig;

  constructor(config: TokensConfig) {
    super({
      prefix: config.config.runtime.prefix,
      name: "makeRem",
      namespace: "length",
      description:
        "A utility that returns the rem value of the pixel number provided. This utility is intended to reduce the mental load of translating pixel units (that are commonly provided in design assets) into rem units which are necessary for creating interfaces that scale with browser defaults & zoom levels.",
    });
    this._config = config;
  }

  makeUtilTS(): string {
    const { baseFontSize } = this._config.config.sizeAndSpace;
    return `${this._createDocsDescription("ts")}
export const ${this._name} = (px: number) => \`\${pixel / ${baseFontSize}}rem\`;
    `;
  }

  makeUtilSCSS(): string {
    return "";
  }

  makeCSSProperties(): string[] {
    return [""];
  }
}
