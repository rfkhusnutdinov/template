import { readdirSync, unlink } from "fs";
import path from "path";

export const isProd = function () {
  const argv = process.argv.slice(2).map((v) => v.toLowerCase());
  return argv.includes("--prod");
};

export const getFilenameWithoutExt = function (path) {
  return path.split(".")[0];
};

export async function deleteAllFilesInDir(dirPath) {
  try {
    const files = readdirSync(dirPath);

    const deleteFilePromises = files.map((file) => unlink(path.join(dirPath, file), () => {}));

    await Promise.all(deleteFilePromises);
  } catch (err) {
    console.log(err);
  }
}
