const baseConfig = require("./jest.base");

const PROJECTS = false;
const CI = !!process.env.CI;

const useProjects = !(!PROJECTS || CI);

module.exports = useProjects
  ? {
      ...baseConfig,
      rootDir: __dirname,
      projects: ["<rootDir>/packages/**/*/jest.config.js"]
    }
  : require("./jest.project")({ dirName: __dirname, projectMode: PROJECTS });
