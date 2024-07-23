import js from "@eslint/js";
import tsEslint from "typescript-eslint";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tsEslint.config(
  {
    ignores: ["dist/", "node_modules/"],
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
      },
    },
  },
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  prettier,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
);
