import { readFile } from "node:fs/promises";
import path from "path";

import { input } from "@inquirer/prompts";
import { tryHandle } from "ts-jolt/isomorphic";
import { writeFileRecursive } from "ts-jolt/node";

import { ConfigSchema } from "../schemas/index.js";

/**
 * A shared function that will prompt and then create the necessary
 * files to get buttery up and running.
 */
export async function bootstrap() {
  const rootDir = await input({
    message: `Where would you like to create your ".buttery/" dotdir?`,
    required: true,
    default: process.cwd(),
  });

  const packageJsonPath = path.resolve(rootDir, "./package.json");
  const butteryDir = path.resolve(rootDir, "./.buttery");
  const butteryTokensConfigPath = path.resolve(butteryDir, "./config.json");
  const commandsDir = path.resolve(butteryDir, "./commands");
  let name = "";
  let description = "";

  // Try to default some options by importing the package.json
  const resPackageJson = await tryHandle(readFile)(packageJsonPath, "utf8");
  if (resPackageJson.data) {
    const json = JSON.parse(resPackageJson.data.toString());
    name = json.name ?? "";
    description = json.description ?? "";
  }

  // Ask and set the CLI name
  name = await input({
    message:
      "What would you like the CLI name to be? (This will also be the string used to instantiate the CLI)",
    default: name || undefined,
  });

  // Ask and set the CLI description
  description = await input({
    message: "Please provide a short description of the CLI's purpose & use",
    default: description || undefined,
  });

  // Ask and set the CLI commands dir
  const commandsDirRel = await input({
    message: `Where would you like to store your commands? (This path should be relative to ${butteryDir})`,
    default: "./commands",
  });

  const configJson = ConfigSchema.parse({
    name,
    description,
    commandsDir: commandsDirRel,
  });
  const fizmooConfigContent = JSON.stringify(configJson, null, 2);

  const configRes = await tryHandle(writeFileRecursive)(
    butteryTokensConfigPath,
    fizmooConfigContent
  );
  if (configRes.hasError) {
    throw configRes.error;
  }

  const myFirstCommandFilePath = path.resolve(commandsDir, "./start-here.ts");
  const myFirstCommandFileContent = `import type { Meta } from "buttery";

export const meta: Meta = {
  name: "start-here",
  description: "A standard command used to get started with Fizmoo",
};
`;
  const firstCommandRes = await tryHandle(writeFileRecursive)(
    myFirstCommandFilePath,
    myFirstCommandFileContent
  );
  if (firstCommandRes.hasError) {
    throw firstCommandRes.error;
  }

  return configRes.data;
}
