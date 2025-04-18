/**
 * ## Description
 * A utility that concatenates 'px' onto the end of the provided value
 *
 * ## Usage
 * ### css-in-ts
 * ```ts
 * import { css } from "@linaria/core";
 * import { makePx } from "@buttery/tokens/playground";
 *
 * const aClassName = css`
 *   font-size: ${makePx(12)};
 * `
 * ```
 *
 * ### style-object
 * ```ts
 * import { forwardRef } from "react"
 * import { makePx } from "@buttery/tokens/playground";;
 *
 * const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
 *  ({ children, style, ...restProps }, ref) => {
 *    return (
 *      <button
 *        {...restProps}
 *        style={{ fontSize: makePx(12) }}
 *        ref={ref}
 *      >
 *        {children}
 *      </button>
 *    );
 *  }
 * );
 * ```
 */
export declare const makePx: (val: number) => string;
