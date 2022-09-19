module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  plugins: ["@typescript-eslint", "import"],
  env: {
    es6: true,
    node: true,
  },
  ignorePatterns: ["dist", "node_modules"],
  rules: {
    "no-empty": "off",
    "no-console": "warn",
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/no-var-requires": "off",
  },
  overrides: [
    {
      files: ["**/__tests__/**/*.ts", "*.test.*"],
      env: {
        jest: true,
      },
      rules: {
        "import/no-extraneous-dependencies": "off",
      },
    },
  ],
};
