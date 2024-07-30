import { debuglog } from "node:util";
import { cwd as processCwd } from "node:process";
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
