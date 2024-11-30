import { debuglog } from "node:util";
import { cwd as processCwd, env } from "node:process";
import { basename as baseName, join as pathJoin } from "node:path";

export const log = (msg, ...args) => {
  console.log(`${msg}`, ...args);
};

export const debug = debuglog("create-ts-node");

export const deriveProjectNameAndPath = (nameArg, cwd = processCwd()) => {
  const nameFromCwd = !nameArg || nameArg === ".";
  const projectName = nameFromCwd ? baseName(cwd) : nameArg;
  let projectPath;
  if (nameFromCwd) projectPath = cwd;
  else {
    const dir = nameArg.startsWith("@") ? nameArg.split("/")[1] : nameArg;
    projectPath = pathJoin(cwd, dir);
  }
  return { projectName, projectPath };
};

export const mapObject = (obj, mapper) =>
  Object.fromEntries(Object.entries(obj).map(mapper));

export const indentLines = (str, indent = "    ") =>
  str.replace(/^(?=.)/gm, indent);

export const determinePackageManager = () => {
  const npmUserAgent = env.npm_config_user_agent;
  debug("npmUserAgent", npmUserAgent);
  const npmExecPath = env.npm_execpath;
  debug("npmExecPath", npmExecPath);
  const parent = env._;
  debug("parent", parent);

  if (!npmUserAgent) return "npm";
  if (npmUserAgent.includes("yarn/")) return "yarn";
  if (npmUserAgent.includes("pnpm/")) return "pnpm";
  return "npm";
};
