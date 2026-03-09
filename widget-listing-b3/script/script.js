// Widget listing page.
// Folder discovery:  1 GitHub API call (contents endpoint).
// Timestamps/authors: 1 fetch from meta.json (built by GitHub Actions on push).
// No per-widget API calls — no rate-limit issues.

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

// ── Meta loading ───────────────────────────────────────────────────────────────
async function loadFolderMeta() {
  try {
    const res = await fetch(META_URL);
    if (!res.ok) return {};
    return await res.json();
  } catch {
    return {};
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  const listEl      = document.getElementById('widget-listing');
  const totalEl     = document.getElementById('total');
  const searchEl    = document.getElementById('widget-search');
  const sortChipsEl = document.getElementById('sort-chips');
  const userChipsEl = document.getElementById('user-chips');

  let widgets    = [];
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

  // ── Card renderer ─────────────────────────────────────────────────────────────
  function renderCard(w) {
    const li = document.createElement('li');
    li.dataset.folder = w.folder;
    li.innerHTML = `
      <a href="${w.link}">
        <img src="${w.imagePath}" alt="${w.title}">
        <span class="wg-num">wg${w.num}</span>
        <p class="widget-name">${w.title}</p>
        <span class="updated-date">
          ${w.updatedAt ? `<span class="upd-ts">${fmtDate(w.updatedAt)}</span>` : ''}
          ${w.author    ? `<span class="upd-author">${w.author}</span>`          : ''}
        </span>
      </a>`;
    return li;
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  function render() {
    const q = searchEl.value.trim().toLowerCase();

    let filtered = applySorted(widgets);

    if (activeUser !== 'all') {
      filtered = filtered.filter(w => w.author === activeUser);
    }
    if (q) {
      filtered = filtered.filter(w =>
        w.title.toLowerCase().includes(q) || w.num.includes(q)
      );
    }

    totalEl.textContent = filtered.length;

    if (filtered.length === 0) {
      listEl.innerHTML = '<li class="loading-item"><span class="loading-text">No widgets match your search.</span></li>';
      return;
    }

    listEl.innerHTML = '';
    filtered.forEach(w => listEl.appendChild(renderCard(w)));
  }

  // ── Sort chip handlers ───────────────────────────────────────────────────────
  sortChipsEl.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSort = btn.dataset.sort;
      sortChipsEl.querySelectorAll('.chip').forEach(c =>
        c.classList.toggle('active', c === btn)
      );
      render();
    });
  });

  // ── User chip builder (runs after meta loads) ─────────────────────────────────
  function buildUserChips(meta) {
    const users = [...new Set(
      Object.values(meta).map(m => m.author).filter(Boolean)
    )].sort();

    userChipsEl.innerHTML = '';
    if (users.length === 0) return;

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
        render();
      });
      userChipsEl.appendChild(btn);
    });
  }

  // ── 1. Discover wg* folders (1 API call) ─────────────────────────────────────
  listEl.innerHTML =
    '<li class="loading-item"><span class="loading-text">Loading widgets…</span></li>';

  try {
    const res = await fetch(`${API_BASE}/contents/?ref=${BRANCH}`);
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const items = await res.json();
    if (!Array.isArray(items)) throw new Error(items.message || 'Unexpected API response');

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

  // ── 2. Load meta.json (1 fetch, no rate limit) ────────────────────────────────
  const meta = await loadFolderMeta();

  widgets.forEach(w => {
    const info = meta[w.folder];
    if (!info) return;
    w.updatedAt = info.updatedAt;
    w.author    = info.author;
  });

  buildUserChips(meta);
  render(); // re-render with real timestamps + sort-by-time applied
});
