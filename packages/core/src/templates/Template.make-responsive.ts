import { Template } from "./Template.js";

import type { TokensConfig } from "../ButteryTokens.js";

export class TemplateMakeResponsive extends Template {
  private _config: TokensConfig;

  constructor(config: TokensConfig) {
    super({
      prefix: config.config.runtime.prefix,
      name: "makeResponsive",
      namespace: "breakpoint",
      description: `A utility that enables you to easily create a \`@media\`
string that can be interpolated in CSS-in-JS syntax.`,
    });
    this._config = config;
  }

  private get _breakpoints() {
    const { breakpoints } = this._config.config.response;
    return breakpoints;
  }

  makeUtilTS(): string {
    const breakpointNames = Object.keys(this._breakpoints);
    const breakpointUnion = this._createUnionType(breakpointNames);

    return `
export const breakpoints = ${JSON.stringify(this._breakpoints, null, 2)};
export type Breakpoints = ${breakpointUnion};
export type MakeResponsive = (params: { from?: Breakpoints, to?: Breakpoints }) => string;
  
  ${this._createDocsDescription("ts")}
export const ${this._name}: MakeResponsive = (params) => {
  const from = params?.from ? \`\${breakpoints[params.from]}px\` : undefined;
  const to = params?.to ? \`calc(\${breakpoints[params.to]}px - 1px)\` : undefined;
  if (from && to) {
    return \`@media (min-width: \${from}) and (max-width:\${to})\`;
  }
  if (from && !to) {
    return \`@media (min-width: \${from})\`;
  }
  if (to && !from) {
    return \`@media (max-width: \${to})\`;
  }
  throw new Error("You must provide a 'to' and/or 'from' parameter.")
};
  `;
  }

  makeUtilSCSS(): string {
    return "";
  }

  makeCSSProperties(): string[] {
    const properties = Object.entries(this._breakpoints).map(
      ([breakpointName, breakpointValue]) => {
        const property = this._createCSSProperty(breakpointName);
        return `${property}: ${breakpointValue}px`;
      }
    );
    return properties;
  }
}
