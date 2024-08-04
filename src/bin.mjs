#!/usr/bin/env node

import { create } from "./main.mjs";
import {
  debug,
  deriveProjectNameAndPath,
  determinePackageManager,
} from "./util.mjs";
import { parseArgs } from "node:util";
import { readFile } from "node:fs/promises";

const options = {
  "package-manager": {
    type: "string",
  },
  help: {
    type: "boolean",
    short: "h",
    default: false,
  },
  version: {
    type: "boolean",
    short: "v",
    default: false,
  },
};

const logHelp = () => {
  const help = `
Usage: create-ts-node [options] [project-name]

Create a new TypeScript Node.js project.

Positionals:
  project-name  The name of the created project and its directory
                Can be a scoped package name (e.g. "@scope/project-name")
                (default: the current directory)

Options:
  --package-manager <name>  Force the specified package manager
  -h, --help                Display this help message
  -v, --version             Display the version number
`;
  console.log(help.trim());
};

const logVersion = async () => {
  const packageJsonPath = new URL("../package.json", import.meta.url);
  const packageJson = await readFile(packageJsonPath, "utf-8");
  const { version } = JSON.parse(packageJson);
  console.log(`create-ts-node version ${version}`);
};

const run = async () => {
  const { values, positionals } = parseArgs({
    options,
    allowPositionals: true,
  });
  debug("values", values);
  debug("positionals", positionals);

  if (values.help) return logHelp();

  if (values.version) return await logVersion();

  const { projectName, projectPath } = deriveProjectNameAndPath(positionals[0]);
  debug("projectName", projectName);
  debug("projectPath", projectPath);

  const pmArg = values["package-manager"];
  if (pmArg)
    if (!["npm", "yarn", "pnpm"].includes(pmArg))
      throw new Error(`Unknown package manager: ${pmArg}`);
  const packageManager = pmArg || determinePackageManager();
  debug("packageManager", packageManager);

  await create({ projectName, projectPath, packageManager });
};

try {
  await run();
} catch (err) {
  console.error("create-ts-node:", err.message);
  debug(err.stack);
  process.exitCode = 1;
}
