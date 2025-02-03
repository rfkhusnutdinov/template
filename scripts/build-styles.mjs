import { compile } from "sass";
import { writeFile } from "fs";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import cssnanoPlugin from "cssnano";

import { isProd, getFilenameWithoutExt, deleteAllFilesInDir } from "./utils.mjs";
import { STYLES_DIST_PATH, STYLES_FILES, STYLES_SRC_PATH } from "./constants.mjs";

const buildStyles = async function (file) {
  const fullFilePath = `${STYLES_SRC_PATH}/${file}`;
  const filenameWithoutExt = getFilenameWithoutExt(file);

  const compileSassResult = compile(fullFilePath, {
    alertColor: true,
    sourceMap: true,
    sourceMapIncludeSources: true,
    style: "expanded",
  });

  if (isProd()) {
    postcss([autoprefixer(), cssnanoPlugin()])
      .process(compileSassResult.css, { from: undefined })
      .then((result) => {
        result.warnings().forEach((warn) => {
          console.warn(warn.toString());
        });

        writeFile(`${STYLES_DIST_PATH}/${filenameWithoutExt}.min.css`, result.css, () => {});
      });
  }

  return postcss([
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

      writeFile(`${STYLES_DIST_PATH}/${filenameWithoutExt}.css`, result.css, () => {});
    });
};

await deleteAllFilesInDir(STYLES_DIST_PATH);
await Promise.all(STYLES_FILES.map(buildStyles));

export const buildAllStyles = async function () {
  return Promise.all(STYLES_FILES.map(buildStyles));
};
