import { DotDir } from "dotdir";
import type { IsoScribeLogLevel } from "isoscribe";
import { tryHandle } from "ts-jolt/isomorphic";
import { confirm } from "@inquirer/prompts";

import { LOG } from "./buttery-tokens.utils.js";
import { ButteryTokens } from "./ButteryTokens.js";
import { bootstrap } from "./buttery-tokens.bootstrap.js";

import type { ButteryTokensConfig } from "../schemas/schema.js";

export async function createButteryTokens(options: {
  logLevel?: IsoScribeLogLevel;
  env?: "development" | "production";
  autoInit: boolean;
}) {
  // Set some options based upon the defaults
  const logLevel: IsoScribeLogLevel =
    (process.env.BUTTERY_TOKENS_LOG_LEVEL as IsoScribeLogLevel) ??
    options.logLevel ??
    "info";
  process.env.BUTTERY_TOKENS_ENV =
    options.env ?? process.env.BUTTERY_TOKENS_ENV ?? "development";

  LOG.logLevel = logLevel;

  LOG.debug('Locating the "./buttery" directory & config.json');
  // Get the configuration from the .buttery directory
  const dotDir = new DotDir<ButteryTokensConfig>(); // included in this closure since build is a one time thing
  const dirRes = await tryHandle(dotDir.find)({ dirName: "buttery" });
  if (dirRes.data) {
    // Create a new ButteryTokens instance
    LOG.debug("Creating a ButteryTokens instance");
    const buttery = new ButteryTokens(dirRes.data);
    return buttery;
  }

  LOG.warn(
    "Unable to located the necessary directories to initialize buttery-tokens"
  );
  let shouldBootstrap = false;

  // If auto init is enabled, then bootstrap the directories
  if (options.autoInit) {
    LOG.debug(
      "AutoInit has been enabled. Bootstrapping the required buttery-tokens directories and files."
    );
    shouldBootstrap = true;
  }

  // Prompt the user if they would like to bootstrap the directories
  if (!options.autoInit) {
    shouldBootstrap = await confirm({
      message:
        "Would you like to answer a few prompts to bootstrap buttery-tokens?",
    });
  }

  if (!shouldBootstrap) {
    return LOG.fatal(dirRes.error);
  }

  const resBootstrap = await tryHandle(bootstrap)();
  if (resBootstrap.hasError) {
    return LOG.fatal(resBootstrap.error);
  }

  // Recursively attempt to create the buttery instance again. This should only
  // be called once since we're assuming that the configuration was written successfully
  return createButteryTokens(options);
}
