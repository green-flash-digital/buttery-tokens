export type MakeFontBaseSize = (token: number) => string;
/**
 * ## Description
 * Returns the token used to set the base font size of the document body.
 *
 * ## Usage
 * ### css-in-ts
 * ```ts
 * import { css } from "@linaria/core";
 * import { makeFontBaseSize } from "@buttery/tokens/playground";
 *
 * const bodyStyles = css`
 *  body: {
 *    font-size: ${makeFontBaseSize("16")};
 *  }
 *
 * `
 * ```
 */
export declare const makeFontBaseSize: MakeFontBaseSize;
