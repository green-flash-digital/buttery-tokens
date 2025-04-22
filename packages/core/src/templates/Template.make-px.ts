import { Template } from "./Template.js";

import type { TokensConfig } from "../ButteryTokens.js";

export class TemplateMakePx extends Template {
  constructor(config: TokensConfig) {
    super({
      prefix: config.config.runtime.prefix,
      name: "makePx",
      namespace: "length",
      description:
        "A utility that concatenates 'px' onto the end of the provided value",
    });
  }

  makeUtilTS(): string {
    return `${this._createDocsDescription("ts")}
export const ${this._name} = (val: number) => \`\${val}px\`;
`;
  }

  makeUtilSCSS(): string {
    return "";
  }

  makeCSSProperties(): string[] {
    return [""];
  }
}
