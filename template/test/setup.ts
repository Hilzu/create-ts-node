// Common setup for all tests
import { after, before } from "node:test";

process.env.NODE_ENV = "test";

// Project modules must be dynamically imported after initializing the environment
// const { getEnv } = await import("../src/config.js");

before(async () => {
  // Global setup for all tests before each test file
});

after(async () => {
  // Global cleanup for all tests after each test file
});
