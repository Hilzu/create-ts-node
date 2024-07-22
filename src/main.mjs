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
import { argv, env, cwd as processCwd, versions } from "node:process";
import { fileURLToPath } from "node:url";
import { EOL } from "node:os";
import { log, debug } from "./util.mjs";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const templatePath = pathJoin(__dirname, "..", "template");

debug("__dirname", __dirname);
debug("templatePath", templatePath);

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

const lineEndRegex = /\r\n|\r|\n/g;

const normalizeLineEndings = async (path) => {
  const file = await readFile(path, { encoding: "utf-8" });
  const normalized = file.replaceAll(lineEndRegex, EOL);
  await writeFile(path, normalized);
};

const copyFiles = async (projectPath) => {
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

export const create = async () => {
  const { projectName, projectPath } = deriveProjectNameAndPath(argv[2]);
  debug("projectName", projectName);
  debug("projectPath", projectPath);
  const packageManagerType = determinePackageManager();
  debug("packageManagerType", packageManagerType);
  const packageManagerRun =
    packageManagerType === "npm" ? "npm run"
    : packageManagerType === "pnpm" ? "pnpm"
    : "yarn";
  debug("packageManagerRun", packageManagerRun);
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

  await copyFiles(projectPath);

  const packageJsonPath = pathJoin(projectPath, "package.json");
  const packageJsonFile = await readFile(packageJsonPath, {
    encoding: "utf-8",
  });
  const packageJson = JSON.parse(packageJsonFile);

  packageJson.name = projectName;
  packageJson.engines.node = `>=${versions.node}`;
  packageJson.scripts = mapObject(packageJson.scripts, ([key, value]) => [
    key,
    value
      .replaceAll("PM_RUN", packageManagerRun)
      .replaceAll("PM_NAME", packageManagerType),
  ]);

  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + EOL);
  await normalizeLineEndings(packageJsonPath);

  const readmePath = pathJoin(projectPath, "README.md");
  await writeFile(readmePath, `# ${projectName}${EOL}`);

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
