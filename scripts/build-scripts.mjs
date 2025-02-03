import { rollup } from "rollup";
import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

import { isProd, deleteAllFilesInDir } from "./utils.mjs";
import { SCRIPTS_FILES, SCRIPTS_SRC_PATH, SCRIPTS_DIST_PATH } from "./constants.mjs";

const buildScripts = async function (file) {
  const fullFilePath = `${SCRIPTS_SRC_PATH}/${file}`;

  if (isProd()) {
    const bundleMinified = await rollup({
      input: fullFilePath,
      plugins: [
        commonjs(),
        nodeResolve(),
        babel({
          babelHelpers: "bundled",
          exclude: "node_modules/**",
        }),
        isProd() ? terser() : "",
      ],
    });

    await bundleMinified.write({
      sourcemap: isProd() ? false : true,
      format: "umd",
      dir: SCRIPTS_DIST_PATH,
      entryFileNames: "[name].min.js",
    });
  }

  const bundle = await rollup({
    input: fullFilePath,
    plugins: [
      commonjs(),
      nodeResolve(),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
      }),
    ],
  });

  await bundle.write({
    format: "umd",
    dir: SCRIPTS_DIST_PATH,
    entryFileNames: "[name].js",
  });

  await bundle.write({
    format: "esm",
    dir: SCRIPTS_DIST_PATH,
    entryFileNames: "[name].esm.js",
  });
};

await deleteAllFilesInDir(SCRIPTS_DIST_PATH);
Promise.all(SCRIPTS_FILES.map(buildScripts));

export const buildAllScripts = async function () {
  return Promise.all(SCRIPTS_FILES.map(buildScripts));
};
