import globals from "globals";
import pluginJs from "@eslint/js";
import nodePlugin from "eslint-plugin-n";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["template/"]),
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  nodePlugin.configs["flat/recommended"],
  {
    rules: {
      "n/prefer-node-protocol": "error",
    },
  },
  {
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
]);
