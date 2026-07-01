import path from "node:path";
import { ButteryTokens } from "@buttery/core";
import definition from "../.buttery/config.js";

const cwd = path.resolve(import.meta.dirname, "..");

export const StudioTokens = new ButteryTokens({
  logLevel: "trace",
  env: "development",
  definition,
  cwd,
});
