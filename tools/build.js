const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

copyClean();
copyFile("appinfo.json", "appinfo.json");
copyDirectory("assets", "assets");
normalizeShellScripts(path.join(dist, "assets"));
copyFile("frontend/index.js", "frontend/index.js");
copyFile("frontend/styles.css", "frontend/styles.css");
writeFontOptions();
writeIndex();

function copyClean() {
  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(dist, { recursive: true });
}

function copyFile(from, to) {
  const target = path.join(dist, to);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(path.join(root, from), target);
}

function copyDirectory(from, to) {
  const source = path.join(root, from);
  const target = path.join(dist, to);
  fs.cpSync(source, target, { recursive: true });
}

function normalizeShellScripts(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      normalizeShellScripts(entryPath);
    } else if (entry.name.endsWith(".sh")) {
      const content = fs.readFileSync(entryPath, "utf8").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      fs.writeFileSync(entryPath, content, "utf8");
    }
  }
}

function writeFontOptions() {
  const fonts = fs
    .readdirSync(path.join(root, "assets"))
    .filter((file) => /\.(ttf|otf)$/i.test(file))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => ({ value: file, label: labelFromFontFile(file) }));

  fs.writeFileSync(
    path.join(dist, "frontend", "font-options.js"),
    "window.AERIAL_FONT_OPTIONS = " + JSON.stringify(fonts, null, 2) + ";\n",
    "utf8",
  );
}

function labelFromFontFile(file) {
  return file
    .replace(/\.(ttf|otf)$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function writeIndex() {
  fs.writeFileSync(
    path.join(dist, "index.html"),
    [
      "<!doctype html>",
      '<html lang="en">',
      "<head>",
      '  <meta charset="utf-8" />',
      '  <meta name="viewport" content="width=device-width, initial-scale=1" />',
      "  <title>webOS Aerial Screensaver</title>",
      '  <link rel="stylesheet" href="frontend/styles.css" />',
      "</head>",
      "<body>",
      '  <script src="frontend/font-options.js"></script>',
      '  <script src="frontend/index.js"></script>',
      "</body>",
      "</html>",
      "",
    ].join("\n"),
  );
}
