const fs = require("fs");
const https = require("https");
const path = require("path");

const TOKEN = process.env.GH_TOKEN;
const ORG = "tce-ce6";
const PROJECT_NUMBER = 5;

console.log("▶ Generator started");
console.log("▶ Org:", ORG);
console.log("▶ Project:", PROJECT_NUMBER);
console.log("▶ Token present:", !!TOKEN);

if (!TOKEN) {
  console.error("❌ Missing GH_TOKEN");
  process.exit(1);
}

/* ---------------- GRAPHQL QUERY ---------------- */

const query = `
query {
  organization(login: "${ORG}") {
    projectV2(number: ${PROJECT_NUMBER}) {
      title
      items(first: 100) {
        nodes {
          id
          content {
            __typename
            ... on Issue {
              title
              state
            }
            ... on PullRequest {
              title
              state
            }
            ... on ProjectV2DraftIssue {
              title
            }
          }
          fieldValues(first: 20) {
            nodes {
              __typename
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
        res.on("end", () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            console.error("❌ Failed to parse response");
            console.error(body);
            reject(e);
          }
        });
      }
    );
    req.on("error", reject);
    req.write(JSON.stringify({ query }));
    req.end();
  });
}

/* ---------------- HELPERS ---------------- */

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

/* ---------------- MAIN ---------------- */

(async () => {
  console.log("▶ Fetching project data…");

  const data = await graphql(query);

  console.log("▶ Raw API keys:", Object.keys(data || {}));

  const project =
    data?.data?.organization?.projectV2;

  if (!project) {
    console.error("❌ Project not found or access denied");
    console.error(JSON.stringify(data, null, 2));
    process.exit(1);
  }

  console.log("▶ Project title:", project.title);

  const items = project.items?.nodes || [];
  console.log("▶ Total items returned:", items.length);

  let renderedCount = 0;
  let skippedNoTitle = 0;

  const rows = items.map((item, index) => {
    console.log(`\n--- Item ${index + 1} ---`);
    console.log("ID:", item.id);
    console.log("Type:", item.content?.__typename);

    if (!item.content) {
      console.warn("⚠ Item has NO content (skipped)");
      skippedNoTitle++;
      return "";
    }

    const title = item.content.title;
    console.log("Title:", title);

    if (!title) {
      console.warn("⚠ Item has no title (skipped)");
      skippedNoTitle++;
      return "";
    }

    const statusNode = item.fieldValues.nodes.find(
      n => n.field?.name === "Status"
    );

    const status = statusNode?.name || "Unknown";

    console.log("Status:", status);

    const state = item.content.state;
    console.log("State:", state);

    const cls = statusClass(status, state);
    const label = statusLabel(status, state);

    renderedCount++;

    return `
<li class="${cls}">
  <a href="../${title}/index.html">
    <img src="../${title}/thumb.png" alt="${title}">
  </a>
  <span>${title} — ${label}</span>
</li>`;
  }).join("");

  console.log("\n▶ Rendered rows:", renderedCount);
  console.log("▶ Skipped (no title):", skippedNoTitle);

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

<h1>CE6 – Project Status 2</h1>
<ul>
${rows}
</ul>

</body>
</html>`;

  const docsDir = path.join(process.cwd(), "docs");
  fs.mkdirSync(docsDir, { recursive: true });

  fs.writeFileSync(path.join(docsDir, "index.html"), html.trim());

  console.log("✅ docs/index.html written successfully");
})();
