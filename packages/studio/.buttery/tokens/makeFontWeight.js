/**
 * ## Description
 * A utility that returns the CSS variable assigned to keys of the `font.family` that are defined in the `buttery.config.ts`
 *
 * ## Usage
 * ### css-in-ts
 * ```ts
 * import { css } from "@linaria/core";
 * import { makeFontWeight } from "@buttery/tokens/playground";
 *
 * const styles = css`
 *   font-weight: ${makeFontWeight("Poppins-bold")};
 * `
 * ```
 *
 * ### style-object
 * ```ts
 * import { forwardRef } from "react"
 * import { makeFontWeight } from "@buttery/tokens/playground";
 *
 * const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
 *  ({ children, style, ...restProps }, ref) => {
 *    return (
 *      <button
 *        {...restProps}
 *        style={{ fontWeight: makeFontWeight("Poppins-bold") }}
 *        ref={ref}
 *      >
 *        {children}
 *      </button>
 *    );
 *  }
 * );
 * ```
 */
export const makeFontWeight = (fontFamilyAndWeight) => {
    return `var(--playground-font-weight-${fontFamilyAndWeight})`;
};
