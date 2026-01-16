const fs = require("fs");
const https = require("https");
const path = require("path");

/* ================= CONFIG ================= */

const TOKEN = process.env.GH_TOKEN;
const ORG = "tce-ce6";
const PROJECT_NUMBER = 5;
const DEBUG = process.env.DEBUG === "true";

function log(...args) {
  if (DEBUG) console.log(...args);
}

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
                  ... on ProjectV2FieldCommon {
                    name
                  }
                }
                name
              }
              ... on ProjectV2ItemFieldTextValue {
                field {
                  ... on ProjectV2FieldCommon {
                    name
                  }
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

/* ================= GRAPHQL ================= */

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
  if (item.content?.title) return item.content.title;

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

function isDraft(item) {
  return !item.content;
}

function extractNumber(title) {
  const m = title?.match(/wg(\d+)/i);
  return m ? parseInt(m[1], 10) : 9999;
}

/* ================= MAIN ================= */

(async () => {
  const res = await graphql(query);

  if (res.errors) {
    console.error("❌ GraphQL error");
    console.error(JSON.stringify(res.errors, null, 2));
    process.exit(1);
  }

  const project = res.data?.organization?.projectV2;
  if (!project) {
    console.error("❌ Project not accessible");
    process.exit(1);
  }

  log("Project:", project.title);

  const items = project.items.nodes
    .map(item => {
      const title = getTitle(item);
      if (!title) return null;

      return {
        title,
        status: getStatus(item),
        state: item.content?.state,
        draft: isDraft(item),
        num: extractNumber(title)
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.num - b.num);

  /* ===== Counters ===== */

  const counters = {
    "In progress": 0,
    Done: 0,
    Unknown: 0
  };

  items.forEach(i => {
    counters[i.status] = (counters[i.status] || 0) + 1;
  });

  /* ================= HTML ================= */

  const cards = items.map(i => {
    const folderPath = `../${i.title}`;
    const thumbPath = `${folderPath}/thumb.png`;
    const indexPath = `${folderPath}/index.html`;

    const folderExists = fs.existsSync(path.join(process.cwd(), i.title));
    const thumbExists = fs.existsSync(path.join(process.cwd(), i.title, "thumb.png"));

    return `
<div class="card ${i.status.replace(" ", "-").toLowerCase()}">
  <a ${folderExists ? `href="${indexPath}"` : ""} class="${folderExists ? "" : "disabled"}">
    <img src="${thumbExists ? thumbPath : "../docs/placeholder.png"}">
  </a>
  <div class="meta">
    <div class="title">${i.title}</div>
    <div class="badges">
      <span class="status">${i.status}</span>
      ${i.draft ? `<span class="draft">Draft</span>` : ""}
      ${!folderExists ? `<span class="missing">Missing folder</span>` : ""}
    </div>
  </div>
</div>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>CE6 – Project Status</title>
<style>
body { font-family: Arial; margin: 30px; }
h1 { font-size: 42px; }

.counters { display: flex; gap: 20px; margin-bottom: 30px; }
.counter { font-size: 18px; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px;
  background: #fff;
}

.card img {
  width: 100%;
  height: 140px;
  object-fit: contain;
  background: #f9f9f9;
  border-radius: 6px;
}

.meta { margin-top: 10px; }
.title { font-weight: bold; }

.badges { margin-top: 6px; display: flex; gap: 6px; flex-wrap: wrap; }

.status {
  background: #eee;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
}

.draft {
  background: #999;
  color: #fff;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 12px;
}

.missing {
  background: #c0392b;
  color: #fff;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 12px;
}

.in-progress .status { background: #f39c12; color: #fff; }
.done .status { background: #2ecc71; color: #fff; }

.disabled { pointer-events: none; opacity: 0.6; }
</style>
</head>
<body>

<h1>CE6 – Project Status</h1>

<div class="counters">
  <div class="counter">In progress: ${counters["In progress"]}</div>
  <div class="counter">Done: ${counters["Done"]}</div>
  <div class="counter">Unknown: ${counters["Unknown"]}</div>
</div>

<div class="grid">
${cards}
</div>

</body>
</html>`;

  fs.mkdirSync("docs", { recursive: true });
  fs.writeFileSync("docs/index.html", html.trim());
})();
