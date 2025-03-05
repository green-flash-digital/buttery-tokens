import { createButteryTokens } from "@buttery/core";

import { LOG } from "./scripts.utils";

async function buildStudioTokens() {
  try {
    LOG.debug("Building...");
    const butteryTokens = await createButteryTokens({
      logLevel: "trace",
      env: "development",
      autoInit: true,
    });
    if (!butteryTokens) return;
    await butteryTokens.build();
  } catch (error) {
    LOG.fatal(error);
  }
}

buildStudioTokens();
