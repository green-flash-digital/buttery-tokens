export type CSSPrefixes =
  | "color"
  | "custom"
  | "font-base"
  | "font-family"
  | "font-weight";

export function createCSSProperty(
  root: string,
  prefix: CSSPrefixes,
  ...args: string[]
): string {
  const base = `--${root}-${prefix}`;
  if (args.length === 0) return base;
  const rest = args.join("-");
  return `${base}-${rest}`;
}
