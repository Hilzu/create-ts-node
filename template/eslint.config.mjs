import js from "@eslint/js";
import tsEslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default tsEslint.config(
  {
    ignores: ["dist/", "node_modules/"],
  },
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  prettier,
);
