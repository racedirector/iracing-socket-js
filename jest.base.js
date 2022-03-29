/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 60,
      functions: 50,
    },
  },
};
