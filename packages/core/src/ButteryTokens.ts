import path from "node:path";
import { watch } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";

import { DotDir, type DotDirResponse } from "dotdir";
import type { IsoScribeLogLevel } from "isoscribe";
import { Isoscribe, printAsBullets } from "isoscribe";
import { tryHandle } from "ts-jolt/isomorphic";
import { input } from "@inquirer/prompts";
import { writeFileRecursive } from "ts-jolt/node";
import prettier from "prettier";
import { globby } from "globby";

import { ConfigSchema, type ButteryTokensConfig } from "./schemas/schema.js";
import { TemplateMakeColor } from "./templates/Template.make-color.js";
import { TemplateMakeCustom } from "./templates/Template.make-custom.js";
import { TemplateMakeFontBaseSize } from "./templates/Template.make-font-base-size.js";
import { TemplateMakeFontFamily } from "./templates/Template.make-font-family.js";
import { TemplateMakeFontWeight } from "./templates/Template.make-font-weight.js";
import { TemplateMakePx } from "./templates/Template.make-px.js";
import { TemplateMakeRem } from "./templates/Template.make-rem.js";
import { TemplateMakeReset } from "./templates/Template.make-reset.js";
import { TemplateMakeResponsive } from "./templates/Template.make-responsive.js";

export type TokensConfigDirectories = {
  generated: string;
  ts: string;
  scss: string;
};
export type TokensConfig = DotDirResponse<ButteryTokensConfig> & {
  dirs: TokensConfigDirectories;
};

type GetConfigOptions = {
  /**
   * Add this option if you wish to not use the cached config
   * but instead get a new one.
   */
  noCache?: boolean;
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

  private async _getConfig(options?: GetConfigOptions): Promise<TokensConfig> {
    const shouldGetNew = options?.noCache ?? false;

    // 1. Return the config
    // Return the config if it already exists
    if (this._config && !shouldGetNew) return this._config;

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
  async build(options?: GetConfigOptions) {
    try {
      const config = await this._getConfig(options);
      this._log.debug("Building buttery tokens");

      const templates = [
        new TemplateMakeColor(config), // color
        new TemplateMakeCustom(config), // custom
        new TemplateMakeFontBaseSize(config), // font base size
        new TemplateMakeFontFamily(config), // font family
        new TemplateMakeFontWeight(config), // font weight
        new TemplateMakePx(config), // pixel
        new TemplateMakeRem(config), // rem
        new TemplateMakeReset(config), // reset
        new TemplateMakeResponsive(config), // reset
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
        .map((templateName) => `export * from "./${templateName}.js"`)
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
            `${template.makeWatermark()}\n${template.makeUtilTS()}`
          ),
          writeFileRecursive(
            path.resolve(config.dirs.scss, `_${template.getName()}.scss`),
            `${template.makeWatermark()}\n${template.makeUtilSCSS()}`
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

      // Format the directories
      await this._formatGeneratedFiles();
    } catch (error) {
      this._handleError(error);
    }
  }

  /**
   * Formats all of the generated files with the default prettier
   * configuration
   */
  private async _formatGeneratedFiles() {
    this._log.debug("Formatting generated files...");
    const config = await this._getConfig();

    const dirToFormat = config.dirs.generated;

    const prettierConfig = await prettier.resolveConfig(dirToFormat);
    const files = await globby(
      [`${config.dirs.generated}/**/*.{js,ts,jsx,tsx,json,css,md}`],
      {
        cwd: dirToFormat,
        absolute: true,
        gitignore: true,
      }
    );

    for (const file of files) {
      const content = await readFile(file, "utf8");
      const formatted = await prettier.format(content, {
        ...prettierConfig,
        filepath: file, // important for parser inference
      });

      if (formatted !== content) {
        await writeFile(file, formatted, "utf8");
      }
    }

    this._log.debug("Formatting generated files... done.");
    this._log.debug(`Successfully formatted ${files.length} files.`);
  }

  async studio() {}

  async dev() {
    await this.build({ noCache: true });
    let counter = 1;

    const config = await this._getConfig();
    const watcher = watch(config.meta.filePath);
    const watchedFileButteryConfig = path.relative(
      process.cwd(),
      config.meta.filePath
    );
    this._log.watch(`Starting compilation in watch mode.
      
Watching for changes in the following files:${printAsBullets([
      watchedFileButteryConfig,
    ])}      
`);
    watcher.on("change", async (file) => {
      const relPath = path.relative(process.cwd(), file);
      counter++;
      this._log.watch(`"${relPath}" changed. Rebuilding.... (${counter}x)`);
      this.build({ noCache: true });
    });
  }
}
