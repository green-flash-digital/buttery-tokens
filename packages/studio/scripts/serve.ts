import path from "node:path";

import { StudioServer } from "../StudioServer.js";

const server = new StudioServer({
  configPath: path.resolve(import.meta.dirname, "../.buttery/config.json"),
  versionsDir: path.resolve(import.meta.dirname, "../.buttery/versions"),
});
server.listen();
