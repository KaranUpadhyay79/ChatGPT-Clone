export default {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],

  testMatch: [
    "**/__tests__/unit/**/*.test.js",
    "**/__tests__/integration/**/*.test.js",
  ],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/e2e/",
  ],

  // ✅ extensionsToTreatAsEsm NAHI — "type":"module" already handle karta hai
  transform: {},

  collectCoverageFrom: [
    "routes/**/*.js",
    "models/**/*.js",
    "middleware/**/*.js",
    "services/**/*.js",
    "utils/**/*.js",
    "!node_modules/**",
  ],

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },

  testTimeout: 30000,
  verbose: true,
  forceExit: true,
  clearMocks: true,
};