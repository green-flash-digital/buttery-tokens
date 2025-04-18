export type MakeReset = (element: "ul" | "button" | "body" | "anchor" | "input") => string;
/**
 * ## Description
 * Returns some CSS resets for any given elements
 *
 * ## Usage
 * ### css-in-ts
 * ```ts
 * import { css } from "@linaria/core";
 * import { makeReset } from "@buttery/tokens/playground";
 *
 * const aClassName = css`
 *   ul {
 *     ${makeReset("ul")};
 *
 *     li {
 *       height: 24px;
 *       width: 24px;
 *     }
 *   }
 * `
 * ```
 */
export declare const makeReset: MakeReset;
