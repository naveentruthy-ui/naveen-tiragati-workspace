const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./", // path to Next.js app
});

const customJestConfig = {
  testEnvironment: "jsdom",

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy",
  },
};

module.exports = createJestConfig(customJestConfig);