export type FontFamily = "";
export type MakeFontFamily = (fontFamilyName: FontFamily) => string;
  
  /**
* ## `makeFontFamily`
* A utility that returns the CSS variable assigned to the font-family`
*/
export const makeFontFamily: MakeFontFamily = (value) => {
    return `var(studio-${value})`
};
