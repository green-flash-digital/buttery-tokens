import { createButteryTokens } from "@buttery/core";

import { LOG } from "./scripts.utils.js";

(async () => {
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
    LOG.fatal(new Error(String(error)));
  }
})();
