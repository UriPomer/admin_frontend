const fse = require("fs-extra");
const path = require("path");
const topDir = __dirname;

const parentDir = path.dirname(topDir);

fse.emptyDirSync(path.join(parentDir, "public", "tinymce"));
fse.copySync(
  path.join(parentDir, "node_modules", "tinymce"),
  path.join(parentDir, "public", "tinymce"),
  { overwrite: true }
);
