import { Isoscribe } from "isoscribe";

export const LOG = new Isoscribe({
  name: "@buttery/core",
  logFormat: "string",
  logLevel: "debug",
});
