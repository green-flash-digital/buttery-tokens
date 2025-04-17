import path from "node:path";

import { DotDir, type DotDirResponse } from "dotdir";
import type { IsoScribeLogLevel } from "isoscribe";
import { Isoscribe } from "isoscribe";
import { tryHandle } from "ts-jolt/isomorphic";
import { input } from "@inquirer/prompts";
import { writeFileRecursive } from "ts-jolt/node";

import { ConfigSchema, type ButteryTokensConfig } from "./schemas/schema.js";
import { TemplateMakeColor } from "./templates/Template.make-color.js";
import { TemplateMakeCustom } from "./templates/Template.make-custom.js";
import { TemplateMakeFontBaseSize } from "./templates/Template.make-font-base-size.js";
import { TemplateMakeFontFamily } from "./templates/Template.make-font-family.js";
import { TemplateMakeFontWeight } from "./templates/Template.make-font-weight.js";
import { TemplateMakePx } from "./templates/Template.make-px.js";
import { TemplateMakeRem } from "./templates/Template.make-rem.js";

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
    try {
      const config = await this._getConfig();
      this._log.debug("Building buttery tokens");

      const templates = [
        new TemplateMakeColor(config), // color
        new TemplateMakeCustom(config), // custom
        new TemplateMakeFontBaseSize(config), // font base size
        new TemplateMakeFontFamily(config), // font family
        new TemplateMakeFontWeight(config), // font weight
        new TemplateMakePx(config), // pixel
        new TemplateMakeRem(config), // rem
      ];

      // Set the prefix for all of the templates
      const templateNames = [];
      for (const template of templates) {
        template.setPrefix(config.config.runtime.prefix);
        templateNames.push(template.getName());
      }

      // Create the template barrel files
      this._log.debug("Generating util barrel files...");
      const barrelPathTs = path.resolve(config.dirs.ts, "./index.ts");
      const barrelContentTs = templateNames
        .map((templateName) => `export * from "./${templateName}.ts"`)
        .join(";\n")
        .concat(";\n");
      const barrelPathScss = path.resolve(config.dirs.scss, "./_index.scss");
      const barrelContentScss = templateNames
        .map((templateName) => `@import "./${templateName}"`)
        .join(";\n")
        .concat(";\n");
      await Promise.all([
        writeFileRecursive(barrelPathTs, barrelContentTs),
        writeFileRecursive(barrelPathScss, barrelContentScss),
      ]);
      this._log.debug("Generating util barrel files... done.");

      // Build all of the utils (ts | scss)
      this._log.debug("Generating css utils...");
      const createTemplateUtils = templates.map(async (template) => {
        await Promise.all([
          writeFileRecursive(
            path.resolve(config.dirs.ts, `${template.getName()}.ts`),
            template.makeUtilTS()
          ),
          writeFileRecursive(
            path.resolve(config.dirs.scss, `_${template.getName()}.scss`),
            template.makeUtilSCSS()
          ),
        ]);
      });
      await Promise.all(createTemplateUtils);
      this._log.debug("Generating css utils... done.");

      // Build the :root CSS
      this._log.debug("Generating css :root...");
      let cssProperties: string[] = [];
      for (const template of templates) {
        cssProperties = cssProperties.concat(template.makeCSSProperties());
      }
      const rootCSSContent = `:root { ${cssProperties.join(`;`)} }`;
      await writeFileRecursive(
        path.resolve(config.dirs.generated, "./root.css"),
        rootCSSContent
      );
      this._log.debug("Generating css :root... done.");
    } catch (error) {
      this._handleError(error);
    }
  }
}
