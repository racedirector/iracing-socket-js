const { resolve } = require("path");
const baseConfig = require("./jest.base");

const ROOT_DIR = __dirname;
const CI = !!process.env.CI;

function testEnvironmentForPackage(packageName) {
  switch (packageName) {
    // If we're testing from the root, or the `iracing-socket-js` project
    // directly, run in jsdom to support react tests.
    case "iracing-socket":
    case "iracing-socket-js":
      return "jsdom";
    default:
      return "node";
  }
}

module.exports = ({ dirName, projectMode = true }) => {
  const package = require(resolve(dirName, "package.json"));
  const packageDisplayName = package.name.replace("@racedirector/", "");

  return {
    ...baseConfig,
    ...(CI || !projectMode ? {} : { displayName: packageDisplayName }),
    testEnvironment: testEnvironmentForPackage(packageDisplayName),
    restoreMocks: true,
    reporters: ["default"],
    modulePathIgnorePatterns: ["dist"],
    cacheDirectory: resolve(ROOT_DIR, ".cache/jest", packageDisplayName),
  };
};
