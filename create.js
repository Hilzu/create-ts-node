#!/usr/bin/env node
"use strict";

const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);
const readDir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);
const writeFile = promisify(fs.writeFile);

const explicitName = process.argv[2];
const cwd = process.cwd();
const projectName = explicitName || path.basename(cwd);
const projectPath = explicitName ? path.join(cwd, projectName) : cwd;
const templatePath = path.join(__dirname, "template");

const log = (msg, ...args) => {
  console.log(`create-ts-node: ${msg}`, ...args);
};

const copyFiles = async () => {
  const templateFiles = await readDir(templatePath);
  for (const file of templateFiles) {
    const templateFilePath = path.join(templatePath, file);
    const projectFilePath = path.join(projectPath, file);
    const stats = await stat(templateFilePath);

    if (stats.isDirectory()) {
      await mkdir(projectFilePath);
      const newFiles = await readDir(templateFilePath);
      templateFiles.push(...newFiles.map(f => path.join(file, f)));
    } else if (stats.isFile()) {
      await copyFile(templateFilePath, projectFilePath);
    }
  }
};

const create = async () => {
  log(`Creating project ${projectName}`);
  try {
    await mkdir(projectPath);
  } catch (err) {
    if (err.code !== "EEXIST") {
      throw err;
    }
  }

  await copyFiles();

  const packageJsonPath = path.join(projectPath, "package.json");
  const packageJsonFile = await readFile(packageJsonPath);
  const packageJson = JSON.parse(packageJsonFile);
  packageJson.name = projectName;
  packageJson.engines.node = `^${process.versions.node}`;
  await writeFile(packageJsonPath, JSON.stringify(packageJson));

  `
Project created!

You can now run "yarn install" in the directory to install the
dependencies. Other useful scripts are:

    ${chalk.keyword("gray")("# Build project")}
    yarn build
    ${chalk.keyword("gray")("# Clean all build artefacts")}
    yarn clean
    ${chalk.keyword("gray")("# Automatically format code using prettier")}
    yarn format
    ${chalk.keyword("gray")("# Run project in production mode")}
    yarn start
    ${chalk.keyword("gray")(
      "# Run project in watch mode with automatic restarts on changes",
    )}
    yarn start:dev
    ${chalk.keyword("gray")("# Run eslint and check code formatting")}
    yarn test
  `
    .trim()
    .split("\n")
    .forEach(line => log(line));
};

create().catch(err => {
  console.error("create-ts-node: Failed to create project!", err);
});
