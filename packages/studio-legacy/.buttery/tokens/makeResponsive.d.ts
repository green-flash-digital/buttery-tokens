export type Breakpoints = "phone" | "tablet" | "desktop";
export type MakeResponsive = (params: {
    from?: Breakpoints;
    to?: Breakpoints;
}) => string;
/**
 * ## Description
 * A utility that enables you to easily create a `@media`
string that can be interpolated in CSS-in-JS syntax.
 *
 * ## Usage
 * ### css-in-ts
 * ```ts
 * import { css } from "@linaria/core";
 * import { makeResponsive } from "@buttery/tokens/playground";
 *
 * const aClassName = css`
 *   ${makeResponsive({ from: "phone" })} {
 *     display: none;
 *   }
 * `
 * ```
 */
export declare const makeResponsive: MakeResponsive;
