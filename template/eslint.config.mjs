import js from "@eslint/js";
import tsEslint from "typescript-eslint";
import prettier from "eslint-config-prettier/flat";
import nodePlugin from "eslint-plugin-n";
import globals from "globals";

export default tsEslint.config(
  // https://eslint.org/docs/latest/use/configure/ignore
  {
    ignores: ["**/dist/"],
  },

  js.configs.recommended,

  // Rules enabled by this config in addition to recommended: https://typescript-eslint.io/rules/?=xrecommended-strict
  // Replace this with tsEslint.configs.recommendedTypeChecked, if you want to include recommended rules only
  tsEslint.configs.strictTypeChecked,

  // Rules enabled by this config: https://typescript-eslint.io/rules/?=stylistic
  // Remove this if you don't want to include stylistic rules
  tsEslint.configs.stylisticTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.nodeBuiltin,
      },
    },
  },
  nodePlugin.configs["flat/recommended"],
  {
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
    ...tsEslint.configs.disableTypeChecked,
  },
  prettier,
);
