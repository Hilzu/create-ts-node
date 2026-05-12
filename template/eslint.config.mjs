import js from "@eslint/js";
import ts from "typescript-eslint";
import prettier from "eslint-config-prettier/flat";
import node from "eslint-plugin-n";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

const files = [
  "**/*.mjs",
  "**/*.cjs",
  "**/*.js",
  "**/*.mts",
  "**/*.cts",
  "**/*.ts",
];

export default defineConfig([
  globalIgnores(["**/dist/"]),
  {
    files,
    plugins: { js, n: node },
    extends: ["js/recommended", "n/recommended"],
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
      },
    },
  },

  // Rules enabled by this config in addition to recommended: https://typescript-eslint.io/rules/?=xrecommended-strict
  // Replace this with tsEslint.configs.recommendedTypeChecked, if you want to include recommended rules only
  ts.configs.strictTypeChecked,

  // Rules enabled by this config: https://typescript-eslint.io/rules/?=stylistic
  // Remove this if you don't want to include stylistic rules
  ts.configs.stylisticTypeChecked,

  {
    files,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "n/prefer-node-protocol": "error",
    },
  },
  {
    files: ["**/*.mjs", "**/*.cjs", "**/*.js"],
    extends: [ts.configs.disableTypeChecked],
  },
  prettier,
]);
