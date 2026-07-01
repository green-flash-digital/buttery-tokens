import type { TokensConfig } from "../ButteryTokens.js";
import type { TokenManifest } from "../TokenManifest.js";

export type TokenTemplate = {
  name: string;
  description?: string;
  namespace: string;
  tokens(config: TokensConfig): Record<string, unknown>;
  cssProperties(config: TokensConfig): string[];
  util?: (tokens: TokenManifest) => object;
};

export function defineTemplate<T extends TokenTemplate>(def: T): T {
  return def;
}
