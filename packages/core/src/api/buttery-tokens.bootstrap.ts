import path from "path";

import { input } from "@inquirer/prompts";
import { tryHandle } from "ts-jolt/isomorphic";
import { writeFileRecursive } from "ts-jolt/node";

import type { ButteryTokensConfig } from "../schemas/index.js";
import { ConfigSchema } from "../schemas/index.js";

/**
 * A shared function that will prompt and then create the necessary
 * files to get buttery-tokens up and running.
 */
export async function bootstrap() {
  const rootDir = await input({
    message: `Where would you like to create your ".buttery/" dotdir?`,
    required: true,
    default: process.cwd(),
  });

  const butteryDir = path.resolve(rootDir, "./.buttery");
  const butteryTokensConfigPath = path.resolve(butteryDir, "./config.json");

  // Ask and set the CLI name
  const prefix = await input({
    message:
      "What prefix would you like to use for your CSS tokens? (https://buttery-tokens/concepts/token-prefixing)",
  });

  const configJson = ConfigSchema.parse({
    runtime: {
      prefix,
    },
  } as ButteryTokensConfig);
  const fizmooConfigContent = JSON.stringify(configJson, null, 2);

  const configRes = await tryHandle(writeFileRecursive)(
    butteryTokensConfigPath,
    fizmooConfigContent
  );
  if (configRes.hasError) {
    throw configRes.error;
  }

  return configRes.data;
}
