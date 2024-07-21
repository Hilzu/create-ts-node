#!/usr/bin/env node

import { create } from "./main.mjs";
import { debug } from "./util.mjs";

try {
  await create();
} catch (err) {
  console.error("create-ts-node:", err.message);
  debug(err.stack);
  process.exitCode = 1;
}
