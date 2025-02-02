import { readdirSync, unlink } from "fs";
import path from "path";

async function deleteAllFilesInDir(dirPath) {
  try {
    const files = readdirSync(dirPath);

    const deleteFilePromises = files.map((file) => unlink(path.join(dirPath, file), () => {}));

    await Promise.all(deleteFilePromises);
  } catch (err) {
    console.log(err);
  }
}

Promise.all([deleteAllFilesInDir("dist/css"), deleteAllFilesInDir("dist/js")]);
