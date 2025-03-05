/**
 * ## Description
 * A utility that enables to reference and use custom tokens that are defined in the `buttery.config.ts` file.
 *
 * It's important to note that the values that are associated with the token from
 * the config are going to be raw values. This is to ensure that there's not black
 * magic behind the scenes happening that makes the utility do more than just recall
 * the value with the token.
 *
 * With that said, there are options on the method that will allow you to recall
 * the value and add some simple processing on it. For instance, if the token value
 * is a number you would be able to use an option in the `makeCustom` function
 * to convert that value to a rem.
 *
 * ## Usage
 * ### css-in-ts
 * ```ts
 * import { css } from "@linaria/core";
 * import { makeCustom } from "@buttery/tokens/playground";
 *
 * const divClassName = css`
 *   position: sticky;
 *   top: ${makeCustom(layout-header-height)};;
 * `
 * ```
 *
 * ### style-object
 * ```ts
 * import { forwardRef } from "react"
 * import { makeCustom } from "@buttery/tokens/playground";;
 *
 * const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
 *  ({ children, style, ...restProps }, ref) => {
 *    return (
 *      <button
 *        {...restProps}
 *        style={{
 *          position: "sticky",
 *          top: makeCustom(layout-header-height,layout-max-width,layout-gutters,layout-section-title-height,modal-gutters) }}
 *        ref={ref}
 *      >
 *        {children}
 *      </button>
 *    );
 *  }
 * );
 * ```
 */
export const makeCustom = (value) => {
    return `var(--playground-custom-${value})`;
};
