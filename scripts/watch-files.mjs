import chokidar from "chokidar";

import { buildAllScripts } from "./build-scripts.mjs";
import { buildAllStyles } from "./build-styles.mjs";

chokidar.watch("src/js").on("change", async () => {
  console.log("Building scripts...");
  await buildAllScripts();
  console.log("Finished");
});

chokidar.watch("src/styles").on("change", async () => {
  console.log("Building styles...");
  await buildAllStyles();
  console.log("Finished");
});
