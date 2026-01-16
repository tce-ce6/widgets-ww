const fs = require("fs");
const https = require("https");
const path = require("path");

const TOKEN = process.env.GH_TOKEN;
const ORG = "tce-ce6";
const PROJECT_NUMBER = 5;

if (!TOKEN) {
  console.error("Missing GH_TOKEN");
  process.exit(1);
}

/* ---------- GRAPHQL ---------- */

const query = `
query {
  organization(login: "${ORG}") {
    projectV2(number: ${PROJECT_NUMBER}) {
      items(first: 100) {
        nodes {
          content {
            ... on Issue {
              title
              state
            }
          }
          fieldValues(first: 20) {
            nodes {
              ... on ProjectV2ItemFieldSingleSelectValue {
                field {
                  ... on ProjectV2SingleSelectField {
                    name
                  }
                }
                name
              }
            }
          }
        }
      }
    }
  }
}
`;

function graphql(query) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      "https://api.github.com/graphql",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
          "User-Agent": "ce6-status-generator"
        }
      },
      res => {
        let body = "";
        res.on("data", d => (body += d));
        res.on("end", () => resolve(JSON.parse(body)));
      }
    );
    req.on("error", reject);
    req.write(JSON.stringify({ query }));
    req.end();
  });
}

/* ---------- HELPERS ---------- */

function statusClass(status, state) {
  if (state === "CLOSED") return "closed";
  if (status === "In progress") return "in-progress";
  if (status === "Done") return "done";
  return "unknown";
}

function statusLabel(status, state) {
  if (state === "CLOSED") return "Closed by Content";
  return status || "Unknown";
}

/* ---------- MAIN ---------- */

(async () => {
  const data = await graphql(query);
  console.log("pkp storeFingerprint: ~ data:", data)

  const items =
    data?.data?.organization?.projectV2?.items?.nodes || [];

  const rows = items.map(item => {
    const title = item.content?.title;
    if (!title) return "";

    const status =
      item.fieldValues.nodes.find(
        n => n.field?.name === "Status"
      )?.name || "Unknown";

    const cls = statusClass(status, item.content.state);
    const label = statusLabel(status, item.content.state);

    return `
<li class="${cls}">
  <a href="../${title}/index.html">
    <img src="../${title}/thumb.png" alt="${title}">
  </a>
  <span>${title} — ${label}</span>
</li>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>CE6 – Project Status</title>
<style>
body { font-family: Arial; margin: 40px; }
h1 { font-size: 48px; }
ul { list-style: none; padding: 0; }
li { display: flex; align-items: center; gap: 20px; margin: 12px 0; font-size: 26px; }
img { width: 80px; height: 80px; object-fit: contain; border: 1px solid #ddd; border-radius: 6px; }
.in-progress { color: #f39c12; font-weight: 600; }
.done { color: #2ecc71; font-weight: 600; }
.closed { color: #000; font-weight: 700; }
.unknown { color: #000; font-weight: 700; }
</style>
</head>
<body>

<h1>CE6 – Project Status</h1>
<ul>
${rows}
</ul>

</body>
</html>`;

  const docsDir = path.join(process.cwd(), "docs");
  fs.mkdirSync(docsDir, { recursive: true });

  fs.writeFileSync(path.join(docsDir, "index.html"), html.trim());
  console.log("docs/index.html generated");
})();
