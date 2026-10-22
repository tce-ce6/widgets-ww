'use strict';

// In Electron with nodeIntegration, the UMD build of lottie assigns itself to
// module.exports instead of window.lottie — pick it up from there.
if (
  !window.lottie &&
  typeof module === 'object' &&
  module &&
  module.exports &&
  typeof module.exports.loadAnimation === 'function'
) {
  window.lottie = module.exports;
}

document.addEventListener('DOMContentLoaded', () => {
  const COUNTRIES = window.COUNTRIES;
  const SHAPES = window.COUNTRY_SHAPES;
  const T = window.MAP_TRANSFORM;

  const CLUE_COUNT = 4;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  // A point inside southern India that the route lines start from.
  const INDIA_POINT = [340, 540];
  // Singapore is a few pixels across: give it a generous round tap target.
  const SINGAPORE_ZONE = { cx: 716, cy: 716, r: 14 };

  /* ==========================================================================
     DOM + STAGE SCALING
     ========================================================================== */

  const $ = (id) => document.getElementById(id);
  const stage = $('stage');
  const modalStage = $('modal-stage');

  const fitStage = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / 1920, vh / 1080);
    const x = (vw - 1920 * scale) / 2;
    const y = (vh - 1080 * scale) / 2;
    const transform = `translate(${x}px, ${y}px) scale(${scale})`;
    stage.style.transform = transform;
    modalStage.style.transform = transform; // popups share the stage's position and scale
  };

  fitStage();
  window.addEventListener('resize', fitStage);

  // Opens/closes the popup together with its full-viewport backdrop
  // (body.has-modal::before), in the same step so taps never hit a stale backdrop.
  const resultModal = $('resultModal');
  const setPopup = (open) => {
    resultModal.hidden = !open;
    document.body.classList.toggle('has-modal', open);
  };

  /* ==========================================================================
     STATE
     ========================================================================== */

  const state = {
    selected: null, // key of the selected flag
    clueIndex: {}, // key -> index of the clue currently shown (0..3)
    done: {}, // key -> 'found' | 'missed'
    pending: null, // { key, found } shown in the popup
  };

  const byKey = (key) => COUNTRIES.find((c) => c.key === key);
  const doneCount = () => Object.keys(state.done).length;
  const foundCount = () => Object.values(state.done).filter((v) => v === 'found').length;

  const showScreen = (id) => {
    document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('is-active', s.id === id));
  };

  /* ==========================================================================
     MAP
     ========================================================================== */

  const countryEls = {};

  // Countries whose fitted shape (MAP_SHAPES via MAP_TRANSFORM) drifts off the
  // drawn outline: highlight them with the base map's own land path instead.
  const BASE_LAND = { srilanka: 'map-Path_3291' };
  // base map sits at stage (64,180); undo the country group's transform for it
  const BASE_LAND_TRANSFORM = `scale(${1 / T.k}) translate(${64 - T.tx} ${180 - T.ty})`;

  const buildMap = () => {
    $('mapBase').innerHTML = window.MAP_SVG;

    const layer = $('countryLayer');
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('transform', `translate(${T.tx} ${T.ty}) scale(${T.k})`);
    layer.appendChild(g);

    COUNTRIES.forEach((c) => {
      const el = document.createElementNS(SVG_NS, 'g');
      el.setAttribute('class', 'country');
      el.dataset.country = c.key;
      el.style.setProperty('--country-color', c.color);
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', 'A country on the map');
      const shapes = SHAPES[c.key];
      if (shapes.zone) {
        const z = document.createElementNS(SVG_NS, 'path');
        z.setAttribute('d', shapes.zone);
        z.setAttribute('class', 'country__zone');
        el.appendChild(z);
      }
      const baseLand = BASE_LAND[c.key] && $('mapBase').querySelector(`#${BASE_LAND[c.key]} path[fill]`);
      if (baseLand) {
        const p = document.createElementNS(SVG_NS, 'path');
        p.setAttribute('d', baseLand.getAttribute('d'));
        p.setAttribute('transform', BASE_LAND_TRANSFORM);
        el.appendChild(p);
      } else {
        shapes.land.forEach((d) => {
          const p = document.createElementNS(SVG_NS, 'path');
          p.setAttribute('d', d);
          el.appendChild(p);
        });
      }
      g.appendChild(el);
      countryEls[c.key] = el;
    });

    // Singapore's tap ring sits in stage coordinates, above Malaysia/Indonesia.
    const sg = countryEls.singapore;
    const ring = document.createElementNS(SVG_NS, 'circle');
    ring.setAttribute('class', 'country__zone');
    ring.setAttribute('cx', SINGAPORE_ZONE.cx);
    ring.setAttribute('cy', SINGAPORE_ZONE.cy);
    ring.setAttribute('r', SINGAPORE_ZONE.r);
    const sgTop = document.createElementNS(SVG_NS, 'g');
    sgTop.setAttribute('class', 'country');
    sgTop.dataset.country = 'singapore';
    sgTop.style.setProperty('--country-color', byKey('singapore').color);
    sgTop.appendChild(ring);
    layer.appendChild(sgTop);
    countryEls['singapore-zone'] = sgTop;
    g.appendChild(sg); // keep Singapore's real outline above its neighbours too
  };

  const countryElsFor = (key) => [countryEls[key], countryEls[`${key}-zone`]].filter(Boolean);

  // What did the tap land on: one of the six countries, other land, or sea?
  const hitAt = (target) => {
    const country = target.closest && target.closest('.country');
    if (country) return { country: country.dataset.country };
    const inBase = target.closest && target.closest('#mapBase');
    if (inBase && target.tagName !== 'svg' && target.id !== 'map-Rectangle_36') {
      const fill = getComputedStyle(target).fill;
      if (fill && fill !== 'none') return { land: true };
    }
    return {};
  };

  const onMapTap = (target) => {
    if (!state.selected || !resultModal.hidden) return;
    const hit = hitAt(target);
    if (hit.country) attempt(hit.country);
    else if (hit.land) attempt(null);
  };

  $('map').addEventListener('click', (e) => onMapTap(e.target));
  $('map').addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.country')) {
      e.preventDefault();
      onMapTap(e.target);
    }
  });

  /* ==========================================================================
     PINS + ROUTES (shown once a country is found or revealed)
     ========================================================================== */

  // stage coordinates -> position inside the map frame (which starts at 64,180)
  const inMap = ([x, y]) => [x - 64, y - 180];

  const markOnMap = (c) => {
    countryElsFor(c.key).forEach((el) => el.classList.add('is-found'));

    const route = document.createElementNS(SVG_NS, 'line');
    route.setAttribute('class', 'route is-drawing');
    route.setAttribute('x1', INDIA_POINT[0]);
    route.setAttribute('y1', INDIA_POINT[1]);
    route.setAttribute('x2', c.pin[0]);
    route.setAttribute('y2', c.pin[1]);
    $('routeLayer').appendChild(route);

    const [px, py] = inMap(c.pin);
    const pin = document.createElement('span');
    pin.className = 'pin';
    pin.style.left = `${px - 1}px`;
    pin.style.top = `${py - 46}px`;
    pin.innerHTML = `<img src="assets/images/flag-${c.key}.svg" alt="">`;
    $('mapPins').appendChild(pin);

    const [lx, ly] = inMap(c.label);
    const label = document.createElement('span');
    label.className = 'pin-label';
    label.textContent = c.name;
    label.style.left = `${lx}px`;
    label.style.top = `${ly}px`;
    $('mapPins').appendChild(label);
  };

  /* ==========================================================================
     FLAGS + CLUES
     ========================================================================== */

  const buildFlags = () => {
    const box = $('flags');
    COUNTRIES.forEach((c, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'flag';
      btn.dataset.country = c.key;
      btn.setAttribute('aria-label', `Flag ${i + 1}`);
      btn.innerHTML = `<img src="assets/images/flag-${c.key}.svg" alt="">`;
      btn.addEventListener('click', () => selectFlag(c.key));
      box.appendChild(btn);
    });
  };

  let lastActiveClue = null; // flag + clue number last shown, so the blink only runs on a change

  const renderClue = () => {
    const key = state.selected;
    $('clueHint').hidden = !!key;
    $('clueDots').hidden = !key;
    $('clueText').hidden = !key;
    $('clueQuestion').hidden = !key;
    if (!key) {
      $('clueWrong').hidden = true;
      return;
    }
    const idx = state.clueIndex[key] || 0;
    const activeKey = `${key}:${idx}`;
    const changed = activeKey !== lastActiveClue;
    lastActiveClue = activeKey;
    $('clueDots').querySelectorAll('i').forEach((dot, i) => {
      dot.classList.toggle('is-on', i <= idx);
      // the current clue gets a ring, and blinks 3 times when it becomes the current one
      dot.classList.toggle('is-active', i === idx);
      dot.classList.remove('is-blink');
      if (i === idx && changed) {
        void dot.offsetWidth;
        dot.classList.add('is-blink');
      }
    });
    $('clueDots').setAttribute('aria-label', `Clue ${idx + 1} of ${CLUE_COUNT}`);
    // Wrapped in one span so <sup>/<sub> stay inline (bare text + tags would
    // each become a separate item of the flex-centred .clue-text box).
    $('clueText').innerHTML = `<span class="clue-text__inner">${byKey(key).clues[idx]}</span>`;
  };

  const selectFlag = (key) => {
    if (state.done[key]) return;
    state.selected = key;
    if (state.clueIndex[key] === undefined) state.clueIndex[key] = 0;
    document.querySelectorAll('.flag').forEach((f) => {
      const on = f.dataset.country === key;
      f.classList.toggle('is-selected', on);
      f.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    $('map').classList.add('is-armed');
    $('clueWrong').hidden = true;
    renderClue();
  };

  /* ==========================================================================
     ATTEMPTS
     ========================================================================== */

  // tappedKey: one of the six countries, or null for any other land
  const attempt = (tappedKey) => {
    const key = state.selected;
    if (tappedKey === key) {
      openResult(key, true);
      return;
    }
    if (tappedKey) {
      countryElsFor(tappedKey).forEach((el) => {
        el.classList.remove('is-wrong');
        void el.getBoundingClientRect();
        el.classList.add('is-wrong');
      });
    }
    if (state.clueIndex[key] < CLUE_COUNT - 1) {
      state.clueIndex[key]++;
      renderClue();
      $('clueWrong').hidden = false;
    } else {
      // all four clues used: reveal the answer
      openResult(key, false);
    }
  };

  const openResult = (key, found) => {
    const c = byKey(key);
    state.pending = { key, found };
    const card = $('resultCard');
    card.classList.toggle('is-missed', !found);
    $('resultTitle').textContent = found ? 'You guessed it right! Congratulations!' : 'Better Luck Next Time';
    $('resultIntro').innerHTML = found ? '' : 'You used all the clues.<br>The correct answer is';
    $('resultIntro').hidden = found;
    $('resultFlag').src = `assets/images/flag-${c.key}.svg`;
    $('resultFlag').alt = `Flag of ${c.name}`;
    $('resultName').textContent = c.name;
    $('resultCapital').textContent = c.capital;
    $('resultClues').innerHTML = c.clues.map((clue) => `<li>${clue}</li>`).join('');
    $('resultNextLine').textContent = found ? '' : "Let's see if you can identify the next maritime neighbour.";
    $('resultNextLine').hidden = found;
    setPopup(true);
    fitResultCard();
    $('nextCountryBtn').focus();
  };

  // Long clues (e.g. Malaysia's) would run under the Next Country button,
  // so the clue spacing tightens until the text clears it.
  const fitResultCard = () => {
    const card = $('resultCard');
    card.classList.remove('is-tight');
    const limit = card.getBoundingClientRect().top
      + (card.offsetHeight - 60) * (card.getBoundingClientRect().height / card.offsetHeight);
    const last = [...card.querySelectorAll('.result-card__clues li, .result-card__next')]
      .filter((e) => !e.hidden).pop();
    if (last && last.getBoundingClientRect().bottom > limit) card.classList.add('is-tight');
  };

  $('nextCountryBtn').addEventListener('click', () => {
    if (!state.pending) return;
    const { key, found } = state.pending;
    setPopup(false);
    state.done[key] = found ? 'found' : 'missed';
    state.selected = null;
    const flag = document.querySelector(`.flag[data-country="${key}"]`);
    flag.classList.remove('is-selected');
    flag.classList.add('is-done');
    flag.disabled = true;
    $('map').classList.remove('is-armed');
    markOnMap(byKey(key));
    renderClue();
    if (doneCount() === COUNTRIES.length) finishMission();
  });

  /* ==========================================================================
     END OF MISSION
     ========================================================================== */

  let badgeAnim = null;

  const finishMission = () => {
    const found = foundCount();
    $('endText').textContent = found === COUNTRIES.length
      ? 'All six maritime neighbours identified'
      : `You identified ${found} of the ${COUNTRIES.length} maritime neighbours`;
    $('endPanel').hidden = false;
    $('flagPanel').hidden = true;
    const badge = $('badge');
    badge.innerHTML = '';
    if (window.lottie && window.ANIM_DATA) {
      if (badgeAnim) badgeAnim.destroy();
      badgeAnim = window.lottie.loadAnimation({
        container: badge,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: window.ANIM_DATA.badge,
      });
    } else {
      badge.innerHTML = '<img src="assets/images/badge.svg" alt="" style="width:100%;height:100%">';
    }
    $('homeBtn').focus();
  };

  const resetMission = () => {
    state.selected = null;
    state.clueIndex = {};
    state.done = {};
    state.pending = null;
    setPopup(false);
    if (badgeAnim) {
      badgeAnim.destroy();
      badgeAnim = null;
    }
    $('endPanel').hidden = true;
    $('flagPanel').hidden = false;
    $('routeLayer').innerHTML = '';
    $('mapPins').innerHTML = '';
    Object.values(countryEls).forEach((el) => el.classList.remove('is-found', 'is-wrong'));
    document.querySelectorAll('.flag').forEach((f) => {
      f.classList.remove('is-selected', 'is-done');
      f.disabled = false;
      f.removeAttribute('aria-pressed');
    });
    $('map').classList.remove('is-armed');
    renderClue();
  };

  $('startBtn').addEventListener('click', () => {
    resetMission();
    showScreen('screen-game');
  });

  $('homeBtn').addEventListener('click', () => {
    resetMission();
    showScreen('screen-intro');
  });

  /* ==========================================================================
     TEST HELPER
     Jumps straight to the end of the mission, from the console:
       goToResult()     all six identified
       goToResult(4)    4 identified, the other 2 revealed after using all clues
     ========================================================================== */

  window.goToResult = (found = COUNTRIES.length) => {
    const n = Math.max(0, Math.min(COUNTRIES.length, Math.round(found)));
    resetMission();
    showScreen('screen-game');
    COUNTRIES.forEach((c, i) => {
      state.pending = { key: c.key, found: i < n };
      setPopup(true);
      $('nextCountryBtn').click();
    });
    console.log(`Result screen: ${n} of ${COUNTRIES.length} identified`);
  };

  buildMap();
  buildFlags();
  renderClue();
});
