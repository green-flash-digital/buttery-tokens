import { resolve } from "node:path";

import { reactRouter } from "@react-router/dev/vite";
import { defineConfig, mergeConfig } from "vite";

import baseConfig from "./vite.config.base";

const __this_dirname = import.meta.dirname;

export default mergeConfig(
  baseConfig,
  defineConfig({
    clearScreen: false,
    plugins: [reactRouter()],
    resolve: {
      alias: {
        "@tokens": resolve(__this_dirname, "./.buttery/tokens/index.js"),
        "@tokens/css": resolve(__this_dirname, "./.buttery/tokens/styles.css"),
      },
    },
  })
);
