module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["import", "@typescript-eslint"],
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  env: {
    jest: true,
  },
  rules: {
    "import/no-commonjs": "error",
    "@typescript-eslint/indent": "off",
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "error",
  },
};
