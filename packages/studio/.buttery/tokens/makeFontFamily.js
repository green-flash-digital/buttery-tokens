/**
 * ## Description
 * A utility that returns the CSS variable assigned to the font-family`
 *
 * ## Usage
 * ### css-in-ts
 * ```ts
 * import { css } from "@linaria/core";
 * import { makeFontFamily } from "@buttery/tokens/playground";
 *
 * const aClassName = css`
 *   font-family: ${makeFontFamily("Poppins")};
 * `
 * ```
 *
 * ### style-object
 * ```ts
 * import { forwardRef } from "react"
 * import { makeFontFamily } from "@buttery/tokens/playground";
 *
 * const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
 *  ({ children, style, ...restProps }, ref) => {
 *    return (
 *      <button
 *        {...restProps}
 *        style={{ fontFamily: makeFontFamily("Inter") }}
 *        ref={ref}
 *      >
 *        {children}
 *      </button>
 *    );
 *  }
 * );
 * ```
 */
export const makeFontFamily = (value) => {
    return `var(--playground-font-family-${value})`;
};
