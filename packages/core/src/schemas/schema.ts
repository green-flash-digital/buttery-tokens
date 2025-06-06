import { z } from "zod";

import { FontSchema } from "./schema.font.js";
import { ColorSchema } from "./schema.color.js";
import { ResponseSchema } from "./schema.response.js";
import { SizeAndSpaceSchema } from "./schema.size-and-space.js";
import { RuntimeSchema } from "./schema.runtime.js";
import { CustomSchema } from "./schema.custom.js";

export const ConfigSchema = z
  .object({
    // add a schema field onto the output JSON schema so we
    // can correctly reference the file
    $schema: z
      .string()
      .default("https://schemas.greenflash.digital/buttery-tokens.json"),
  })
  .extend({
    runtime: RuntimeSchema,
    sizeAndSpace: SizeAndSpaceSchema,
    font: FontSchema,
    response: ResponseSchema,
    color: ColorSchema,
    custom: CustomSchema,
  });
export type ButteryTokensConfig = z.infer<typeof ConfigSchema>;
