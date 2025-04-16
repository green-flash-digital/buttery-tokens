import { exhaustiveMatchGuard } from "ts-jolt/isomorphic";

export type TemplateTypes = "scss" | "ts";

export class Template {
  protected _name: string;
  protected _description: string;
  protected _namespace: string;
  protected _prefix: string | undefined = undefined;

  constructor(options: {
    prefix: string;
    name: string;
    description: string;
    namespace: string;
  }) {
    this._name = options.name;
    this._description = options.description;
    this._namespace = options.namespace;
  }

  setPrefix(prefix: string) {
    this._prefix = prefix;
  }

  getPrefix() {
    if (!this._prefix) {
      throw `Unable to compile "${this._name}" template. CSS prefix has not been set.`;
    }
    return this._prefix;
  }

  makeUtilTS(): string {
    throw `A TypeScript template creator has not been set for ${this._name}`;
  }

  makeUtilSCSS() {
    throw `A SCSS template creator has not been set for ${this._name}`;
  }

  makeCSSProperties(): string[] {
    throw `A CSS Property creator has not been set for ${this._name}`;
  }

  protected _createUnionType(arr: string[]): string {
    return arr.reduce<string>((accum, val, i, origArr) => {
      accum.concat(`"${val}"`);
      if (i < origArr.length - 1) {
        return accum.concat(`"${val}" | `);
      }
      return accum.concat(`"${val}"`);
    }, "");
  }

  protected _createDocsDescription(type: TemplateTypes) {
    switch (type) {
      case "ts":
        return `/**
* # ${this._name};
*
* ## Description
* ${this._description};
*/`;

      case "scss":
        return "";

      default:
        return exhaustiveMatchGuard(type);
    }
  }

  protected _createCSSProperty(...args: string[]) {
    const prefix = this.getPrefix();
    const base = `--${prefix}-${this._namespace}`;
    if (args.length === 0) return base;
    const rest = args.join("-");
    return `${base}-${rest}`;
  }
}
