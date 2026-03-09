// Widget listing page.
// Folder discovery:   1 GitHub API call  (contents endpoint).
// Timestamps/authors: 1 fetch from meta.json (built by GitHub Actions on every push — no rate limits).
//
// meta.json shape:
//   { folders: { "wgXX-name": { updatedAt, author }, ... },
//     commits:  [ { date, author, widgets: [71, 74, ...] }, ... ] }

const REPO     = 'tce-ce6/widgets-ww';
const BRANCH   = 'deploy';
const BASE_URL = 'https://tce-ce6.github.io/widgets-ww';
const API_BASE = `https://api.github.com/repos/${REPO}`;
const META_URL = `https://raw.githubusercontent.com/${REPO}/${BRANCH}/widget-listing-b3/data/meta.json`;

// ── Helpers ────────────────────────────────────────────────────────────────────
function titleCase(str) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function folderToWidget(name) {
  const num = (name.match(/^wg(\d+)/) || [])[1] || '';
  const raw = name.replace(/^wg\d+-?/, '');
  return {
    num,
    folder:    name,
    title:     raw ? titleCase(raw) : `Widget ${num}`,
    link:      `${BASE_URL}/${name}/`,
    imagePath: `./widget-listing-b3/assets/wg-${num}.png`,
    updatedAt: null,
    author:    null,
  };
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

async function loadMeta() {
  try {
    const res = await fetch(META_URL);
    if (!res.ok) return { folders: {}, commits: [] };
    const data = await res.json();
    // support both new { folders, commits } shape and legacy flat shape
    if (data.folders) return data;
    return { folders: data, commits: [] };
  } catch { return { folders: {}, commits: [] }; }
}

// ── Main ───────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  const listEl          = document.getElementById('widget-listing');
  const totalEl         = document.getElementById('total');
  const searchEl        = document.getElementById('widget-search');
  const pageUpdEl       = document.getElementById('page-updated');
  const recentActEl     = document.getElementById('recent-activity');
  const sortChipsEl     = document.getElementById('sort-chips');
  const userChipsEl     = document.getElementById('user-chips');

  let widgets    = [];
  let allCommits = [];       // full commits array from meta.json
  let activeSort = 'time';
  let activeUser = 'all';

  // ── Sorting ──────────────────────────────────────────────────────────────────
  function applySorted(arr) {
    const copy = [...arr];
    if (activeSort === 'time') {
      copy.sort((a, b) => {
        if (!a.updatedAt && !b.updatedAt) return parseInt(a.num) - parseInt(b.num);
        if (!a.updatedAt) return 1;
        if (!b.updatedAt) return -1;
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
    } else if (activeSort === 'name') {
      copy.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      copy.sort((a, b) => parseInt(a.num) - parseInt(b.num));
    }
    return copy;
  }

  // ── Card ─────────────────────────────────────────────────────────────────────
  function renderCard(w) {
    const li = document.createElement('li');
    li.dataset.folder = w.folder;
    li.innerHTML = `
      <a href="${w.link}">
        <img src="${w.imagePath}" alt="${w.title}">
        <span class="wg-num">wg${w.num}</span>
        <p class="widget-name">${w.title}</p>
        <span class="card-meta">
          ${w.updatedAt ? `<span class="card-ts">${fmtDate(w.updatedAt)}</span>` : ''}
          ${w.author    ? `<span class="card-author">${w.author}</span>`          : ''}
        </span>
      </a>`;
    return li;
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  function render() {
    const q = searchEl.value.trim().toLowerCase();

    let filtered = applySorted(widgets);
    if (activeUser !== 'all') filtered = filtered.filter(w => w.author === activeUser);
    if (q) filtered = filtered.filter(w =>
      w.title.toLowerCase().includes(q) || w.num.includes(q)
    );

    totalEl.textContent = filtered.length;

    if (filtered.length === 0) {
      listEl.innerHTML = '<li class="loading-item"><span class="loading-text">No widgets match your search.</span></li>';
      return;
    }
    listEl.innerHTML = '';
    filtered.forEach(w => listEl.appendChild(renderCard(w)));
  }

  // ── Recent activity panel ─────────────────────────────────────────────────────
  // All-users mode: last 5 commits across everyone.
  // User selected: last 3 commits by that user.
  function buildActivityPanel(user) {
    if (!allCommits.length) { recentActEl.innerHTML = ''; return; }

    const rows = user === 'all'
      ? allCommits.slice(0, 5)
      : allCommits.filter(c => c.author === user).slice(0, 3);

    if (!rows.length) { recentActEl.innerHTML = ''; return; }

    const items = rows.map((c, i) => {
      const label  = i === 0 ? 'Last&nbsp;Updated' : 'Updated';
      const nums   = c.widgets.map(n => `<a class="act-wg" href="${BASE_URL}/wg${n}-*/" title="wg${n}">wg${n}</a>`).join(' ');
      // For user-filtered view, omit the author name (it's the selected chip)
      const who    = user === 'all' ? `<span class="act-author">${c.author}</span>` : '';
      return `
        <div class="act-row${i === 0 ? ' act-row--first' : ''}">
          <span class="act-label">${label}</span>
          <span class="act-date">${fmtDate(c.date)}</span>
          ${who}
          <span class="act-widgets">(${c.widgets.join(', ')})</span>
        </div>`;
    });

    const heading = user === 'all'
      ? 'Recent Activity'
      : `${user} — Recent Activity`;

    recentActEl.innerHTML =
      `<h2 class="act-heading">${heading}</h2>` + items.join('');
  }

  // ── Page-level header subtitle (first commit) ─────────────────────────────────
  function setPageUpdated() {
    if (!allCommits.length) return;
    const c = allCommits[0];
    const nums = c.widgets.join(', ');
    pageUpdEl.textContent =
      `Updated ${fmtDate(c.date)}  ·  ${c.author}  (${nums})`;
  }

  // ── Sort chips ───────────────────────────────────────────────────────────────
  sortChipsEl.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSort = btn.dataset.sort;
      sortChipsEl.querySelectorAll('.chip').forEach(c =>
        c.classList.toggle('active', c === btn)
      );
      render();
    });
  });

  // ── User chips ────────────────────────────────────────────────────────────────
  function buildUserChips(folders) {
    const users = [...new Set(
      Object.values(folders).map(m => m.author).filter(Boolean)
    )].sort();

    userChipsEl.innerHTML = '';
    if (!users.length) return;

    const label = document.createElement('span');
    label.className = 'chips-label';
    label.textContent = 'User';
    userChipsEl.appendChild(label);

    ['all', ...users].forEach(user => {
      const btn = document.createElement('button');
      btn.className = 'chip' + (user === activeUser ? ' active' : '');
      btn.dataset.user = user;
      btn.textContent = user === 'all' ? 'All Users' : user;
      btn.addEventListener('click', () => {
        activeUser = user;
        userChipsEl.querySelectorAll('.chip').forEach(c =>
          c.classList.toggle('active', c.dataset.user === user)
        );
        buildActivityPanel(activeUser);
        render();
      });
      userChipsEl.appendChild(btn);
    });
  }

  // ── 1. Fetch wg* folders (1 API call) ────────────────────────────────────────
  listEl.innerHTML =
    '<li class="loading-item"><span class="loading-text">Loading widgets…</span></li>';

  try {
    const res = await fetch(`${API_BASE}/contents/?ref=${BRANCH}`);
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const items = await res.json();
    if (!Array.isArray(items)) throw new Error(items.message || 'Unexpected response');

    widgets = items
      .filter(i => i.type === 'dir' && /^wg\d+/.test(i.name))
      .map(i => folderToWidget(i.name))
      .sort((a, b) => parseInt(a.num) - parseInt(b.num));
  } catch (err) {
    listEl.innerHTML = `<li class="loading-item">
      <span class="loading-text">Could not load widgets — ${err.message}</span></li>`;
    totalEl.textContent = '0';
    console.error(err);
    return;
  }

  render();
  searchEl.addEventListener('input', render);

  // ── 2. Fetch meta.json (1 fetch, no rate limit) ───────────────────────────────
  const meta = await loadMeta();
  allCommits = meta.commits || [];

  widgets.forEach(w => {
    const info = meta.folders?.[w.folder];
    if (!info) return;
    w.updatedAt = info.updatedAt;
    w.author    = info.author;
  });

  setPageUpdated();
  buildActivityPanel('all');
  buildUserChips(meta.folders || {});
  render();
});
