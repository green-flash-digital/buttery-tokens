import { Template } from "./Template.js";

import type { TokensConfig } from "../ButteryTokens.js";

export class TemplateMakeReset extends Template {
  private _resetUnion: string;

  constructor(config: TokensConfig) {
    super({
      prefix: config.config.runtime.prefix,
      name: "makeReset",
      namespace: "reset",
      description: "Returns some CSS resets for any given elements",
    });

    this._resetUnion = this._createUnionType([
      "ul",
      "button",
      "body",
      "anchor",
      "input",
    ]);
  }

  makeUtilTS(): string {
    return `export type MakeReset = (element: ${this._resetUnion}) => string;

const matchGuard = (_: never): never => {
  throw new Error(\`Forgot to include an \${_} in the switch statement\`);
};

export const ${this._name}: MakeReset = (element) => {
    switch(element) {
      case "ul":
        return \`
          margin: 0;
          padding: 0;

          li {
            margin: 0;
            padding: 0;
            list-style-type: none;
          }
        \`;

      case "button":
        return \`
          margin: 0;
          padding: 0;
          border: none;
          background: none;
        \`;

      case "body":
        return \`
          margin: 0;
          padding: 0;
        \`;

      case "anchor":
        return \`
          text-decoration: none;
          color: inherit;

          &:visited {
            color: inherit;
          }
        \`;

      case "input":
        return \`
          margin: 0;
          padding: 0;
          border: none;
          background: none;
          font: inherit;
          color: inherit;
          appearance: none;
          outline: none;
          box-sizing: border-box;
          width: inherit;

          &[type="number"]::-webkit-inner-spin-button,
          &[type="number"]::-webkit-outer-spin-button {
            appearance: none;
            margin: 0;
          }

          // range
          &[type="range"]::-ms-track {
            background: transparent; /* Transparent since MS uses a pseudo track */
            border-color: transparent;
            color: transparent;
          },
          &[type="range"]::-webkit-slider-thumb {
            appearance: none;
            -webkit-appearance: none; /* Removes default styling */
          }
          &[type="range"]:focus {
            outline: none;
          }
        \`;

      default:
        return matchGuard(element);
    }
};
`;
  }

  makeUtilSCSS(): string {
    return "";
  }

  makeCSSProperties(): string[] {
    return [""];
  }
}
