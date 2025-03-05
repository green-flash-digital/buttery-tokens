import path from "node:path";

import { zodToJsonSchema } from "zod-to-json-schema";
import { Isoscribe } from "isoscribe";
import { tryHandle } from "ts-jolt/isomorphic";
import { writeFileRecursive } from "ts-jolt/node";

import { ConfigSchema } from "../src/schemas/schema.js";

const LOG = new Isoscribe({
  name: "buttery:tokens-utils",
  pillColor: "#ccc",
});

async function createJsonSchema() {
  LOG.debug("Converting the Config schema into a JSON schema");
  const jsonSchema = zodToJsonSchema(ConfigSchema, {
    name: "buttery-tokens",
    nameStrategy: "ref",
    target: "jsonSchema7",
  });
  LOG.debug("Converting the Config schema into a JSON schema... done.");

  LOG.debug("Writing to file");
  const res = await tryHandle(writeFileRecursive)(
    path.resolve(import.meta.dirname, "../dist/buttery-tokens.json"),
    JSON.stringify(jsonSchema, null, 2)
  );
  if (res.hasError) {
    throw LOG.fatal(res.error);
  }
  LOG.success(
    "Successfully created the JSON schema from the buttery Zod schemas"
  );
}

createJsonSchema();
