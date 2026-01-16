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

/* ================= GRAPHQL QUERY ================= */

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

              ... on ProjectV2ItemFieldTextValue {
                field {
                  name
                }
                text
              }
            }
          }
        }
      }
    }
  }
}
`;

/* ================= GRAPHQL CALL ================= */

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

/* ================= HELPERS ================= */

function getTitle(item) {
  // Issue / PR
  if (item.content?.title) return item.content.title;

  // Draft item → Title field
  const titleField = item.fieldValues.nodes.find(
    n =>
      n.__typename === "ProjectV2ItemFieldTextValue" &&
      n.field?.name === "Title"
  );

  return titleField?.text;
}

function getStatus(item) {
  const statusField = item.fieldValues.nodes.find(
    n =>
      n.__typename === "ProjectV2ItemFieldSingleSelectValue" &&
      n.field?.name === "Status"
  );

  return statusField?.name || "Unknown";
}

function statusClass(status, state) {
  if (state === "CLOSED") return "closed";
  if (status === "In progress") return "in-progress";
  if (status === "Done") return "done";
  return "unknown";
}

/* ================= MAIN ================= */

(async () => {
  console.log("▶ Fetching project data…");

  const response = await graphql(query);

  if (response.errors) {
    console.error("❌ GraphQL errors:");
    console.error(JSON.stringify(response.errors, null, 2));
    process.exit(1);
  }

  const project = response?.data?.organization?.projectV2;
  console.log("▶ Project title:", project.title);

  const items = project.items.nodes;
  console.log("▶ Total items returned:", items.length);

  let rendered = 0;

  const rows = items.map((item, index) => {
    console.log(`\n--- Item ${index + 1} ---`);

    const title = getTitle(item);
    console.log("Title:", title);

    if (!title) {
      console.warn("⚠ No title found (skipped)");
      return "";
    }

    const status = getStatus(item);
    console.log("Status:", status);

    const state = item.content?.state;
    console.log("State:", state);

    rendered++;

    return `
<li class="${statusClass(status, state)}">
  <a href="../${title}/index.html">
    <img src="../${title}/thumb.png" alt="${title}">
  </a>
  <span>${title} — ${status}</span>
</li>`;
  }).join("");

  console.log("\n▶ Rendered rows:", rendered);

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

  fs.mkdirSync("docs", { recursive: true });
  fs.writeFileSync("docs/index.html", html.trim());

  console.log("✅ docs/index.html generated successfully");
})();
