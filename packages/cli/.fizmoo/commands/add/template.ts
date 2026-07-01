import path from "node:path";
import { writeFileRecursive } from "ts-jolt/node";
import { ButteryTokens } from "@buttery/core";
import { defineArgs, type Action, type Meta } from "fizmoo";

export const meta: Meta = {
  name: "template",
  description: "Scaffolds a new custom token template in .buttery/templates/",
};

export const args = defineArgs({
  name: {
    name: "name",
    type: "string",
    description: "Name of the template in kebab-case (e.g. make-border)",
    required: true,
  },
});

export const action: Action<typeof args> = async ({ args }) => {
  const tokens = new ButteryTokens({ logLevel: "info", autoInit: true });
  const config = await tokens.getConfig();

  const filePath = path.resolve(config.meta.dirPath, "templates", `${args.name}.ts`);

  await writeFileRecursive(
    filePath,
    `import { defineTemplate } from "@buttery/core";

export default defineTemplate({
  name: "${args.name}",
  description: "",
  namespace: "${args.name}",
  tokens(_config) {
    return {};
  },
  cssProperties(_config) {
    return [];
  },
  util(_tokens) {
    return {};
  },
});
`,
  );

  console.log(`Created .buttery/templates/${args.name}.ts`);
};
