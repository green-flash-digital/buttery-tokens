export declare const colorAndVariants: {
    "primary-50": string;
    "primary-100": string;
    "primary-200": string;
    "primary-300": string;
    "primary-400": string;
    "primary-500": string;
    "primary-600": string;
    "primary-700": string;
    "primary-800": string;
    "primary-900": string;
    primary: string;
    "secondary-50": string;
    "secondary-100": string;
    "secondary-200": string;
    "secondary-300": string;
    "secondary-400": string;
    "secondary-500": string;
    "secondary-600": string;
    "secondary-700": string;
    "secondary-800": string;
    "secondary-900": string;
    secondary: string;
    "warning-50": string;
    "warning-100": string;
    "warning-200": string;
    "warning-300": string;
    "warning-400": string;
    "warning-500": string;
    warning: string;
    "danger-50": string;
    "danger-100": string;
    "danger-200": string;
    "danger-300": string;
    danger: string;
    "success-50": string;
    "success-100": string;
    "success-200": string;
    "success-300": string;
    "success-400": string;
    "success-500": string;
    "success-600": string;
    "success-700": string;
    "success-800": string;
    "success-900": string;
    success: string;
    background: string;
    surface: string;
    neutral: string;
    "neutral-dark": string;
    "neutral-light": string;
};
export type ColorAndVariants = keyof typeof colorAndVariants;
export type MakeColorOptions = {
    opacity?: number;
};
/**
 * ## Description
 * A utility that allows you to safely incorporate brand color into your apps by easily adding the design token along with optional adjustments & variants.
 *
 * ## Usage
 * ### css-in-ts
 * ```ts
 * import { css } from "@linaria/core";
 * import { makeColor } from "@buttery/tokens/playground";
 *
 * const Button = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
 *  ({ children, style, ...restProps }, ref) => {
 *    return (
 *      <button
 *        {...restProps}
 *        style={{ color: makeColor("primary-50") }}
 *        ref={ref}
 *      >
 *        {children}
 *      </button>
 *    );
 *  }
 * );
 *
 * `
 * ```
 */
export declare function makeColor<T extends ColorAndVariants>(tokenName: T, options?: MakeColorOptions): string;
