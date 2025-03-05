import type { DotDirResponse } from "dotdir";

import { LOG } from "./buttery-tokens.utils.js";

import type { ButteryTokensConfig } from "../schemas/schema.js";

export class ButteryTokens {
  private _config: DotDirResponse<ButteryTokensConfig>["config"];
  private _meta: DotDirResponse<ButteryTokensConfig>["meta"];

  constructor(config: DotDirResponse<ButteryTokensConfig>) {
    this._config = config.config;
    this._meta = config.meta;
    this._init();
  }

  private _init() {
    LOG.debug("Initializing buttery-tokens...");
    console.log({ config: this._config, meta: this._meta });
  }

  async build() {
    LOG.debug("Building buttery tokens");
  }
}
