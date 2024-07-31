import chalk, { Chalk } from "chalk";
import {
  copyFile,
  mkdir,
  readdir as readDir,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises";
import { join as pathJoin } from "node:path";
import { env } from "node:process";
import { fileURLToPath } from "node:url";
import { EOL } from "node:os";
import { debug, indentLines, log, mapObject } from "./util.mjs";

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

const createScriptsUsage = (pmRun, pmName, noColor = false) => {
  const c = noColor ? new Chalk({ level: 0 }) : chalk;
  return `
${c.gray("# Build project")}
${pmRun} build
${c.gray("# Clean all build artefacts")}
${pmRun} clean
${c.gray("# Format code using prettier")}
${pmRun} format
${c.gray("# Run project in production mode")}
${pmName} start
${c.gray("# Run project in dev mode with automatic restarts on changes")}
${pmRun} dev
${c.gray("# Run tests, linter, type checker and check code formatting")}
${pmName} test`.trim();
};

const createReadme = (projectName, pmRun, pmName) => {
  return `# ${projectName}

## Using the scripts

\`\`\`sh
${createScriptsUsage(pmRun, pmName, true)}
\`\`\`
`;
};

export const create = async ({ projectName, projectPath }) => {
  const pmName = determinePackageManager();
  debug("pmName", pmName);

  const pmRun =
    pmName === "npm" ? "npm run"
    : pmName === "pnpm" ? "pnpm"
    : "yarn";
  debug("pmRun", pmRun);

  const pmLockFile =
    pmName === "npm" ? "package-lock.json"
    : pmName === "pnpm" ? "pnpm-lock.yaml"
    : "yarn.lock";

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
  packageJson.scripts = mapObject(packageJson.scripts, ([key, value]) => [
    key,
    value
      .replaceAll("PM_RUN", pmRun)
      .replaceAll("PM_NAME", pmName)
      .replaceAll("PM_LOCK_FILE", pmLockFile),
  ]);
  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2) + EOL);
  await normalizeLineEndings(packageJsonPath);

  const readmePath = pathJoin(projectPath, "README.md");
  const readme = createReadme(projectName, pmRun, pmName);
  await writeFile(readmePath, readme);
  await normalizeLineEndings(readmePath);

  const envPath = pathJoin(projectPath, ".env");
  const exampleEnvPath = pathJoin(projectPath, "example.env");
  await copyFile(exampleEnvPath, envPath);
  await normalizeLineEndings(envPath);

  console.log();
  `
Project created!

You can now run "${pmName} install" in the project directory to install the
dependencies. Other useful scripts are:

${indentLines(createScriptsUsage(pmRun, pmName))}
  `
    .trim()
    .split("\n")
    .forEach((line) => log(line));
};
