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

const options = {
  logLevel: "info",
  color: watch ? true : undefined,

  entryPoints: ["src/**"],
  outdir: "dist",
  outbase: "src",

  loader: {
    ".test.ts": "empty",
  },

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
