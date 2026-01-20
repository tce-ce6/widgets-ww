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

const REPO_ROOT = __dirname;
const DOCS_ROOT = path.join(REPO_ROOT, "docs");

function log(...args) {
  if (DEBUG) console.log(...args);
}

if (!TOKEN) {
  console.error("❌ Missing GH_TOKEN");
  process.exit(1);
}

/* ================= GRAPHQL ================= */

const query = `
query {
  organization(login: "${ORG}") {
    projectV2(number: ${PROJECT_NUMBER}) {
      items(first: 100) {
        nodes {
          content {
            ... on Issue { title }
            ... on PullRequest { title }
          }
          fieldValues(first: 20) {
            nodes {
              __typename
              ... on ProjectV2ItemFieldSingleSelectValue {
                field { ... on ProjectV2FieldCommon { name } }
                name
              }
              ... on ProjectV2ItemFieldTextValue {
                field { ... on ProjectV2FieldCommon { name } }
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
  const t = item.fieldValues.nodes.find(
    n =>
      n.__typename === "ProjectV2ItemFieldTextValue" &&
      n.field?.name === "Title"
  );
  return t?.text;
}

function getStatus(item) {
  const s = item.fieldValues.nodes.find(
    n =>
      n.__typename === "ProjectV2ItemFieldSingleSelectValue" &&
      n.field?.name === "Status"
  );
  return s?.name || "Unknown";
}

function extractNumber(title) {
  const m = title?.match(/wg(\d+)/i);
  return m ? parseInt(m[1], 10) : 9999;
}

/* ================= MAIN ================= */

(async () => {
  const res = await graphql(query);

  if (res.errors) {
    console.error(JSON.stringify(res.errors, null, 2));
    process.exit(1);
  }

  const items = res.data.organization.projectV2.items.nodes
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

  /* ================= STATUS COUNTS ================= */

  const statusCounts = {};
  STATUS_LIST.forEach(s => (statusCounts[s] = 0));
  statusCounts.Unknown = 0;

  items.forEach(i => {
    statusCounts[i.status] = (statusCounts[i.status] || 0) + 1;
  });

  /* ================= TIMESTAMP ================= */

  const releaseTimestamp = new Date().toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata"
  });

  /* ================= CARDS ================= */

  const cards = items.map(i => {
    const folder = path.join(DOCS_ROOT, i.title);
    const thumb = path.join(folder, "thumb.png");

    const folderExists = fs.existsSync(folder);
    const thumbExists = fs.existsSync(thumb);

    return `
<div class="card"
  data-title="${i.title.toLowerCase()}"
  data-status="${i.status}">
  <a ${folderExists ? `href="./${i.title}/index.html"` : ""} class="${folderExists ? "" : "disabled"}">
    <img src="${thumbExists ? `./${i.title}/thumb.png` : "./placeholder.png"}">
  </a>
  <div class="title">${i.title}</div>
  <span class="status ${i.status.replace(/\\s+/g, "-").toLowerCase()}">
    ${i.status}
  </span>
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

.release-time {
  font-size: 13px;
  color: #666;
  margin-bottom: 20px;
}

.controls { margin-bottom: 20px; }
.filters {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 10px;
  font-size: 14px;
}

.filters label {
  display: flex;
  gap: 6px;
  align-items: center;
}

.count {
  color: #666;
  font-size: 12px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.card { border: 1px solid #ddd; padding: 12px; border-radius: 10px; }
.card img { width: 100%; height: 140px; object-fit: contain; background: #f9f9f9; }

.status {
  display: inline-block;
  margin-top: 6px;
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

.hidden { display: none; }
.disabled { pointer-events: none; opacity: 0.6; }
</style>
</head>

<body>

<h1>CE6 – Project Status</h1>
<div class="release-time">Last updated: ${releaseTimestamp}</div>

<div class="controls">
  <input id="search" placeholder="Search wg…" />

  <div class="filters" id="statusFilters">
    ${STATUS_LIST.map(
      s => `
      <label>
        <input type="checkbox" value="${s}">
        ${s} <span class="count">(${statusCounts[s] || 0})</span>
      </label>
    `
    ).join("")}
  </div>
</div>

<div class="grid" id="grid">
${cards}
</div>

<script>
const search = document.getElementById("search");
const cards = [...document.querySelectorAll(".card")];
const checkboxes = [...document.querySelectorAll("#statusFilters input")];

const STORAGE_KEY = "ce6-filters";

/* ===== Restore state ===== */
const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
search.value = saved.search || "";

checkboxes.forEach(cb => {
  cb.checked = saved.statuses
    ? saved.statuses.includes(cb.value)
    : true;
});

function applyFilters() {
  const q = search.value.toLowerCase();
  const activeStatuses = checkboxes
    .filter(c => c.checked)
    .map(c => c.value);

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      search: search.value,
      statuses: activeStatuses
    })
  );

  cards.forEach(card => {
    const matchText = card.dataset.title.includes(q);
    const matchStatus =
      activeStatuses.length === 0 ||
      activeStatuses.includes(card.dataset.status);

    card.classList.toggle("hidden", !(matchText && matchStatus));
  });
}

search.addEventListener("input", applyFilters);
checkboxes.forEach(cb => cb.addEventListener("change", applyFilters));

applyFilters();
</script>

</body>
</html>`;

  fs.mkdirSync(DOCS_ROOT, { recursive: true });
  fs.writeFileSync(path.join(DOCS_ROOT, "index.html"), html.trim());
})();
