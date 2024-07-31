import { env } from "node:process";

export const getEnv = (key: string, defaultValue?: string): string => {
  const value = env[key];
  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error(`Environment variable ${key} is required`);
    }
    return defaultValue;
  }
  return value;
};

export const port = Number(getEnv("PORT", "3000"));

type NodeEnv = "development" | "production" | "test";

const getNodeEnv = (): NodeEnv => {
  const env = getEnv("NODE_ENV");
  if (env !== "development" && env !== "production" && env !== "test") {
    throw new Error(`Invalid NODE_ENV: ${env}`);
  }
  return env;
};

export const nodeEnv = getNodeEnv();

// The deployment environment, e.g. "staging" or "production"
export const appEnv = getEnv("APP_ENV", "development");
