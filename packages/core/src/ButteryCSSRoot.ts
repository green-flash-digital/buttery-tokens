import path from "node:path";

import { writeFileRecursive } from "ts-jolt/node";
import { exhaustiveMatchGuard } from "ts-jolt/isomorphic";
import { match } from "ts-pattern";

import type { TokensConfig } from "./ButteryTokens.js";
import type { ButteryTokensConfig } from "./schemas/schema.js";
import {
  createBrandVariants,
  createCSSProperty,
  createNeutralVariants,
  hexToHsl,
  hexToRgb,
} from "./utils/index.js";

export class ButteryCSSRoot {
  private _config: TokensConfig;
  private _buildFns: {
    [key in keyof Omit<ButteryTokensConfig, "$schema">]: () => Promise<
      string[]
    >;
  };

  constructor(config: TokensConfig) {
    this._config = config;
    this._buildFns = {
      color: this._buildColor,
      custom: this._buildCustom,
      font: this._buildFont,
    };
  }

  /**
   * Reads the color config and builds the variants
   */
  private async _buildColor(): Promise<string[]> {
    const {
      color,
      runtime: { prefix },
    } = this._config.config;
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

    const variants = Object.entries(flatManifest).reduce<string[]>(
      (accum, [variantId, variantHexValue]) => {
        // construct the variant variables
        const propertyBase = createCSSProperty(prefix, "color", variantId);
        const hex = variantHexValue;
        const { h, s, l } = hexToHsl(hex);
        const { r, g, b } = hexToRgb(hex);
        const variant = `${propertyBase}: ${hex}`;
        const variantHex = `${propertyBase}-hex: ${hex}`;
        const variantHsl = `${propertyBase}-hsl: ${h}, ${s}, ${l}`;
        const variantRgb = `${propertyBase}-rgb: ${r}, ${g}, ${b}`;

        return [...accum, variant, variantHex, variantHsl, variantRgb];
      },
      []
    );

    return variants;
  }

  /**
   * Reads the custom config and builds the variants
   */
  private async _buildCustom(): Promise<string[]> {
    const {
      custom,
      sizeAndSpace,
      runtime: { prefix },
    } = this._config.config;

    return Object.entries(custom ?? {}).map(
      ([customToken, customTokenValue]) => {
        const property = createCSSProperty(prefix, "custom", customToken);
        switch (customTokenValue.type) {
          case "number":
          case "string":
            return `${property}: ${customTokenValue}`;

          case "rem": {
            const remValue = customTokenValue.value / sizeAndSpace.baseFontSize;
            return `${property}: ${remValue}rem`;
          }

          default:
            return exhaustiveMatchGuard(customTokenValue);
        }
      }
    );
  }

  /**
   * Reads the font config and builds the variants
   */
  private async _buildFont(): Promise<string[]> {
    const {
      sizeAndSpace,
      font,
      runtime: { prefix },
    } = this._config.config;

    // Base
    const baseFontPrefix = createCSSProperty(prefix, "font-base");
    const baseFont = `${baseFontPrefix}: ${sizeAndSpace.baseFontSize}`;

    // Families
    const fontFamilies = Object.entries(font.families ?? {}).map(
      ([fontFamilyName, fontFamilyValue]) => {
        const property = createCSSProperty(
          prefix,
          "font-family",
          fontFamilyName
        );
        return `${property}: "${fontFamilyName}", ${fontFamilyValue.fallback}`;
      }
    );

    // Weights
    const familyNameAndWeightName = match(font)
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

    return [baseFont, ...fontFamilies];
  }

  async build() {
    // Combine all of the properties from each of the configuration keys
    let properties: string[] = [];
    for (const fn of Object.values(this._buildFns)) {
      const topicProperties = await fn();
      properties = properties.concat(topicProperties);
    }

    // Create the file
    const cssFileContent = `:root { ${properties.join(`;`)} }`;
    const cssFilePath = path.resolve(this._config.dirs.generated, "./root.css");
    await writeFileRecursive(cssFilePath, cssFileContent);
  }
}
