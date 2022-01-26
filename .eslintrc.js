const path = require('path')

module.exports = {
  env: {
    browser: true,
    es6: true,
  },

  globals: {
    "__DEV__": true,
  },

  extends: [
    "airbnb-base",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "prettier",
  ],

  plugins: [
    "prettier",
    "@typescript-eslint",
  ],

  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json"
  },

  rules: {
    "no-console": 2,
    "no-void": [2, { "allowAsStatement": true }],
    "@typescript-eslint/no-floating-promises": [2, { "ignoreVoid": true }],
    "@typescript-eslint/naming-convention": [
      2,
      {
        // All variables should be camelCase or UPPER_CASE, leading underscores are allowed.
        "selector": "variable",
        "format": ["camelCase", "UPPER_CASE"],
        "leadingUnderscore": "allowSingleOrDouble"
      },
      {
        // All `const` variables should be camelCase, UPPER_CASE or PascalCase
        "selector": "variable",
        "modifiers": ["const"],
        "format": ["UPPER_CASE", "camelCase", "PascalCase"]
      }
    ],
    "@typescript-eslint/naming-convention": [
      1,
      {
        // All boolean variables should be prefixed by `prefix`.
        "selector": "variable",
        "types": ["boolean"],
        "format": ["PascalCase"],
        "prefix": ["is", "should", "has", "can", "did", "will", "show", "hide"]
      },
    ],
    // !!!: We can't _really_ ensure that everything is not `any` and doing it all
    // one-off is a huge pain. Set all "unsafe" rules to warnings.
    "@typescript-eslint/no-unsafe-assignment": 1,
    "@typescript-eslint/no-unsafe-call": 1,
    "@typescript-eslint/no-unsafe-member-access": 1,
    "@typescript-eslint/no-unsafe-return": 1,
    "@typescript-eslint/restrict-template-expressions": 1,
    "require-await": 0,
  },

  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
  }
};
