/* ==========================================================================
   Help (મદદ): a guided tour of the activity, same pattern as wg160 / wg220 /
   wg257. Spotlight on each part, a short Gujarati note, and an animated hand
   showing the tap. Works in viewport coordinates, so it is independent of
   the stage scale.
   ========================================================================== */
(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);

  const tour = $('#tour');
  const spot = $('#tourSpot');
  const layer = $('#tourDemo');
  const card = $('#tourCard');
  const helpBtn = $('#help-btn');
  const HAND = '<svg viewBox="0 0 24 24" width="40" height="40"><path d="M5 2L5 19L9.5 15L12.5 21.5L15.2 20.3L12.3 13.9L18.5 13.6Z" fill="#fff2e1" stroke="#44200e" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  const GU = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
  const gu = (n) => String(n).split('').map((d) => GU[+d]).join('');

  let stepIndex = 0;
  let token = 0;
  let steps = [];
  let opener = null;

  /* ---------- helpers ---------- */

  const wait = (ms, tok) => new Promise((resolve, reject) => setTimeout(() => (tok === token ? resolve() : reject(new Error('cancel'))), ms));
  const shown = (el) => {
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const centre = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };
  function unionRect(els) {
    const list = els.filter(shown);
    if (!list.length) return null;
    let l = 1e9; let t = 1e9; let r = -1e9; let b = -1e9;
    list.forEach((el) => {
      const x = el.getBoundingClientRect();
      l = Math.min(l, x.left); t = Math.min(t, x.top); r = Math.max(r, x.right); b = Math.max(b, x.bottom);
    });
    return { left: l, top: t, right: r, bottom: b, width: r - l, height: b - t };
  }

  function make(cls, pt, html) {
    const el = document.createElement('div');
    el.className = cls;
    el.innerHTML = html || '';
    el.style.left = `${pt.x}px`;
    el.style.top = `${pt.y}px`;
    layer.appendChild(el);
    return el;
  }
  const ripple = (pt) => { const r = make('tour-ripple', pt); setTimeout(() => r.remove(), 700); };
  const slide = (el, a, b, duration) => el.animate(
    [{ left: `${a.x}px`, top: `${a.y}px` }, { left: `${b.x}px`, top: `${b.y}px` }],
    { duration, easing: 'cubic-bezier(.45,0,.25,1)', fill: 'forwards' }
  );
  function clearDemo() { layer.innerHTML = ''; }

  // Move the hand to each point and press it, over and over (demo only: nothing is clicked).
  async function tapLoop(tok, getPoints) {
    try {
      while (true) {
        const pts = getPoints().filter(Boolean);
        if (!pts.length) return;
        const first = pts[0];
        const hand = make('tour-hand', { x: first.x + 70, y: first.y + 60 }, HAND);
        let prev = { x: first.x + 70, y: first.y + 60 };
        for (const p of pts) {
          slide(hand, prev, p, 650);
          await wait(700, tok);
          hand.classList.add('is-press');
          ripple(p);
          await wait(200, tok);
          hand.classList.remove('is-press');
          prev = p;
          await wait(500, tok);
        }
        await wait(700, tok);
        layer.innerHTML = '';
        await wait(400, tok);
      }
    } catch (e) { /* step changed */ }
  }

  /* ---------- the steps ---------- */

  const rows = () => [...document.querySelectorAll('#rows .row')];
  const firstRow = () => rows()[0];

  const STEPS = [
    {
      title: 'વાક્ય વાંચો',
      text: 'દરેક રાઉન્ડમાં વાર્તાનાં <b>ચાર વાક્ય</b> છે. વાક્ય ધ્યાનથી વાંચો.',
      target: () => unionRect(rows().map((r) => r.querySelector('.sent')))
    },
    {
      title: 'તાળી કે ફરરર',
      text: 'વાક્ય સાચું હોય તો <b>તાળી</b> પાડો, ખોટું હોય તો <b>ફરરર</b> બોલો. પછી દરેક વાક્યની સામે એ બટન દબાવો.',
      target: () => unionRect([...document.querySelectorAll('#rows .pick')]),
      anim: (tok) => tapLoop(tok, () => {
        const r = firstRow();
        return r ? [centre(r.querySelector('.pick[data-v="1"]')), centre(r.querySelector('.pick[data-v="0"]'))] : [];
      })
    },
    {
      title: 'તપાસો',
      text: 'ચારે વાક્યના જવાબ આપ્યા પછી <b>તપાસો</b> દબાવો. સાચો જવાબ લીલો અને ખોટો જવાબ લાલ દેખાશે, સાથે કારણ પણ દેખાશે.',
      target: () => unionRect([$('#checkBtn')]),
      anim: (tok) => tapLoop(tok, () => [centre($('#checkBtn'))])
    },
    {
      title: 'સાચો જવાબ',
      text: 'જવાબ ખબર ન હોય તો <b>સાચો જવાબ</b> દબાવો. તપાસો પહેલાં જ આ ચાલે છે.',
      target: () => unionRect([$('#showBtn')])
    },
    {
      title: 'પછીનો રાઉન્ડ',
      text: 'તપાસ્યા પછી <b>પછીનો રાઉન્ડ</b> દબાવો. કુલ <b>' + gu(5) + ' રાઉન્ડ</b> છે; ઉપર જમણી બાજુએ કેટલા થયા તે દેખાય છે.',
      target: () => unionRect([$('#nextBtn'), $('#progress')])
    },
    {
      title: 'ફરી રમો',
      text: 'ફરીથી પહેલા રાઉન્ડથી શરૂ કરવા <b>ફરી રમો</b> દબાવો.',
      target: () => unionRect([$('#againBtn')])
    },
    {
      title: 'મદદ',
      text: 'આ પગલાં ફરી જોવા માટે ગમે ત્યારે <b>મદદ</b> દબાવો.',
      target: () => unionRect([helpBtn])
    }
  ];

  /* ---------- card placement and rendering ---------- */

  function placeCard(rect) {
    const m = 12; const gap = 18; const W = innerWidth; const H = innerHeight;
    const cw = card.offsetWidth; const ch = card.offsetHeight;
    let top; let left;
    if (!rect) {
      left = (W - cw) / 2;
      top = (H - ch) / 2;
    } else {
      left = rect.left + rect.width / 2 - cw / 2;
      if (rect.bottom + gap + ch <= H - m) top = rect.bottom + gap;
      else if (rect.top - gap - ch >= m) top = rect.top - gap - ch;
      else {
        top = Math.min(H - ch - m, Math.max(m, rect.top + 20));
        left = rect.left + rect.width / 2 < W / 2 ? rect.right + gap : rect.left - gap - cw;
        if (left < m || left + cw > W - m) left = rect.left + rect.width / 2 < W / 2 ? W - cw - m - 16 : m + 16;
      }
    }
    card.style.left = `${Math.max(m, Math.min(W - cw - m, left))}px`;
    card.style.top = `${Math.max(m, Math.min(H - ch - m, top))}px`;
  }

  function go(index) {
    stepIndex = index;
    const tok = ++token;
    clearDemo();
    const step = steps[index];
    const rect = step.target();
    const pad = 10;
    if (rect) {
      spot.hidden = false;
      Object.assign(spot.style, {
        left: `${rect.left - pad}px`, top: `${rect.top - pad}px`,
        width: `${rect.width + pad * 2}px`, height: `${rect.height + pad * 2}px`
      });
    } else {
      spot.hidden = true;
    }
    $('#tourCount').textContent = `પગલું ${gu(index + 1)} / ${gu(steps.length)}`;
    $('#tourTitle').textContent = step.title;
    $('#tourText').innerHTML = step.text;
    $('#tourBack').hidden = index === 0;
    $('#tourNext').textContent = index === steps.length - 1 ? 'સમજાઈ ગયું' : 'આગળ';
    $('#tourDots').innerHTML = steps.map((_, k) => `<i class="${k === index ? 'on' : ''}"></i>`).join('');
    card.classList.remove('enter');
    void card.offsetWidth;
    card.classList.add('enter');
    placeCard(rect);
    if (step.anim && rect) step.anim(tok);
  }

  function open() {
    if (window.TF) window.TF.hideEnd(); // so the end screen does not cover the steps
    steps = STEPS.filter((s) => s.target());
    opener = document.activeElement;
    tour.classList.add('is-open', 'no-anim');
    tour.setAttribute('aria-hidden', 'false');
    go(0);
    requestAnimationFrame(() => requestAnimationFrame(() => tour.classList.remove('no-anim')));
    $('#tourNext').focus();
  }

  function close() {
    token++;
    clearDemo();
    tour.classList.remove('is-open');
    tour.setAttribute('aria-hidden', 'true');
    if (opener && document.body.contains(opener)) opener.focus();
  }

  $('#tourSkip').addEventListener('click', close);
  $('#tourBack').addEventListener('click', () => { if (stepIndex > 0) go(stepIndex - 1); });
  $('#tourNext').addEventListener('click', () => (stepIndex < steps.length - 1 ? go(stepIndex + 1) : close()));
  // Capture phase, so Escape closes only the tour.
  document.addEventListener('keydown', (event) => {
    if (!tour.classList.contains('is-open')) return;
    if (event.key === 'Escape') { event.stopImmediatePropagation(); close(); }
    if (event.key === 'ArrowRight') $('#tourNext').click();
    if (event.key === 'ArrowLeft') $('#tourBack').click();
  }, true);
  let resizeTimer;
  window.addEventListener('resize', () => {
    if (!tour.classList.contains('is-open')) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => go(stepIndex), 150);
  });

  helpBtn.addEventListener('click', open);
}());
