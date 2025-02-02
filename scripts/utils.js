export const isProd = function () {
  const argv = process.argv.slice(2).map((v) => v.toLowerCase());
  return argv.includes("--prod");
};

export const getFilenameWithoutExt = function (path) {
  return path.split(".")[0];
};
