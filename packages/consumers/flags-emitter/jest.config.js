const baseConfig = require("../../../jest.project")({ dirName: __dirname });

module.exports = {
  ...baseConfig,
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
    },
  },
  roots: ["<rootDir>", "<rootDir>/../../../__mocks__"],
};
