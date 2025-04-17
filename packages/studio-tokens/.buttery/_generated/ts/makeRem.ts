/**
* ## `makeRem`
* A utility that returns the rem value of the pixel number provided. This utility is intended to reduce the mental load of translating pixel units (that are commonly provided in design assets) into rem units which are necessary for creating interfaces that scale with browser defaults & zoom levels.
*/
export const makeRem = (px: number) => `${pixel / 16}rem`;
    