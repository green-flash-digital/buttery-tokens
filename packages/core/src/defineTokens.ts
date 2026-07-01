import type { z } from "zod";

import { ConfigSchema, type ButteryTokensConfig } from "./schemas/schema.js";
import type { TokenTemplate } from "./templates/types.js";

export type ButteryTokensConfigInput = z.input<typeof ConfigSchema>;

type AnyTemplate = TokenTemplate<Record<string, unknown>, Record<string, unknown>>;

export type ButteryTokensDefinition<T extends AnyTemplate[] = AnyTemplate[]> = {
  config: ButteryTokensConfig;
  templates: T;
};

export function defineTokens<T extends AnyTemplate[]>(input: {
  tokens: ButteryTokensConfigInput;
  templates?: [...T];
}): ButteryTokensDefinition<T> {
  return {
    config: ConfigSchema.parse(input.tokens),
    templates: (input.templates ?? []) as T,
  };
}
