const fs = require("fs");
const https = require("https");
const path = require("path");

/* ================= CONFIG ================= */

const TOKEN = process.env.GH_TOKEN;
const ORG = "tce-ce6";
const PROJECT_NUMBER = 5;
const DEBUG = process.env.DEBUG === "true";

const STATUS_LIST = [
  "Ready for Tech",
  "TODO by tech",
  "In progress",
  "In review with Content",
  "Closed by Content"
];

function log(...args) {
  if (DEBUG) console.log(...args);
}

log(
  "Token type:",
  process.env.GITHUB_ACTIONS ? "Actions token" : "Local token"
);

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

  log("Project title:", project.title);

  const items = project.items.nodes
    .map(item => {
      const title = getTitle(item);
      if (!title) return null;

      return {
        title,
        status: getStatus(item),
        num: extractNumber(title)
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.num - b.num);

  /* ================= BUILD-TIME VALIDATION ================= */

  let missingFolders = 0;
  let missingThumbs = 0;

  items.forEach(i => {
    const folder = path.join(process.cwd(), i.title);
    const thumb = path.join(folder, "thumb.png");

    if (!fs.existsSync(folder)) {
      console.warn(`⚠ Missing folder: ${i.title}/`);
      missingFolders++;
    } else if (!fs.existsSync(thumb)) {
      console.warn(`⚠ Missing thumb.png in ${i.title}/`);
      missingThumbs++;
    }
  });

  console.log(
    `✔ Validation → Missing folders: ${missingFolders}, Missing thumbs: ${missingThumbs}`
  );

  /* ================= COUNTERS ================= */

  const counters = {};
  STATUS_LIST.forEach(s => (counters[s] = 0));
  counters["Unknown"] = 0;

  items.forEach(i => {
    counters[i.status] = (counters[i.status] || 0) + 1;
  });

  /* ================= CARDS ================= */

  const cards = items.map(i => {
    const folderExists = fs.existsSync(path.join(process.cwd(), i.title));
    const thumbExists = fs.existsSync(
      path.join(process.cwd(), i.title, "thumb.png")
    );

    const linkUrl = folderExists ? `./${i.title}/index.html` : "";
    const thumbUrl = thumbExists
      ? `./${i.title}/thumb.png`
      : `./placeholder.png`;

    return `
<div class="card"
  data-title="${i.title.toLowerCase()}"
  data-status="${i.status}">
  <a ${folderExists ? `href="${linkUrl}"` : ""} class="${folderExists ? "" : "disabled"}">
    <img src="${thumbUrl}" alt="${i.title}">
  </a>
  <div class="meta">
    <div class="title">${i.title}</div>
    <div class="badges">
      <span class="status ${i.status.replace(/\\s+/g, "-").toLowerCase()}">
        ${i.status}
      </span>
      ${!folderExists ? `<span class="missing">Missing folder</span>` : ""}
    </div>
  </div>
</div>`;
  }).join("");

  /* ================= HTML ================= */

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>B3 Widgets Status</title>

<style>
body { font-family: Arial; margin: 30px; }
h1 { font-size: 42px; }

.controls { display: flex; gap: 12px; margin-bottom: 20px; }
input, select { padding: 6px 10px; font-size: 14px; }

.counters { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }

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

.title { font-weight: bold; margin-top: 8px; }

.status {
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
  color: #fff;
}

.ready-for-tech { background: #27ae60; }
.todo-by-tech { background: #2980b9; }
.in-progress { background: #f39c12; }
.in-review-with-content { background: #8e44ad; }
.closed-by-content { background: #2c3e50; }

.missing {
  background: #c0392b;
  color: #fff;
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 12px;
}

.disabled { pointer-events: none; opacity: 0.6; }
.hidden { display: none; }
</style>
</head>

<body>

<h1>CE6 – Project Status</h1>

<div class="controls">
  <input id="search" placeholder="Search wg…" />
  <select id="statusFilter">
    <option value="all">All statuses</option>
    ${STATUS_LIST.map(s => `<option>${s}</option>`).join("")}
  </select>
</div>

<div class="counters">
  ${STATUS_LIST.map(s => `<div>${s}: ${counters[s]}</div>`).join("")}
  <div>Unknown: ${counters["Unknown"]}</div>
</div>

<div class="grid" id="grid">
${cards}
</div>

<script>
const search = document.getElementById("search");
const statusFilter = document.getElementById("statusFilter");
const cards = [...document.querySelectorAll(".card")];

function applyFilters() {
  const q = search.value.toLowerCase();
  const status = statusFilter.value;

  cards.forEach(card => {
    const matchText = card.dataset.title.includes(q);
    const matchStatus =
      status === "all" || card.dataset.status === status;

    card.classList.toggle("hidden", !(matchText && matchStatus));
  });
}

[search, statusFilter].forEach(el =>
  el.addEventListener("input", applyFilters)
);
</script>

</body>
</html>`;

  fs.mkdirSync("docs", { recursive: true });
  fs.writeFileSync("docs/index.html", html.trim());
})();
