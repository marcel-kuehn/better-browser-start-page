import fs from "fs";
import path from "path";

const configDir = path.resolve();
const files = [
  "example.app.config.json",
];

files.forEach((file) => {
  const srcFile = path.join(configDir, file);
  const destFile = path.join(configDir, file.replace("example.", ""));

  if (!fs.existsSync(srcFile)) {
    console.error(`Source file not found: ${srcFile}`);
    return;
  }

  if (fs.existsSync(destFile)) {
    console.log(`File already exists, skipping: ${destFile}`);
  } else {
    fs.copyFileSync(srcFile, destFile);
    console.log(`Copied ${srcFile} to ${destFile}`);
  }
});
