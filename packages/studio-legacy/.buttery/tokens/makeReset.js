const matchGuard = (_) => {
    throw new Error(`Forgot to include an ${_} in the switch statement`);
};
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
export const makeReset = (element) => {
    switch (element) {
        case "ul":
            return `
          margin: 0;
          padding: 0;

          li {
            margin: 0;
            padding: 0;
            list-style-type: none;
          }
        `;
        case "button":
            return `
          margin: 0;
          padding: 0;
          border: none;
          background: none;
        `;
        case "body":
            return `
          margin: 0;
          padding: 0;
        `;
        case "anchor":
            return `
          text-decoration: none;
          color: inherit;

          &:visited {
            color: inherit;
          }
        `;
        case "input":
            return `
          margin: 0;
          padding: 0;
          border: none;
          background: none;
          font: inherit;
          color: inherit;
          appearance: none;
          outline: none;
          box-sizing: border-box;
          width: inherit;

          &[type="number"]::-webkit-inner-spin-button,
          &[type="number"]::-webkit-outer-spin-button {
            appearance: none;
            margin: 0;
          }

          // range
          &[type="range"]::-ms-track {
            background: transparent; /* Transparent since MS uses a pseudo track */
            border-color: transparent;
            color: transparent;
          },
          &[type="range"]::-webkit-slider-thumb {
            appearance: none;
            -webkit-appearance: none; /* Removes default styling */
          }
          &[type="range"]:focus {
            outline: none;
          }
        `;
        default:
            return matchGuard(element);
    }
};
