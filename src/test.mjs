import test from "node:test";
import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join as pathJoin } from "node:path";

import { deriveProjectNameAndPath } from "./main.mjs";

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
