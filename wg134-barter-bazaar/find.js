const fs = require("fs");
const content = fs.readFileSync(
  "c:\\Users\\Admin\\Documents\\GitHub\\widgets-ww\\wg134-barter-bazaar\\index.html",
  "utf8",
);

const regex = /id="([^"]+)"/g;
let match;
const ids = new Set();
while ((match = regex.exec(content)) !== null) {
  ids.add(match[1]);
}

fs.writeFileSync(
  "c:\\Users\\Admin\\Documents\\GitHub\\widgets-ww\\wg134-barter-bazaar\\all_ids.txt",
  Array.from(ids).sort().join("\n"),
);
console.log("Done mapping IDs");
