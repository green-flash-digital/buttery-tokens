export type MakeFontBaseSize = (token: number) => string;

  
  /**
* ## `makeFontBaseSize`
* Returns the token used to set the base font size of the document body.
*/
export const makeFontBaseSize: MakeFontBaseSize = (value) => {
    return `var(studio-${value})`
};
  