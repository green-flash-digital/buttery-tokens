import type { ButteryTokensConfig } from "../schemas/schema.js";

export function remFromConfig(
  config: ButteryTokensConfig,
  value: number
): string {
  return (value / config.sizeAndSpace.baseFontSize).toString();
}
