import { debuglog } from "node:util";

export const log = (msg, ...args) => {
  console.log(`create-ts-node: ${msg}`, ...args);
};

export const debug = debuglog("create-ts-node");
