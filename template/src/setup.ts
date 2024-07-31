// This file is loaded before anything else in the app
// Use this file to load environment variables and other global configuration

if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  dotenv.config();
}
