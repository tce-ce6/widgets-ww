// ── Widget data source ─────────────────────────────────────────────────────────
// Each deploy script writes a widget.json into the widget's folder, then
// rebuilds this manifest. GitHub Pages serves it as a static file.
const DATA_URL = './data/widgets.json';

// ── Chip definitions ───────────────────────────────────────────────────────────
const STATUS_CHIPS = [
  { label: 'Closed', value: 'closed' },
  { label: 'Review', value: 'in-review' },
  { label: 'WIP',    value: 'WIP-With-Tech' },
  { label: 'Todo',   value: 'todo' },
  { label: 'All',    value: 'all' },
];

const SORT_CHIPS = [
  { label: 'Date',   value: 'date' },
  { label: 'Name',   value: 'name' },
  { label: 'Number', value: 'number' },
];

// ── Chip builders ──────────────────────────────────────────────────────────────
function buildChipGroup(containerEl, chips, defaultValue, onChange) {
  containerEl.innerHTML = '';
  chips.forEach(({ label, value }) => {
    const btn = document.createElement('button');
    btn.className = 'chip' + (value === defaultValue ? ' active' : '');
    btn.dataset.value = value;
    btn.textContent = label;
    btn.addEventListener('click', function () {
      containerEl.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      onChange(this.dataset.value);
    });
    containerEl.appendChild(btn);
  });
}

function buildStatusChips(containerEl, defaultValue, onChange) {
  buildChipGroup(containerEl, STATUS_CHIPS, defaultValue, onChange);
}

function buildCreatorChips(containerEl, widgetData, defaultValue, onChange) {
  const seen = new Set();
  widgetData.forEach(w => {
    const prefix = (w.creators || '').split('-')[0];
    if (prefix) seen.add(prefix);
  });
  const chips = [
    { label: 'All', value: 'all' },
    ...[...seen].sort().map(p => ({ label: p.toUpperCase(), value: p })),
  ];
  buildChipGroup(containerEl, chips, defaultValue, onChange);
}

function buildSortChips(containerEl, defaultValue, onChange) {
  buildChipGroup(containerEl, SORT_CHIPS, defaultValue, onChange);
}

function getWgNum(widget) {
  const m = (widget.imagePath || '').match(/wg-(\d+)/);
  return m ? m[1] : '';
}

// ── Main ───────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async function () {
  const sidebar       = document.getElementById('sidebar');
  const toggleButton  = document.getElementById('toggle-btn');
  const widgetListing = document.getElementById('widget-listing');
  const totalCount    = document.getElementById('total');
  const iframe        = document.querySelector('iframe');
  const statusChipEl  = document.getElementById('status-chips');
  const creatorChipEl = document.getElementById('creator-chips');
  const sortChipEl    = document.getElementById('sort-chips');
  const searchInput   = document.getElementById('widget-search');

  function toggleSidebar() {
    sidebar.classList.toggle('active');
    toggleButton.textContent = sidebar.classList.contains('active') ? 'Hide' : 'Show';
  }
  toggleButton.addEventListener('click', toggleSidebar);

  // ── Show loading state ──
  widgetListing.innerHTML = '<li class="loading-item"><span class="loading-text">Loading widgets…</span></li>';
  totalCount.textContent = '…';

  // ── Fetch widget data from local manifest ──
  let WIDGET_DATA = [];
  try {
    const res = await fetch(DATA_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    WIDGET_DATA = data ? Object.values(data).filter(Boolean) : [];
  } catch (err) {
    widgetListing.innerHTML =
      '<li class="loading-item"><span class="loading-text">Failed to load widgets. Please refresh.</span></li>';
    totalCount.textContent = '0';
    console.error('DB fetch failed:', err);
    return;
  }

  let activeStatus  = 'closed';
  let activeCreator = 'all';
  let activeSortBy  = 'date';
  let activeSearch  = '';

  function loadWidgetList() {
    widgetListing.innerHTML = '';

    let widgets = [...WIDGET_DATA];

    if (activeStatus !== 'all') {
      widgets = widgets.filter(w => w.status === activeStatus);
    }
    if (activeCreator !== 'all') {
      widgets = widgets.filter(w => (w.creators || '').startsWith(activeCreator));
    }
    if (activeSearch) {
      const q = activeSearch.toLowerCase();
      widgets = widgets.filter(w => {
        const name = w.name.toLowerCase();
        const num  = getWgNum(w);
        const date = (w.updatedAt || '').toLowerCase();
        return name.includes(q) || num.includes(q) || date.includes(q);
      });
    }

    switch (activeSortBy) {
      case 'date':
        widgets.sort((a, b) => {
          const da = a.updatedAt || '';
          const db = b.updatedAt || '';
          if (!da && !db) return 0;
          if (!da) return 1;
          if (!db) return -1;
          return db.localeCompare(da);
        });
        break;
      case 'name':
        widgets.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'number':
        widgets.sort((a, b) => (parseInt(getWgNum(a)) || 0) - (parseInt(getWgNum(b)) || 0));
        break;
    }

    widgets.forEach(widget => {
      const listItem = document.createElement('li');
      listItem.dataset.widgetLink = widget.link;
      listItem.innerHTML = `
        <img src="${widget.imagePath}" alt="${widget.name} Thumbnail">
        <p class="widget-name">${widget.name}</p>
        <span class="creators">${widget.creators || ''}</span>
        ${widget.updatedAt ? `<span class="updated-date">${widget.updatedAt}</span>` : ''}
      `;
      listItem.addEventListener('click', function () {
        sidebar.classList.toggle('active');
        iframe.src = this.dataset.widgetLink;
        document.querySelectorAll('#widget-listing li').forEach(li => li.classList.remove('active'));
        this.classList.add('active');
      });
      widgetListing.appendChild(listItem);
    });

    if (widgets.length > 0) {
      iframe.src = widgets[0].link;
      const firstLi = document.querySelector('#widget-listing li');
      if (firstLi) firstLi.classList.add('active');
    } else {
      iframe.src = 'about:blank';
    }

    totalCount.textContent = widgets.length;
  }

  // ── Initialise chips, search, and load ──
  buildStatusChips(statusChipEl, activeStatus, (value) => {
    activeStatus = value;
    loadWidgetList();
  });

  buildCreatorChips(creatorChipEl, WIDGET_DATA, activeCreator, (value) => {
    activeCreator = value;
    loadWidgetList();
  });

  buildSortChips(sortChipEl, activeSortBy, (value) => {
    activeSortBy = value;
    loadWidgetList();
  });

  searchInput.addEventListener('input', function () {
    activeSearch = this.value.trim();
    loadWidgetList();
  });

  loadWidgetList();
});
