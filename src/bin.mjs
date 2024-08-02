#!/usr/bin/env node

import { create } from "./main.mjs";
import {
  debug,
  deriveProjectNameAndPath,
  determinePackageManager,
} from "./util.mjs";
import { parseArgs } from "node:util";

const options = {
  "package-manager": {
    type: "string",
  },
};

try {
  const { values, positionals } = parseArgs({
    options,
    allowPositionals: true,
  });
  debug("values", values);
  debug("positionals", positionals);

  const { projectName, projectPath } = deriveProjectNameAndPath(positionals[0]);
  debug("projectName", projectName);
  debug("projectPath", projectPath);

  const packageManager = values["package-manager"] ?? determinePackageManager();
  debug("packageManager", packageManager);

  await create({ projectName, projectPath, packageManager });
} catch (err) {
  console.error("create-ts-node:", err.message);
  debug(err.stack);
  process.exitCode = 1;
}
