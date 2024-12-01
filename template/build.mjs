import { readdir as readDir } from "node:fs/promises";
import { parseArgs } from "node:util";
import * as esbuild from "esbuild";

const {
  values: { dev, watch },
} = parseArgs({
  options: {
    dev: { type: "boolean", default: false },
    watch: { type: "boolean", default: false },
  },
});

const isProduction = !dev;

const testFileRegex = /test\.(ts|mts|cts)$/;
const files = await readDir("src", { recursive: true, withFileTypes: true });
const entryPoints = files
  .filter((file) => file.isFile() && !testFileRegex.test(file.name))
  .map((file) => `${file.parentPath}/${file.name}`);

const options = {
  logLevel: "info",
  color: watch ? true : undefined,

  entryPoints,
  outdir: "dist",
  outbase: "src",

  platform: "node",
  target: ["node22.11"],
  format: "esm",
  packages: "external",

  sourcemap: true,
  bundle: false,
  minify: isProduction,
};

if (watch) {
  const ctx = await esbuild.context(options);
  await ctx.watch();
} else {
  await esbuild.build(options);
}
