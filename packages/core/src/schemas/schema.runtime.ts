import { z } from "zod";

import { optionalSchema, withDescription } from "./schema-utils.js";

export const RuntimeSchema = withDescription(
  z.object({
    /**
     * ## Description
     * A namespace that will be appended to the import of the buttery tokens package.
     *
     * @example playground = `import { makeRem } from "@buttery/tokens/playground"`
     *
     * ## Overview
     * The general idea here is that we're going to assume that mono-repos are relatively ubiquitous
     * have significant wide spread adoption. With that there might be several applications that need
     * to have tokens created for them. Naturally, it doesn't make sense to do some import gymnastics where
     * you need to destructure the import on an unknown key.
     *
     * Instead, adding the `namespace` will build your tokens to another directory inside of the buttery tokens
     * package where then can be easily imported using an barrel file of that name at the root of the buttery
     * tokens distro. All of the documentation will update with the import name so you can be sure that you're importing
     * the right thing
     */
    namespace: z.string(),
    /**
     * ## Description
     * A string that will prefix all of the CSS Variables that are used.
     *
     * ## Overview
     * This value is important in order to avoid `:root` level conflicts in your application's CSS.
     * Essentially this value namespaces your tokens so they don't conflict with any others.
     *
     * ## Examples
     * Let's take a very simple example `--navbar-height`. This seems like a pretty specific variable
     * however if there are 3rd party libraries that are also included, there could be another CSS Variable
     * or in this case, token, that would conflict with this. In order to ensure that all of the tokens are reconciled
     * properly through this packages utilities, we set a `prefix` to namespace our tokens to avoid those property clashes.
     *
     * @example
     * `--navbar-height` becomes `--${prefix}-navbar-height`
     */
    prefix: z.string(),
    /**
     * ## Description
     * Enforces all constraints in the utilities.
     * - `true` - throws if the constrains of a utility are violated at runtime
     * - `false` - prints a warning if the constrains of a utility are violated at runtime
     *
     * ## Uses Cases
     * Depending upon your use case, this can be flipped. If you're in a distributed / global team that needs more control
     * (i.e. bumpers on your proverbial bolling alley lanes) you should most likely set this to true. This will evaluate at
     * build time and prevent you from releasing any interface without first satisfying the requirements.
     *
     * If you're on a smaller / more agile team, this can be set to false to increase the speed at which you develop, however
     * it will print warnings at develop / build time to ensure that you know you're doing things against the constraints of
     * tool.
     *
     * @default true
     */
    strict: optionalSchema(z.boolean(), true),
    /**
     * Stops the warnings from being printed to the console when `runtime.strict === false`. This should be used SPARINGLY
     * @default false
     */
    suppressStrictWarnings: optionalSchema(z.boolean(), false),
  })
).default({
  namespace: "new",
  prefix: "new",
});
export type ButteryTokensConfigRuntime = z.infer<typeof RuntimeSchema>;
