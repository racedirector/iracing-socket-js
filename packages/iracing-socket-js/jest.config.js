const baseConfig = require("../../jest.project")({ dirName: __dirname });

module.exports = {
  ...baseConfig,
  testEnvironment: "jsdom",
  roots: ["<rootDir>", "<rootDir>/../../__mocks__"],
};
