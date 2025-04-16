import path from "node:path";

import { DotDir, type DotDirResponse } from "dotdir";
import type { IsoScribeLogLevel } from "isoscribe";
import { Isoscribe } from "isoscribe";
import { tryHandle } from "ts-jolt/isomorphic";
import { input } from "@inquirer/prompts";
import { writeFileRecursive } from "ts-jolt/node";

import { ConfigSchema, type ButteryTokensConfig } from "./schemas/schema.js";
import { TemplateMakeColor } from "./templates/Template2.makeColor.js";

export type TokensConfigDirectories = {
  generated: string;
  ts: string;
  scss: string;
};
export type TokensConfig = DotDirResponse<ButteryTokensConfig> & {
  dirs: TokensConfigDirectories;
};

export class ButteryTokens {
  private _log: Isoscribe;
  private _config: TokensConfig | undefined = undefined;
  private _configAutoInit: boolean;

  constructor(options: {
    logLevel?: IsoScribeLogLevel;
    env?: "development" | "production";
    autoInit: boolean;
  }) {
    const logLevel =
      (process.env.BUTTERY_TOKENS_LOG_LEVEL as IsoScribeLogLevel) ??
      options.logLevel ??
      "info";
    process.env.BUTTERY_TOKENS_ENV =
      options.env ?? process.env.BUTTERY_TOKENS_ENV ?? "development";

    this._configAutoInit = options.autoInit;
    this._log = new Isoscribe({
      name: "@buttery/core",
      logFormat: "string",
      logLevel,
    });
  }

  private _getDirsFromConfig(
    dotDirRes: DotDirResponse<ButteryTokensConfig>
  ): TokensConfigDirectories {
    const generated = path.resolve(dotDirRes.meta.dirPath, "./_generated");
    return {
      generated,
      scss: path.resolve(generated, "./scss"),
      ts: path.resolve(generated, "./ts"),
    };
  }

  private async _getConfig(): Promise<TokensConfig> {
    // 1. Return the config
    // Return the config if it already exists
    if (this._config) return this._config;

    // 2. Get an existing configuration
    // Get the configuration from the .buttery directory
    const dotDir = new DotDir<ButteryTokensConfig>(); // included in this closure since build is a one time thing
    const dirRes = await tryHandle(dotDir.find)({ dirName: "buttery" });
    if (dirRes.data) {
      this._config = {
        ...dirRes.data,
        dirs: this._getDirsFromConfig(dirRes.data),
      };
      return this._config;
    }

    // 3. Bootstrap the config
    // .buttery directory doesn't exist, we need to bootstrap it
    let shouldBootstrap = false;
    this._log.warn(
      "Unable to located the necessary directories to initialize buttery-tokens"
    );
    if (this._configAutoInit) {
      this._log.debug(
        "AutoInit has been enabled. Bootstrapping the required assets"
      );
      shouldBootstrap = true;
    }
    if (!shouldBootstrap) throw dirRes.error;

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
    const butteryTokensConfigContent = JSON.stringify(configJson, null, 2);

    await writeFileRecursive(
      butteryTokensConfigPath,
      butteryTokensConfigContent
    );

    // Recursively call the method again to return the config
    // and the directories associated with that config
    const config = await this._getConfig();

    return config;
  }

  /**
   * Central handler for handling errors
   */
  private _handleError(error: string | Error | unknown) {
    if (error instanceof Error) {
      this._log.fatal(error);
    }
    if (typeof error === "string") {
      this._log.fatal(new Error(error));
    }
    this._log.fatal(new Error(String(`Unknown error: ${error}`)));
  }

  /**
   * Builds the :root CSS file and the utilities that
   * easily interface it
   */
  async build() {
    const config = await this._getConfig();
    this._log.debug("Building buttery tokens");

    const templates = [new TemplateMakeColor(config)];

    // Build all of the utils
    const templatePromises = templates.map(async (template) => {
      await Promise.all([
        writeFileRecursive(path.resolve(config.dirs.ts), template.makeUtilTS()),
        writeFileRecursive(
          path.resolve(config.dirs.scss),
          template.makeUtilSCSS()
        ),
      ]);
    });
    await Promise.all(templatePromises);

    // Build the :root CSS
    let cssProperties: string[] = [];
    for (const template of templates) {
      cssProperties = cssProperties.concat(template.makeCSSProperties());
    }
    const rootCSSContent = `:root { ${cssProperties.join(`;`)} }`;
    await writeFileRecursive(
      path.resolve(config.dirs.generated, "./root.css"),
      rootCSSContent
    );
  }
}
