export type CustomTokens = "";
export type MakeCustom = (tokenName: CustomTokens) => string | number;

/**
* ## `makeCustom`
* Enables to references custom tokens that don't fit within the bounds of the static configuration points. This is good for things like navigational headers, footers, or any other heights, 1-off colors, etc... that need to be shared across all parts of the application
*/
export const makeCustom: MakeCustom = (value) => {
  return `var(studio-${value})`
};
