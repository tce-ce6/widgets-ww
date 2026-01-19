const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const PORT = 8080;

http.createServer((req, res) => {
  let urlPath = req.url;

  // Serve docs/index.html at root
  if (urlPath === "/") {
    urlPath = "/docs/index.html";
  }

  let filePath = path.join(ROOT, urlPath);

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    return res.end("Not found");
  }

  if (fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  const ext = path.extname(filePath);
  const type =
    ext === ".png" ? "image/png" :
    ext === ".html" ? "text/html" :
    "text/plain";

  res.writeHead(200, { "Content-Type": type });
  fs.createReadStream(filePath).pipe(res);
}).listen(PORT, () => {
  console.log(`Preview: http://localhost:${PORT}`);
});
