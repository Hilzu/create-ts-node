import globals from "globals";
import js from "@eslint/js";
import node from "eslint-plugin-n";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["template/"]),
  {
    files: ["**/*.js", "**/*.mjs", "**/*.cts"],
    extends: ["js/recommended", "n/recommended"],
    languageOptions: { globals: globals.node },
    plugins: { js, n: node },
    rules: {
      "n/prefer-node-protocol": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
]);
