import { compile } from "sass";
import { writeFile } from "fs";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnanoPlugin from "cssnano";

import { isProd, getFilenameWithoutExt } from "./utils.js";

const stylesFiles = ["style.scss"];
const stylesSrcPath = "src/styles";

const buildStyles = async function (file) {
  const fullFilePath = `${stylesSrcPath}/${file}`;
  const filenameWithoutExt = getFilenameWithoutExt(file);

  const compileSassResult = compile(fullFilePath, {
    alertColor: true,
    sourceMap: true,
    sourceMapIncludeSources: true,
    style: "expanded",
  });

  if (isProd()) {
    postcss([
      autoprefixer(),
      cssnanoPlugin({
        preset: [
          "default",
          {
            normalizeWhitespace: false,
          },
        ],
      }),
    ])
      .process(compileSassResult.css, { from: undefined })
      .then((result) => {
        result.warnings().forEach((warn) => {
          console.warn(warn.toString());
        });

        writeFile(`dist/css/${filenameWithoutExt}.css`, result.css, () => {});
      });
  }

  return postcss([autoprefixer(), cssnanoPlugin()])
    .process(compileSassResult.css, { from: undefined })
    .then((result) => {
      result.warnings().forEach((warn) => {
        console.warn(warn.toString());
      });

      writeFile(`dist/css/${filenameWithoutExt}.min.css`, result.css, () => {});
    });
};

Promise.all(stylesFiles.map(buildStyles));

export const buildAllStyles = async function () {
  return Promise.all(stylesFiles.map(buildStyles));
};
