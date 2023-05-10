/** @type {import('jest').Config} */
const config = {
  verbose: true,
  testEnvironment: "node",
  testMatch: [
    "**/__tests__/**/*.js?(x)",
    "**/?(*.)+(spec|test).js?(x)",
    "**/__test__/**/*.js?(x)",
  ],
};

module.exports = config;
