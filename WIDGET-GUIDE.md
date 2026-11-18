# Widget Build Guide

## 1. Before you start

✏️ **Fill in for this widget:**
- Widget id and slug: `wgXXX-<kebab-name>`
- Screens list (intro / activity / summary / …):
- Main interaction (drag and drop / tap / draw / slider / …):
- i-text for each screen (copy it exactly from the sheet):
- Modals needed (leave confirmation / insights / info / …):

---

## 2. Folder structure

```
wgXXX-name/
├── index.html
├── css/
│   ├── global_style.css   ← @font-face only
│   └── style.css          ← everything else
├── js/
│   ├── content-data.js    ← all text and data (no logic)
│   ├── script.js          ← stage, screens, interaction
│   └── how-to-play.js     ← help tour (inner pages only)
└── assets/
    ├── font/              ← roboto-regular / -medium / -bold .ttf
    ├── images/            ← png, help-btn.svg, home-btn.svg …
    └── svg/
```

**Asset rules**
- Use lowercase kebab-case filenames only (`close-btn.svg`, not `Close_Btn.SVG`). The server and the exe are case-sensitive.
- References must match the filename case exactly.
- Do not use `fetch()` for local JSON or data. It fails on `file://`. Put data in `content-data.js` as a global instead.
- If you copied the folder from another widget, **delete every asset the new widget does not reference.** Grep before you delete.

---

## 3. index.html skeleton

```html
<body id="<widget-name>-widget">
  <div class="container">
    <div class="mainContainerOuter">
      <div class="wdgetTitle">
        <h2>&ZeroWidthSpace;Widget Title&ZeroWidthSpace;</h2>
        <span id="versionId" class="versionText">b4_wgXXX_YYMMDD_01</span>
      </div>

      <div id="viewport">
        <div id="stage">             <!-- fixed 1920x1080 -->
          <section id="screen-intro" class="screen is-active" data-screen="intro">…</section>
          <section id="screen-xxx"   class="screen" data-screen="xxx">…</section>
        </div>
      </div>

      <div id="modal-layer">
        <div id="modal-stage">       <!-- same 1920x1080, scaled with #stage -->
          <div class="modal" id="leaveModal" role="dialog" aria-modal="true" hidden>…</div>
        </div>
      </div>
    </div>
  </div>

  <!-- tour markup goes here (see section 7) -->

  <script src="./js/content-data.js"></script>
  <script src="./js/script.js"></script>
  <script src="./js/how-to-play.js"></script>
</body>
```

✏️ **Fill in:** the markup inside each screen. Build it from the XD artboards, one `<section>` per artboard group.

---

## 4. Stage scaling

Author everything in **1920x1080 px** with absolute positions taken straight from XD, then scale the stage as one unit:

```js
const fitStage = () => {
  const vw = innerWidth, vh = innerHeight;
  const s = Math.min(vw / 1920, vh / 1080);
  const t = `translate(${(vw - 1920 * s) / 2}px, ${(vh - 1080 * s) / 2}px) scale(${s})`;
  stage.style.transform = t;
  modalStage.style.transform = t;   // modals share the same scale
};
fitStage();
addEventListener('resize', fitStage);
```

```css
html, body { height: 100%; margin: 0; }   /* prevents a background seam */
#stage, #modal-stage {
  position: absolute; left: 0; top: 0;
  width: 1920px; height: 1080px; transform-origin: 0 0; overflow: hidden;
}
```

For drag and drop, convert pointer positions to stage coordinates:

```js
const r = stage.getBoundingClientRect(), s = r.width / 1920;
const pt = { x: (e.clientX - r.left) / s, y: (e.clientY - r.top) / s };
```

---

## 5. Header (same in every widget)

The header sits **outside** the stage, so it does not scale.

```css
#<widget>-widget .wdgetTitle {
  position: fixed; left: 0; top: 0; width: 100%;
  display: flex; align-items: center; gap: 20px;
  z-index: 4;                    /* above the modal backdrop */
}
#<widget>-widget .wdgetTitle h2 {
  font-size: 25px; font-weight: 600;
  padding: 8px 40px;
  border-radius: 0 0 20px 20px;
  white-space: nowrap;
  background: var(--title);      /* ✏️ colour from XD */
  color: #fff;
}
#<widget>-widget .versionText {
  position: absolute; right: 20px; top: 10px;
  font-size: 12px; color: rgb(255 255 255 / 25%);
}
```

✏️ **Fill in:** the header colour, and whether any screen hides the title (wg187 hides it on the summary screen).

---

## 6. Modal backdrop (full viewport)

The backdrop must cover the **whole window**, not only the stage. It is a `body::before`, toggled automatically:

```css
#viewport, #modal-layer { position: fixed; inset: 0; overflow: hidden; }
#viewport    { z-index: 1; }
body.has-modal::before {
  content: ""; position: fixed; inset: 0; z-index: 2;
  background: rgba(0, 0, 0, 0.8);
}
#modal-layer { z-index: 3; pointer-events: none; }
body.has-modal #modal-layer { pointer-events: auto; }
```

```js
const modals = [...document.querySelectorAll('.modal')];
const sync = () => body.classList.toggle('has-modal', modals.some(m => !m.hidden));
const mo = new MutationObserver(sync);
modals.forEach(m => mo.observe(m, { attributes: true, attributeFilter: ['hidden'] }));
sync();
```

Open a modal with `el.hidden = false`, then focus its first button. Close it with `hidden = true`, then return focus to the element that opened it.

The layers, from bottom to top: viewport (1), backdrop (2), modal (3), header (4), tour (above everything).

✏️ **Fill in:** the modal card designs and their buttons.

---

## 7. How to play (help tour)

Copy `js/how-to-play.js`, the `#tour` markup and the tour CSS from **wg202**, plus `assets/images/help-btn.svg`.

**Rules**
- **Do not auto-start it.** It opens only when the help button is clicked.
- Show the help button on **inner pages only**, never on the home or intro screen.
- Tour text must describe **only interactions that exist**. Do not mention tapping if the widget only supports dragging.

Tour markup (place it after the container, before the scripts):

```html
<div id="tour" class="tour" aria-hidden="true">
  <div id="tourSpot" class="tour-spot"></div>
  <div id="tourDemo" class="tour-demo"></div>
  <div id="tourCard" class="tour-card" role="dialog" aria-modal="true" aria-labelledby="tourTitle">
    <button id="tourSkip" class="tour-skip" type="button" aria-label="Close how to play">&times;</button>
    <div id="tourCount" class="tour-count"></div>
    <h2 id="tourTitle"></h2>
    <p id="tourText"></p>
    <div class="tour-nav">
      <div id="tourDots" class="tour-dots"></div>
      <div class="tour-btns">
        <button id="tourBack" class="tour-btn tour-btn--ghost" type="button">Back</button>
        <button id="tourNext" class="tour-btn" type="button">Next</button>
      </div>
    </div>
  </div>
</div>
```

Steps are keyed by the screen's `data-screen`:

```js
const STEPS = {
  problem: [
    {
      title: 'Drag a tool into a box',
      text: 'Press and hold a tool, drag it into a box, then let go.',
      target: () => unionRect([...chips(), ...boxes()]),
      anim: (tok) => dragLoop(tok, () => chips()[0], () => boxes()[0])
    },
    // ✏️ more steps
  ],
};
```

Available demo animations: `dragLoop` (press, carry, drop), `tapLoop` (tap ripple) and `popLoop` (highlight pulse).

> ⚠️ When you choose a spotlight `target`, pass the **actual items** (an array of chips or boxes). Do not pass a wrapper that is `inset: 0`, or the spotlight will cover the whole stage.

✏️ **Fill in:** the step list for each inner screen (keep it to 3–6 steps), and which screens get the button.

---

## 8. Drag and drop pattern

- Use pointer events: `pointerdown` → `pointermove` → `pointerup` / `pointercancel`.
- Start the drag only after an **8 px move threshold**. A press that barely moves does nothing.
- Create a ghost copy of the item that follows the pointer. Leave the original in place, dimmed.
- Find the drop target with `document.elementsFromPoint(x, y)`, then `.closest('.box')`.
- If the drop is invalid, animate the ghost back and remove it.

✏️ **Fill in:** what counts as a correct drop, what feedback is shown, and whether wrong items return to the tray or stay.

---

## 9. Content data

Keep all copy in `content-data.js` so text fixes never touch logic:

```js
window.WIDGET_DATA = {
  intro:   { itext: '…' },
  items:   [ /* ✏️ */ ],
  rounds:  [ /* ✏️ */ ],
  summary: { /* ✏️ */ }
};
```

✏️ **Fill in:** the data shape for this widget.

---

## 10. Accessibility checklist

- [ ] `&ZeroWidthSpace;` wraps the title in `<title>` and `<h2>`
- [ ] Every button has a visible label or an `aria-label`
- [ ] Decorative images use `alt=""`
- [ ] Feedback areas have `role="status"` / `aria-live="polite"`
- [ ] Modals have `role="dialog" aria-modal="true"`, focus moves in, Esc closes them, focus returns
- [ ] `:focus-visible` outline is visible against the background
- [ ] ✏️ Keyboard alternative for the main interaction (decide per widget; drag-only widgets need a plan here)

---

## 11. Testing before handover

- [ ] Open via `file://` **and** through the server. Both must load all assets.
- [ ] Resize from 1280x720 up to 2560x1440. Nothing should shift relative to the stage.
- [ ] Check every screen against the XD artboard side by side.
- [ ] Modal backdrop covers the full window, and the header stays above it.
- [ ] Help button is absent on home, present on inner pages, and the tour only opens on click.
- [ ] Tour spotlight boxes the right element on every step.
- [ ] Grep for unused assets and remove them.
- [ ] Bump `versionText` (`b4_wgXXX_YYMMDD_NN`).

✏️ **Fill in:** widget-specific test cases (every correct answer path, every wrong answer path, restart).

---

## 12. Open questions / notes

✏️ _Use this section for anything the design, sheet and brief disagree on, and what was decided._
