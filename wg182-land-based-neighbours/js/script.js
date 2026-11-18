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

  const CLUE_COUNT = 4;
  const SVG_NS = 'http://www.w3.org/2000/svg';
  // The map frame's top-left corner on the stage (pins and labels are placed inside it).
  const MAP_ORIGIN = [64, 180];
  // Sea and lakes in the base map: taps on these do not count as a guess.
  const SEA_FILL = 'rgb(147, 207, 229)';
  // Flags that are not rectangles: their selection outline follows the flag
  // (points in the 195x110 flag cell, from the layout's flag-highlight layer).
  const FLAG_OUTLINES = {
    nepal: '52,-3.6 52,112 144.4,112 87.4,56 148.9,56',
  };

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

  // The base map and the country shapes are both in stage coordinates
  // (the overlay's viewBox is the map frame), so no transform is needed.
  const buildMap = () => {
    $('mapBase').innerHTML = window.MAP_SVG;

    const layer = $('countryLayer');
    COUNTRIES.forEach((c) => {
      const el = document.createElementNS(SVG_NS, 'g');
      el.setAttribute('class', 'country');
      el.dataset.country = c.key;
      el.style.setProperty('--country-color', c.color);
      if (c.opacity) el.style.setProperty('--country-opacity', c.opacity);
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', 'A country on the map');
      SHAPES[c.key].land.forEach((d) => {
        const p = document.createElementNS(SVG_NS, 'path');
        p.setAttribute('d', d);
        el.appendChild(p);
      });
      layer.appendChild(el);
      countryEls[c.key] = el;
    });
  };

  // What did the tap land on: one of the six countries, other land, or sea?
  const hitAt = (target) => {
    const country = target.closest && target.closest('.country');
    if (country) return { country: country.dataset.country };
    const inBase = target.closest && target.closest('#mapBase');
    if (inBase && target.tagName !== 'svg' && target.id !== 'map-Rectangle_36') {
      const fill = getComputedStyle(target).fill;
      if (fill && fill !== 'none' && fill !== SEA_FILL) return { land: true };
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
     PINS + LABELS (shown once a country is found or revealed)
     ========================================================================== */

  // stage coordinates -> position inside the map frame
  const inMap = ([x, y]) => [x - MAP_ORIGIN[0], y - MAP_ORIGIN[1]];

  const markOnMap = (c) => {
    countryEls[c.key].classList.add('is-found');

    const [x, top, height] = c.pole;
    const [px, py] = inMap([x, top]);
    const pin = document.createElement('span');
    pin.className = 'pin';
    pin.style.left = `${px - 1}px`;
    pin.style.top = `${py}px`;
    pin.style.height = `${height}px`;
    pin.innerHTML = `<img src="assets/images/flag-${c.key}.svg" alt="" style="width:${c.flag[0]}px;height:${c.flag[1]}px">`;
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
      if (FLAG_OUTLINES[c.key]) {
        btn.classList.add('flag--shaped');
        btn.insertAdjacentHTML('beforeend',
          `<svg class="flag__outline" width="195" height="110" viewBox="0 0 195 110" aria-hidden="true"><polygon points="${FLAG_OUTLINES[c.key]}"/></svg>`);
      }
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
    const text = $('clueText');
    text.innerHTML = `<span class="clue-text__inner">${byKey(key).clues[idx]}</span>`;
    // long clues drop to the layout's smaller size so they fit the box
    text.classList.remove('is-small');
    if (text.firstChild.offsetHeight > text.clientHeight) text.classList.add('is-small');
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
      const el = countryEls[tappedKey];
      el.classList.remove('is-wrong');
      void el.getBoundingClientRect();
      el.classList.add('is-wrong');
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
    resultModal.classList.toggle('is-missed', !found);
    $('resultTitle').hidden = found;
    $('resultIntro').hidden = found;
    $('resultCorrect').hidden = !found;
    $('resultNextLine').hidden = found;
    $('resultFlag').src = `assets/images/flag-${c.key}.svg`;
    $('resultFlag').alt = `Flag of ${c.name}`;
    $('resultFlag').classList.toggle('is-shaped', !!FLAG_OUTLINES[c.key]);
    $('resultName').textContent = c.name;
    $('resultCapital').textContent = c.capital;
    $('resultClues').innerHTML = c.clues.map((clue) => `<li>${clue}</li>`).join('');
    setPopup(true);
    fitResultCard();
    $('nextCountryBtn').focus();
  };

  // Long clues would run under the Next Country button,
  // so the clue spacing tightens until the text clears it.
  const fitResultCard = () => {
    const card = $('resultCard');
    card.classList.remove('is-tight');
    const limit = $('nextCountryBtn').getBoundingClientRect().top;
    const last = [...card.querySelectorAll('.result-card__clues li, .result-card__next')]
      .filter((e) => !e.hidden).pop();
    if (last && last.getBoundingClientRect().bottom > limit) card.classList.add('is-tight');
  };

  $('nextCountryBtn').addEventListener('click', () => {
    if (!state.pending) return;
    const { key, found } = state.pending;
    setPopup(false);
    state.pending = null;
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
    $('endText').innerHTML = found === COUNTRIES.length
      ? 'All six <b>land-based</b> neighbours identified'
      : `You identified ${found} of the ${COUNTRIES.length} <b>land-based</b> neighbours`;
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
