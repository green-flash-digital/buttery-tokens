import type { LogLevel } from "@buttery/core";
import { ButteryTokens } from "@buttery/core";
import { type Action, defineOptions, type Meta } from "fizmoo";

export const meta: Meta = {
  name: "build",
  description: "Builds the buttery-tokens based upon the set configuration",
};

export const options = defineOptions({
  "log-level": {
    type: "string",
    alias: "l",
    description: "Set's the log level",
    default: "info",
  },
});

export const action: Action<never, typeof options> = async ({ options }) => {
  const logLevel = (options?.["log-level"] as LogLevel) ?? "info";
  const tokens = new ButteryTokens({
    logLevel,
    env: "production",
    autoInit: true,
  });

  await tokens.build();
};
