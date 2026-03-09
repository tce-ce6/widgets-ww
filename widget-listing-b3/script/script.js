// Auto-discovers all wg* folders from the deploy branch via GitHub API.
// No manual registration needed — push a folder, it appears on the listing.

const REPO     = 'tce-ce6/widgets-ww';
const BRANCH   = 'deploy';
const BASE_URL = 'https://tce-ce6.github.io/widgets-ww';
const API_URL  = `https://api.github.com/repos/${REPO}/contents/?ref=${BRANCH}`;

function titleCase(str) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function folderToWidget(name) {
  const num   = (name.match(/^wg(\d+)/) || [])[1] || '';
  const raw   = name.replace(/^wg\d+-?/, '');
  const title = raw ? titleCase(raw) : `Widget ${num}`;
  return {
    num,
    title,
    link:      `${BASE_URL}/${name}/`,
    imagePath: `./widget-listing-b3/assets/wg-${num}.png`,
  };
}

document.addEventListener('DOMContentLoaded', async () => {
  const listEl   = document.getElementById('widget-listing');
  const totalEl  = document.getElementById('total');
  const searchEl = document.getElementById('widget-search');

  listEl.innerHTML =
    '<li class="loading-item"><span class="loading-text">Loading widgets…</span></li>';

  // ── Fetch widget folders from GitHub API ──
  let widgets = [];
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
    const items = await res.json();
    if (!Array.isArray(items)) throw new Error(items.message || 'Unexpected API response');

    widgets = items
      .filter(i => i.type === 'dir' && /^wg\d+/.test(i.name))
      .map(i => folderToWidget(i.name))
      .sort((a, b) => parseInt(a.num) - parseInt(b.num));
  } catch (err) {
    listEl.innerHTML =
      `<li class="loading-item"><span class="loading-text">Could not load widgets — ${err.message}</span></li>`;
    totalEl.textContent = '0';
    console.error(err);
    return;
  }

  // ── Render ──
  function render() {
    const q        = searchEl.value.trim().toLowerCase();
    const filtered = q
      ? widgets.filter(w =>
          w.title.toLowerCase().includes(q) || w.num.includes(q))
      : widgets;

    totalEl.textContent = filtered.length;

    if (filtered.length === 0) {
      listEl.innerHTML =
        '<li class="loading-item"><span class="loading-text">No widgets match your search.</span></li>';
      return;
    }

    listEl.innerHTML = '';
    filtered.forEach(w => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="${w.link}">
          <img src="${w.imagePath}" alt="${w.title}">
          <span class="wg-num">wg${w.num}</span>
          <p class="widget-name">${w.title}</p>
        </a>`;
      listEl.appendChild(li);
    });
  }

  render();
  searchEl.addEventListener('input', render);
});
