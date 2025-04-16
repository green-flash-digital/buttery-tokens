import { ButteryTokens } from "@buttery/core";

const tokens = new ButteryTokens({
  logLevel: "trace",
  env: "development",
  autoInit: true,
});

await tokens.build();
