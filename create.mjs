#!/usr/bin/env node

import chalk from "chalk";
import {
  copyFile,
  mkdir,
  readdir as readDir,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises";
import { basename as baseName, join as pathJoin } from "node:path";
import { fileURLToPath } from "node:url";
import { debuglog } from "node:util";
import { EOL } from "os";

const dirname = fileURLToPath(new URL(".", import.meta.url));
const explicitName = process.argv[2];
const cwd = process.cwd();
const projectName = explicitName || baseName(cwd);
const projectPath = explicitName ? pathJoin(cwd, projectName) : cwd;
const templatePath = pathJoin(dirname, "template");
const packageManagerType =
  (process.env.npm_execpath || "").endsWith("yarn.js") ? "yarn" : "npm";
const packageManagerRun = packageManagerType === "npm" ? "npm run" : "yarn";
const packageManagerRunScript =
  packageManagerType === "npm" ? "npm run --" : "yarn run";

const log = (msg, ...args) => {
  console.log(`create-ts-node: ${msg}`, ...args);
};

const debug = debuglog("create-ts-node");

const lineEndRegex = /\r\n|\r|\n/g;

const normalizeLineEndings = async (path) => {
  const file = await readFile(path, { encoding: "utf-8" });
  const normalized = file.replaceAll(lineEndRegex, EOL);
  await writeFile(path, normalized);
};

const copyFiles = async () => {
  const templateFiles = await readDir(templatePath);
  for (const file of templateFiles) {
    const templateFilePath = pathJoin(templatePath, file);
    const projectFile = file.startsWith("_") ? file.slice(1) : file;
    const projectFilePath = pathJoin(projectPath, projectFile);
    const stats = await stat(templateFilePath);

    if (stats.isDirectory()) {
      await mkdir(projectFilePath);
      const newFiles = await readDir(templateFilePath);
      templateFiles.push(...newFiles.map((f) => pathJoin(file, f)));
    } else if (stats.isFile()) {
      await copyFile(templateFilePath, projectFilePath);
      await normalizeLineEndings(projectFilePath);
    }
  }
};

const mapObject = (obj, mapper) =>
  Object.fromEntries(Object.entries(obj).map(mapper));

const create = async () => {
  log(`Creating project ${projectName}`);
  try {
    await mkdir(projectPath);
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }

  const existingFiles = await readDir(projectPath);
  if (existingFiles.length > 0) {
    throw new Error(
      `Can't create project in ${projectPath} because it's not empty.`,
    );
  }

  await copyFiles();

  const packageJsonPath = pathJoin(projectPath, "package.json");
  const packageJsonFile = await readFile(packageJsonPath, {
    encoding: "utf-8",
  });
  const packageJson = JSON.parse(packageJsonFile);

  packageJson.name = projectName;
  packageJson.engines.node = `>=${process.versions.node}`;
  packageJson.scripts = mapObject(packageJson.scripts, ([key, value]) => [
    key,
    value.replace("PM_RUN", packageManagerRunScript),
  ]);

  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + EOL);
  await normalizeLineEndings(packageJsonPath);

  console.log();
  `
Project created!

You can now run "${packageManagerType} install" in the project directory to install the
dependencies. Other useful scripts are:

    ${chalk.gray("# Build project")}
    ${packageManagerRun} build
    ${chalk.gray("# Clean all build artefacts")}
    ${packageManagerRun} clean
    ${chalk.gray("# Automatically format code using prettier")}
    ${packageManagerRun} format
    ${chalk.gray("# Run project in production mode")}
    ${packageManagerRun} start
    ${chalk.gray(
      "# Run project in watch mode with automatic restarts on changes",
    )}
    ${packageManagerRun} dev
    ${chalk.gray("# Run eslint and check code formatting")}
    ${packageManagerRun} test
  `
    .trim()
    .split("\n")
    .forEach((line) => log(line));
};

try {
  await create();
} catch (err) {
  console.error("create-ts-node:", err.message);
  debug(err.stack);
  process.exitCode = 1;
}
