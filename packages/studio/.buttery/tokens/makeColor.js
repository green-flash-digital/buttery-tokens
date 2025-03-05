export const colorAndVariants = {
    "primary-50": "#ffff92",
    "primary-100": "#fbf07c",
    "primary-200": "#f5e166",
    "primary-300": "#f0d350",
    "primary-400": "#e9c437",
    "primary-500": "#dab224",
    "primary-600": "#c19d1b",
    "primary-700": "#a98812",
    "primary-800": "#927408",
    "primary-900": "#7c6000",
    "primary": "#e6bd29",
    "secondary-50": "#adffff",
    "secondary-100": "#97faf2",
    "secondary-200": "#80f4e5",
    "secondary-300": "#65efd9",
    "secondary-400": "#43e9cc",
    "secondary-500": "#25dabb",
    "secondary-600": "#1cc4a5",
    "secondary-700": "#13ad90",
    "secondary-800": "#09977c",
    "secondary-900": "#008268",
    "secondary": "#29e6c6",
    "warning-50": "#ffff99",
    "warning-100": "#f6f572",
    "warning-200": "#ebeb46",
    "warning-300": "#cfd221",
    "warning-400": "#a4ab11",
    "warning-500": "#7b8500",
    "warning": "#e5e629",
    "danger-50": "#ff9984",
    "danger-100": "#f05748",
    "danger-200": "#bf1b1e",
    "danger-300": "#740000",
    "danger": "#e6292c",
    "success-50": "#adffb0",
    "success-100": "#98fa9b",
    "success-200": "#80f485",
    "success-300": "#66ef6f",
    "success-400": "#43e958",
    "success-500": "#25da44",
    "success-600": "#1dc335",
    "success-700": "#14ac26",
    "success-800": "#0a9615",
    "success-900": "#008100",
    "success": "#29e64c",
    "background": "#fff",
    "surface": "#fff",
    "neutral": "#030305",
    "neutral-dark": "#030304",
    "neutral-light": "#030306"
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
export function makeColor(tokenName, options) {
    const opacity = options?.opacity ?? 1;
    return `rgba(var(--playground-color-${tokenName}-rgb), ${opacity})`;
}
