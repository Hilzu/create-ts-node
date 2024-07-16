import { env } from "node:process";

const getEnv = (key: string, defaultValue?: string): string => {
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
