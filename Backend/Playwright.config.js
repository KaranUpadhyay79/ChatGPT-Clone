// // // // import { defineConfig, devices } from "@playwright/test";

// // // // export default defineConfig({
// // // //   testDir: "./​__tests__/e2e",
// // // //   fullyParallel: false,
// // // //   forbidOnly: !!process.env.CI,
// // // //   retries: process.env.CI ? 2 : 0,
// // // //   workers: process.env.CI ? 1 : 1,
// // // //   reporter: "html",
// // // //   use: {
// // // //     baseURL: "http://localhost:8080",
// // // //     trace: "on-first-retry",
// // // //   },

// // // //   projects: [
// // // //     {
// // // //       name: "chromium",
// // // //       use: { ...devices["Desktop Chrome"] },
// // // //     },
// // // //     {
// // // //       name: "firefox",
// // // //       use: { ...devices["Desktop Firefox"] },
// // // //     },
// // // //   ],

// // // //   webServer: {
// // // //     command: "npm run dev",
// // // //     url: "http://localhost:8080",
// // // //     reuseExistingServer: !process.env.CI,
// // // //     timeout: 120000,
// // // //   },

// // // //   timeout: 30000,
// // // //   expect: {
// // // //     timeout: 5000,
// // // //   },
// // // // });

// // // import { defineConfig, devices } from "@playwright/test";

// // // export default defineConfig({
// // //   testDir: "./__tests__/e2e",
// // //   fullyParallel: false,
// // //   forbidOnly: !!process.env.CI,
// // //   retries: process.env.CI ? 2 : 0,
// // //   workers: 1,
// // //   reporter: "html",

// // //   use: {
// // //     baseURL: "http://localhost:8080",
// // //     trace: "on-first-retry",
// // //     extraHTTPHeaders: {
// // //       "Content-Type": "application/json",
// // //     },
// // //   },

// // //   projects: [
// // //     {
// // //       name: "chromium",
// // //       use: { ...devices["Desktop Chrome"] },
// // //     },
// // //   ],

// // //   webServer: {
// // //     command: "node server.js",        // nodemon nahi, direct node
// // //     url: "http://localhost:8080/api/health",  // health endpoint check karo
// // //     reuseExistingServer: !process.env.CI,
// // //     timeout: 60000,                   // 60s kaafi hai
// // //     stdout: "pipe",                   // server logs dikhenge
// // //     stderr: "pipe",
// // //   },

// // //   timeout: 30000,
// // //   expect: {
// // //     timeout: 5000,
// // //   },
// // // });

// // import { defineConfig, devices } from "@playwright/test";

// // export default defineConfig({
// //   testDir: "./__tests__/e2e",
// //   fullyParallel: false,
// //   forbidOnly: !!process.env.CI,
// //   retries: process.env.CI ? 2 : 0,
// //   workers: 1,
// //   reporter: "html",

// //   use: {
// //     baseURL: "http://localhost:8080",
// //     trace: "on-first-retry",
// //     extraHTTPHeaders: {
// //       "Content-Type": "application/json",
// //     },
// //   },

// //   projects: [
// //     {
// //       name: "chromium",
// //       use: { ...devices["Desktop Chrome"] },
// //     },
// //   ],

// //   webServer: {
// //     command: "node server.js",
// //     url: "http://localhost:8080/api/health", // ✅ health endpoint check karo
// //     reuseExistingServer: !process.env.CI,
// //     timeout: 60000,
// //     stdout: "pipe",
// //     stderr: "pipe",
// //   },

// //   timeout: 30000,
// //   expect: {
// //     timeout: 5000,
// //   },
// // });


// import { defineConfig, devices } from "@playwright/test";

// export default defineConfig({
//   testDir: "./__tests__/e2e",
//   fullyParallel: false,
//   forbidOnly: !!process.env.CI,
//   retries: process.env.CI ? 2 : 0,
//   workers: 1,
//   reporter: "html",

//   use: {
//     baseURL: "http://localhost:8080",
//     trace: "on-first-retry",
//     extraHTTPHeaders: {
//       "Content-Type": "application/json",
//     },
//   },

//   projects: [
//     {
//       name: "chromium",
//       use: { ...devices["Desktop Chrome"] },
//     },
//   ],

//   webServer: {
//     command: "node server.js",
//     url: "http://localhost:8080/api/health",
//     reuseExistingServer: !process.env.CI,
//     timeout: 60000,
//     stdout: "pipe",
//     stderr: "pipe",
//     // ✅ TEST_MODE=true — server fixed OTP use karega, real email nahi jayegi
//     env: {
//       TEST_MODE: "true",
//     },
//   },

//   timeout: 30000,
//   expect: {
//     timeout: 5000,
//   },
// });

import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./__tests__/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",

  use: {
    baseURL: "http://localhost:8080",
    trace: "on-first-retry",
    extraHTTPHeaders: {
      "Content-Type": "application/json",
    },
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "cross-env TEST_MODE=true node server.js",
    url: "http://localhost:8080/api/health",
    reuseExistingServer: false, // ✅ Hamesha fresh server start karo
    timeout: 60000,
    stdout: "pipe",
    stderr: "pipe",
  },

  timeout: 30000,
  expect: {
    timeout: 5000,
  },
});