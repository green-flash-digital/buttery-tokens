import path from "node:path";
import { watch, existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";

import { input } from "@inquirer/prompts";
import { DotDir, type DotDirResponse } from "dotdir";
import type { IsoScribeLogLevel } from "isoscribe";
import { Isoscribe, printAsBullets } from "isoscribe";
import { tryHandle } from "ts-jolt/isomorphic";
import { writeFileRecursive } from "ts-jolt/node";
import prettier from "prettier";
import { globby } from "globby";

import { ConfigSchema, type ButteryTokensConfig } from "./schemas/schema.js";
import type { ButteryTokensDefinition } from "./defineTokens.js";
import type { TokenManifest } from "./TokenManifest.js";
import { defineTemplate } from "./templates/types.js";
export { defineTokens } from "./defineTokens.js";
export type { ButteryTokensConfigInput, ButteryTokensDefinition } from "./defineTokens.js";
import type { TokenTemplate } from "./templates/types.js";
import { colorTemplate } from "./templates/Template.make-color.js";
import { customTemplate } from "./templates/Template.make-custom.js";
import { fontFamilyTemplate } from "./templates/Template.make-font-family.js";
import { fontWeightTemplate } from "./templates/Template.make-font-weight.js";
import { fontVariantTemplate } from "./templates/Template.make-font-variant.js";
import { pxTemplate } from "./templates/Template.make-px.js";
import { remTemplate } from "./templates/Template.make-rem.js";
import { resetTemplate } from "./templates/Template.make-reset.js";
import { responsiveTemplate } from "./templates/Template.make-responsive.js";
import { sizeTemplate } from "./templates/Template.make-size.js";
import { spaceTemplate } from "./templates/Template.make-space.js";

export type { TokenTemplate };
export { defineTemplate };

export type TokensConfigDirectories = {
  generated: string;
  versions: string;
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

export type LogLevel = IsoScribeLogLevel;

function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>,
): void {
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = target[key];
    if (
      srcVal !== null &&
      typeof srcVal === "object" &&
      !Array.isArray(srcVal) &&
      tgtVal !== null &&
      typeof tgtVal === "object" &&
      !Array.isArray(tgtVal)
    ) {
      deepMerge(
        tgtVal as Record<string, unknown>,
        srcVal as Record<string, unknown>,
      );
    } else {
      target[key] = srcVal;
    }
  }
}

export class ButteryTokens {
  private _log: Isoscribe;
  private _config: TokensConfig | undefined = undefined;
  private _configAutoInit: boolean;
  private _inlineDefinition: ButteryTokensDefinition | undefined;
  private _inlineCwd: string | undefined;

  constructor(options: {
    logLevel?: IsoScribeLogLevel;
    env?: "development" | "production";
    autoInit?: boolean;
    /** Definition produced by `defineTokens()`. When provided, DotDir lookup is skipped. */
    definition?: ButteryTokensDefinition;
    /** Directory that contains the `.buttery/` folder. Defaults to `process.cwd()`. Required when `definition` is provided. */
    cwd?: string;
  }) {
    const logLevel =
      (process.env.BUTTERY_TOKENS_LOG_LEVEL as IsoScribeLogLevel) ??
      options.logLevel ??
      "info";
    process.env.BUTTERY_TOKENS_ENV =
      options.env ?? process.env.BUTTERY_TOKENS_ENV ?? "development";

    this._configAutoInit = options.autoInit ?? false;
    this._inlineDefinition = options.definition;
    this._inlineCwd = options.cwd;
    this._log = new Isoscribe({
      name: "@buttery/core",
      logFormat: "string",
      logLevel,
    });
  }

  private _getDirsFromConfig(
    dotDirRes: DotDirResponse<ButteryTokensConfig>,
  ): TokensConfigDirectories {
    const generated = path.resolve(dotDirRes.meta.dirPath, "./_generated");
    const versions = path.resolve(dotDirRes.meta.dirName, "./versions");
    return { generated, versions };
  }

  async getConfig(options?: GetConfigOptions): Promise<TokensConfig> {
    const shouldGetNew = options?.noCache ?? false;

    if (this._config && !shouldGetNew) return this._config;

    if (this._inlineDefinition) {
      const cwd = this._inlineCwd ?? process.cwd();
      const butteryDir = path.resolve(cwd, ".buttery");
      this._config = {
        config: this._inlineDefinition.config,
        meta: {
          dirPath: butteryDir,
          dirName: cwd,
          filePath: path.resolve(butteryDir, "config.ts"),
        } as DotDirResponse<ButteryTokensConfig>["meta"],
        dirs: {
          generated: path.resolve(butteryDir, "_generated"),
          versions: path.resolve(cwd, "versions"),
        },
      } as TokensConfig;
      return this._config;
    }

    const dotDir = new DotDir<ButteryTokensConfig>();
    const dirRes = await tryHandle(dotDir.find)({ dirName: "buttery" });
    if (dirRes.data) {
      this._config = {
        ...dirRes.data,
        dirs: this._getDirsFromConfig(dirRes.data),
      };
      return this._config;
    }

    let shouldBootstrap = false;
    this._log.warn(
      "Unable to located the necessary directories to initialize buttery-tokens",
    );
    if (this._configAutoInit) {
      this._log.debug(
        "AutoInit has been enabled. Bootstrapping the required assets",
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

    const prefix = await input({
      message:
        "What prefix would you like to use for your CSS tokens? (https://buttery-tokens/concepts/token-prefixing)",
    });

    const configJson = ConfigSchema.parse({
      runtime: { prefix },
    } as ButteryTokensConfig);
    const butteryTokensConfigContent = JSON.stringify(configJson, null, 2);

    await writeFileRecursive(
      butteryTokensConfigPath,
      butteryTokensConfigContent,
    );

    const config = await this.getConfig();
    return config;
  }

  printError(error: string | Error | unknown) {
    if (error instanceof Error) {
      this._log.fatal(error);
    }
    if (typeof error === "string") {
      this._log.fatal(new Error(error));
    }
    this._log.fatal(new Error(String(`Unknown error: ${error}`)));
  }

  async build(
    options?: GetConfigOptions & { extraTemplates?: TokenTemplate[] },
  ) {
    try {
      const config = await this.getConfig(options);
      this._log.info("Building buttery tokens");

      const builtinTemplates: TokenTemplate[] = [
        colorTemplate,
        customTemplate,
        fontFamilyTemplate,
        fontWeightTemplate,
        fontVariantTemplate,
        spaceTemplate,
        sizeTemplate,
        pxTemplate,
        remTemplate,
        resetTemplate,
        responsiveTemplate,
      ];

      const templates: TokenTemplate[] = [
        ...builtinTemplates,
        ...(this._inlineDefinition?.templates ?? []),
        ...(options?.extraTemplates ?? []),
      ];

      // Auto-discover file-based user templates from .buttery/templates/
      type FileTemplate = { template: TokenTemplate; relPath: string };
      const fileTemplates: FileTemplate[] = [];
      const userTemplatesDir = path.resolve(config.meta.dirPath, "templates");
      if (existsSync(userTemplatesDir)) {
        const userTemplateFiles = await globby(
          `${userTemplatesDir}/**/*.{ts,js}`,
          { absolute: true },
        );
        for (const file of userTemplateFiles) {
          try {
            const mod = await import(file);
            const template = (mod.default ?? mod) as TokenTemplate;
            if (
              typeof template.name === "string" &&
              typeof template.namespace === "string" &&
              typeof template.tokens === "function" &&
              typeof template.cssProperties === "function"
            ) {
              const relPath = path
                .relative(config.dirs.generated, file)
                .replace(/\\/g, "/")
                .replace(/\.ts$/, ".js");
              fileTemplates.push({ template, relPath });
              templates.push(template);
              this._log.debug(
                `Loaded user template "${template.name}" from ${path.relative(config.meta.dirPath, file)}`,
              );
            } else {
              this._log.warn(
                `Skipping ${path.relative(config.meta.dirPath, file)}: default export is not a valid TokenTemplate`,
              );
            }
          } catch (err) {
            this._log.warn(
              `Failed to load user template at ${path.relative(config.meta.dirPath, file)}: ${err instanceof Error ? err.message : String(err)}`,
            );
          }
        }
      }

      // 1. Collect token data from all templates into a single manifest
      this._log.debug("Collecting token manifest...");
      const manifest: Record<string, unknown> = {
        prefix: config.config.runtime.prefix,
      };
      for (const template of templates) {
        deepMerge(manifest, template.tokens(config));
      }

      // 2. Write _tokens.ts — the single generated TypeScript file
      this._log.debug("Writing _tokens.ts manifest...");
      const tokensContent =
        `// auto-generated by buttery-tokens — do not edit\n` +
        `export const tokens = ${JSON.stringify(manifest, null, 2)} as const;\n`;
      await writeFileRecursive(
        path.resolve(config.dirs.generated, "_tokens.ts"),
        tokensContent,
      );
      this._log.debug("Writing _tokens.ts manifest... done.");

      // 3. Collect CSS properties and write root.css
      this._log.debug("Generating css :root...");
      let cssProperties: string[] = [];
      for (const template of templates) {
        cssProperties = cssProperties.concat(template.cssProperties(config));
      }
      const rootCSSContent = `:root { ${cssProperties.join(";")} }`;
      await writeFileRecursive(
        path.resolve(config.dirs.generated, "./root.css"),
        rootCSSContent,
      );
      this._log.debug("Generating css :root... done.");

      // 4. Generate makeUtils.ts — one export block per template
      this._log.debug("Generating makeUtils.ts...");

      const builtinVarMap = new Map<TokenTemplate, string>([
        [colorTemplate, "colorTemplate"],
        [customTemplate, "customTemplate"],
        [fontFamilyTemplate, "fontFamilyTemplate"],
        [fontWeightTemplate, "fontWeightTemplate"],
        [fontVariantTemplate, "fontVariantTemplate"],
        [spaceTemplate, "spaceTemplate"],
        [sizeTemplate, "sizeTemplate"],
        [pxTemplate, "pxTemplate"],
        [remTemplate, "remTemplate"],
        [resetTemplate, "resetTemplate"],
        [responsiveTemplate, "responsiveTemplate"],
      ]);

      const importLines: string[] = [
        `import {`,
        `  colorTemplate,`,
        `  customTemplate,`,
        `  fontFamilyTemplate,`,
        `  fontWeightTemplate,`,
        `  fontVariantTemplate,`,
        `  spaceTemplate,`,
        `  sizeTemplate,`,
        `  pxTemplate,`,
        `  remTemplate,`,
        `  resetTemplate,`,
        `  responsiveTemplate,`,
        `} from "@buttery/core/templates";`,
        `import { tokens } from "./_tokens.js";`,
      ];

      const exportLines: string[] = [];

      for (const template of builtinTemplates) {
        const varName = builtinVarMap.get(template)!;
        const keys = Object.keys(
          template.util(manifest as unknown as TokenManifest),
        );
        if (keys.length > 0) {
          exportLines.push(
            `export const { ${keys.join(", ")} } = ${varName}.util(tokens);`,
          );
        }
      }

      const inlineTemplates = this._inlineDefinition?.templates ?? [];
      if (inlineTemplates.length > 0) {
        importLines.push(`import _def from "../config.js";`);
        for (let i = 0; i < inlineTemplates.length; i++) {
          const keys = Object.keys(
            inlineTemplates[i].util(manifest as unknown as TokenManifest),
          );
          if (keys.length > 0) {
            exportLines.push(
              `export const { ${keys.join(", ")} } = _def.templates[${i}].util(tokens);`,
            );
          }
        }
      }

      for (let i = 0; i < fileTemplates.length; i++) {
        const { template, relPath } = fileTemplates[i];
        const varName = `_fileTemplate${i}`;
        importLines.push(`import ${varName} from "${relPath}";`);
        const keys = Object.keys(
          template.util(manifest as unknown as TokenManifest),
        );
        if (keys.length > 0) {
          exportLines.push(
            `export const { ${keys.join(", ")} } = ${varName}.util(tokens);`,
          );
        }
      }

      const makeUtilsContent = [
        `// auto-generated by buttery-tokens — do not edit`,
        ...importLines,
        ``,
        ...exportLines,
      ].join("\n");

      await writeFileRecursive(
        path.resolve(config.dirs.generated, "./makeUtils.ts"),
        makeUtilsContent,
      );
      this._log.debug("Generating makeUtils.ts... done.");

      // 5. Generate .buttery/index.ts barrel
      this._log.debug("Generating index.ts barrel...");
      const barrelContent = [
        `// auto-generated by buttery-tokens — do not edit`,
        `export * from "./_generated/makeUtils.js";`,
      ].join("\n");
      await writeFileRecursive(
        path.resolve(config.meta.dirPath, "./index.ts"),
        barrelContent,
      );
      this._log.debug("Generating index.ts barrel... done.");

      await this._formatGeneratedFiles();

      this._log.success(
        `Alright, alright alright! Successfully built the "${this._config?.config.runtime.prefix}" tokens & utilities`,
      );
    } catch (error) {
      this.printError(error);
    }
  }

  private async _formatGeneratedFiles() {
    this._log.debug("Formatting generated files...");
    const config = await this.getConfig();

    const prettierConfig = await prettier.resolveConfig(config.dirs.generated);
    const files = await globby(
      [
        `${config.dirs.generated}/**/*.{js,ts,jsx,tsx,json,css,md}`,
        path.resolve(config.meta.dirPath, "index.ts"),
      ],
      { absolute: true, gitignore: true },
    );

    for (const file of files) {
      const content = await readFile(file, "utf8");
      const formatted = await prettier.format(content, {
        ...prettierConfig,
        filepath: file,
      });
      if (formatted !== content) {
        await writeFile(file, formatted, "utf8");
      }
    }

    this._log.debug("Formatting generated files... done.");
    this._log.debug(`Successfully formatted ${files.length} files.`);
  }

  async dev() {
    await this.build({ noCache: true });
    let counter = 1;

    const config = await this.getConfig();
    const watcher = watch(config.meta.filePath);
    const watchedFileButteryConfig = path.relative(
      process.cwd(),
      config.meta.filePath,
    );
    this._log.watch(`Running subsequent builds in watch mode

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
