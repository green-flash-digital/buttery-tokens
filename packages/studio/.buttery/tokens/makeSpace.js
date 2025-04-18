/**
 * ## Description
 * Returns the token associated with the specific spacing token
 *
 * ## Usage
 * ### css-in-ts
 * ```ts
 * import { css } from "@linaria/core";
 * import { makeSpace } from "@buttery/tokens/playground";
 *
 * const divClassName = css`
 *   position: sticky;
 *   top: ${makeSpace(0)};;
 * `
 * ```
 *
 * ### style-object
 * ```ts
 * import { forwardRef } from "react"
 * import { makeSpace } from "@buttery/tokens/playground";;
 *
 * const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
 *  ({ children, style, ...restProps }, ref) => {
 *    return (
 *      <button
 *        {...restProps}
 *        style={{
 *          position: "sticky",
 *          padding: 0 makeSpace(0,1,2,3,4) }}
 *        ref={ref}
 *      >
 *        {children}
 *      </button>
 *    );
 *  }
 * );
 * ```
 */
export const makeSpace = (value, options) => {
    const unit = options?.unit ?? "rem";
    return `var(--playground-space-${value}-${unit})`;
};
