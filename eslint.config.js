import config from "eslint-config-greenflash";

/** @type {import('eslint').Linter.Config[]} */
export default [...config, { ignores: ["eslint.config.js"] }];
