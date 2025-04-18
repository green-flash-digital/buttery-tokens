import { Template } from "./Template.js";

import type { TokensConfig } from "../ButteryTokens.js";
import {
  createBrandVariants,
  createNeutralVariants,
  hexToHsl,
  hexToRgb,
} from "../utils/index.js";

export class TemplateMakeColor extends Template {
  private _config: TokensConfig;

  constructor(config: TokensConfig) {
    super({
      prefix: config.config.runtime.prefix,
      name: "makeColor",
      namespace: "color",
      description:
        "A utility that allows you to safely incorporate brand color into your apps by easily adding the design token along with optional adjustments & variants.",
    });
    this._config = config;
  }

  private _createColorManifest(): Record<string, string> {
    const {
      config: { color },
    } = this._config;
    const colorVariantsBrand = createBrandVariants(color.brand);
    const colorVariantsNeutral = createNeutralVariants(color.neutral);

    const variantManifest = { ...colorVariantsBrand, ...colorVariantsNeutral };

    const flatManifest: Record<string, string> = {};

    for (const color in variantManifest) {
      const variants = variantManifest[color];
      if (typeof variants !== "object") {
        flatManifest[color] = variants;
        continue;
      }

      for (const variant in variants) {
        if (variant === "base") {
          flatManifest[color] = variants[variant];
          continue;
        }
        flatManifest[`${color}-${variant}`] = variants[variant];
      }
    }

    return flatManifest;
  }

  makeUtilTS(): string {
    const manifest = this._createColorManifest();
    const colorAndVariants = JSON.stringify(manifest, null, 2);
    const propertyBase = this._createCSSProperty();

    return `export const colorAndVariants = ${colorAndVariants};
export type ColorAndVariants = keyof typeof colorAndVariants;
export type MakeColorOptions = { opacity?: number };

${this._createDocsDescription("ts")}
export function ${
      this._name
    }<T extends ColorAndVariants>(tokenName: T, options?: MakeColorOptions): string {
  const opacity = options?.opacity ?? 1;
  return \`rgba(var(${propertyBase}-\${tokenName}-rgb), \${opacity})\`;
}
`;
  }

  makeUtilSCSS(): string {
    return "";
  }

  makeCSSProperties(): string[] {
    const manifest = this._createColorManifest();

    const variants = Object.entries(manifest).reduce<string[]>(
      (accum, [variantId, variantHexValue]) => {
        // construct the variant variables
        const baseProperty = this._createCSSProperty(variantId);
        const hex = variantHexValue;
        const { h, s, l } = hexToHsl(hex);
        const { r, g, b } = hexToRgb(hex);
        const variant = `${baseProperty}: ${hex}`;
        const variantHex = `${baseProperty}-hex: ${hex}`;
        const variantHsl = `${baseProperty}-hsl: ${h}, ${s}, ${l}`;
        const variantRgb = `${baseProperty}-rgb: ${r}, ${g}, ${b}`;

        return [...accum, variant, variantHex, variantHsl, variantRgb];
      },
      []
    );
    return variants;
  }
}
