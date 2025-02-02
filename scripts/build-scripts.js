import { rollup } from "rollup";
import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import cssnanoPlugin from "cssnano";
import autoprefixer from "autoprefixer";

import { isProd } from "./utils.js";

const scriptsFiles = ["index.js"];
const scriptsSrcDirectoryPath = "src/js";
const scriptsDistDirectoryPath = "dist/js";

const buildScripts = async function (file) {
  const fullFilePath = `${scriptsSrcDirectoryPath}/${file}`;

  const bundle = await rollup({
    input: fullFilePath,
    plugins: [
      commonjs(),
      nodeResolve(),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
      }),
      isProd() ? terser() : "",
      postcss({
        plugins: [
          autoprefixer({
            grid: "autoplace",
            cascade: false,
          }),
          isProd()
            ? cssnanoPlugin({
                preset: "default",
              })
            : "",
        ],
        extract: "dist/css/libs.min.css",
        extensions: [".css", ".scss"],
      }),
    ],
  });

  await bundle.write({
    sourcemap: isProd() ? false : true,
    format: "iife",
    dir: scriptsDistDirectoryPath,
    entryFileNames: "[name].min.js",
  });
};

Promise.all(scriptsFiles.map(buildScripts));

export const buildAllScripts = async function () {
  return Promise.all(scriptsFiles.map(buildScripts));
};
