#!/usr/bin/env node

import { create } from "./main.mjs";
import { debug, deriveProjectNameAndPath } from "./util.mjs";
import { argv } from "node:process";

try {
  const { projectName, projectPath } = deriveProjectNameAndPath(argv[2]);
  debug("projectName", projectName);
  debug("projectPath", projectPath);
  await create({ projectName, projectPath });
} catch (err) {
  console.error("create-ts-node:", err.message);
  debug(err.stack);
  process.exitCode = 1;
}
