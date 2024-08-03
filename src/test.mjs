import test from "node:test";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join as pathJoin } from "node:path";
import { env } from "node:process";
import {
  deriveProjectNameAndPath,
  indentLines,
  cmdToExecForm,
  determinePackageManager,
} from "./util.mjs";

test("deriveProjectNameAndPath", async (t) => {
  const dir = tmpdir();
  const call = (n, d = dir) => deriveProjectNameAndPath(n, d);

  await t.test("with a simple name", (_t) => {
    const { projectName, projectPath } = call("simple");
    assert.equal(projectName, "simple");
    assert.equal(projectPath, pathJoin(dir, "simple"));
  });

  await t.test("with a dot name", (_t) => {
    const projectDir = pathJoin(dir, "dotto");
    const { projectName, projectPath } = call(".", projectDir);
    assert.equal(projectName, "dotto");
    assert.equal(projectPath, projectDir);
  });

  await t.test("with an empty name", (_t) => {
    const projectDir = pathJoin(dir, "empty");
    const { projectName, projectPath } = call("", projectDir);
    assert.equal(projectName, "empty");
    assert.equal(projectPath, projectDir);
  });

  await t.test("with an undefined name", (_t) => {
    const projectDir = pathJoin(dir, "no-name");
    const { projectName, projectPath } = call(undefined, projectDir);
    assert.equal(projectName, "no-name");
    assert.equal(projectPath, projectDir);
  });

  await t.test("with a scoped name", (_t) => {
    const { projectName, projectPath } = call("@scope/test");
    assert.equal(projectName, "@scope/test");
    assert.equal(projectPath, pathJoin(dir, "test"));
  });
});

test("determinePackageManager", async (t) => {
  let npmUserAgent;
  t.beforeEach(() => {
    npmUserAgent = env.npm_config_user_agent;
  });
  t.afterEach(() => {
    env.npm_config_user_agent = npmUserAgent;
  });

  await t.test("with npm", (_t) => {
    env.npm_config_user_agent =
      "npm/10.7.0 node/v18.20.4 linux x64 workspaces/false ci/github-actions";
    assert.equal(determinePackageManager(), "npm");
  });

  await t.test("with yarn", (_t) => {
    env.npm_config_user_agent = "yarn/1.22.22 npm/? node/v20.15.1 darwin arm64";
    assert.equal(determinePackageManager(), "yarn");
  });

  await t.test("with pnpm", (_t) => {
    env.npm_config_user_agent = "pnpm/9.6.0 npm/? node/v22.5.1 win32 x64";
    assert.equal(determinePackageManager(), "pnpm");
  });
});

test("indentLines", async (t) => {
  await t.test("with a single line", (_t) => {
    assert.equal(indentLines("single"), "    single");
  });

  await t.test("with multiple lines", (_t) => {
    const input = "first\nsecond\nthird";
    const expected = "    first\n    second\n    third";
    assert.equal(indentLines(input), expected);
  });

  await t.test("with a custom indent", (_t) => {
    const input = "first\nsecond\nthird";
    const expected = "  first\n  second\n  third";
    assert.equal(indentLines(input, "  "), expected);
  });

  await t.test("with an empty string", (_t) => {
    assert.equal(indentLines(""), "");
  });
});

test("cmdToExecForm", async (t) => {
  await t.test("with a simple command", (_t) => {
    const cmd = "echo hello";
    const exec = cmdToExecForm(cmd);
    assert.equal(exec, '["echo", "hello"]');
  });

  await t.test("with a command with arguments", (_t) => {
    const cmd = "node --import ./dist/setup.js --enable-source-maps .";
    const exec = cmdToExecForm(cmd);
    assert.equal(
      exec,
      '["node", "--import", "./dist/setup.js", "--enable-source-maps", "."]',
    );
  });
});
