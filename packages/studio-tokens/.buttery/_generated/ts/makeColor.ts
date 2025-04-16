export const colorAndVariants = {};
export type ColorAndVariants = keyof typeof colorAndVariants;
export type MakeColorOptions = { opacity?: number };

/**
* ## `makeColor`
* A utility that allows you to safely incorporate brand color into your apps by easily adding the design token along with optional adjustments & variants.
*/
export function makeColor<T extends ColorAndVariants>(tokenName: T, options?: MakeColorOptions): string {
  const opacity = options?.opacity ?? 1;
  return `rgba(var(studio-${tokenName}-rgb), ${opacity})`;
}
