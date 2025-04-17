export type FontFamilyAndWeight = "";
export type MakeFontWeight = (fontWeightName: FontFamilyAndWeight) => string;

/**
* ## `makeFontWeight`
* A utility that returns the CSS variable assigned to keys of the `font.family`
*/
export const makeFontWeight: MakeFontWeight = (fontFamilyAndWeight) => {
    return `var(studio-${fontFamilyAndWeight})`
};
  