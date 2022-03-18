const { resolve } = require("path");
const baseConfig = require("./jest.base");

const ROOT_DIR = __dirname;
const CI = !!process.env.CI;

function testEnvironmentForPackage(packageName) {
  switch (packageName) {
    case "iracing-socket-js":
      return "jsdom"
    default:
      return "node"
  }
}

module.exports = ({ dirName, projectMode = true }) => {
  const package = require(resolve(dirName, "package.json"));
  const packageDisplayName = package.name.replace("@racedirector/", "");
  const cacheDirectory = `${CI ? "" : "node_modules/"}.cache/jest`

  return {
    ...baseConfig,
    ...(CI || !projectMode ? {} : { displayName: packageDisplayName }),
    testEnvironment: testEnvironmentForPackage(packageDisplayName),
    restoreMocks: true,
    reporters: ["default"],
    modulePathIgnorePatterns: ["dist"],
    cacheDirectory: resolve(
      ROOT_DIR,
      cacheDirectory
    ),
  };
};
