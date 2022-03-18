const baseConfig = require("../../../jest.project")({ dirName: __dirname });

module.exports = {
  ...baseConfig,
  roots: ["<rootDir>", "<rootDir>/../../../__mocks__"],
};
