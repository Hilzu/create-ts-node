import globals from "globals";
import pluginJs from "@eslint/js";
import nodePlugin from "eslint-plugin-n";

export default [
  { ignores: ["template/*"] },
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
];
